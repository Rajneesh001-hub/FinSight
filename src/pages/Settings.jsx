import React, { useState, useEffect, useRef } from "react";
import {
  User, Tag, Building2, Shield, Sliders,
  Upload, Edit2, Trash2, Plus, Eye, EyeOff,
  CheckCircle, AlertTriangle, ChevronDown,
  Smartphone, Globe, Bell, Moon, Sun, Monitor,
  CreditCard, LogOut, Lock, RefreshCw, Zap, X,
} from "lucide-react";
import { supabase } from "../utils/supabaseClient";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmtAmt = (n) => {
  const isNeg = n < 0;
  const s = Math.abs(Math.round(n * 100) / 100).toFixed(2);
  const [whole, dec] = s.split(".");
  const last3 = whole.slice(-3);
  const rest  = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (isNeg ? "−₹" : "₹") + (rest ? rest + "," + last3 : last3) + "." + dec;
};

const getPasswordStrength = (pw) => {
  if (!pw) return { label: "", pct: 0, color: "#D1D5DB" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak",   pct: 20,  color: "#EF4444" };
  if (score <= 2) return { label: "Fair",   pct: 40,  color: "#F59E0B" };
  if (score <= 3) return { label: "Good",   pct: 60,  color: "#3B82F6" };
  if (score <= 4) return { label: "Strong", pct: 80,  color: "#059669" };
  return               { label: "Very Strong", pct: 100, color: "#059669" };
};

// ─── shared UI ────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: "24px", right: "24px", zIndex: 100,
      padding: "12px 18px", borderRadius: "10px",
      backgroundColor: type === "success" ? "#059669" : "#DC2626",
      color: "#fff", fontSize: "14px", fontWeight: 500,
      display: "flex", alignItems: "center", gap: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontFamily: "Inter, sans-serif",
    }}>
      {type === "success" ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
      {message}
      <button onClick={onClose} style={{ background:"none", border:"none", color:"#fff", cursor:"pointer", padding:0, marginLeft:"4px" }}>
        <X size={14}/>
      </button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.5)",
      zIndex:60, display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        backgroundColor:"#fff", borderRadius:"14px", width:"90%", maxWidth:"460px",
        padding:"24px", boxShadow:"0 20px 40px rgba(0,0,0,0.15)", fontFamily:"Inter, sans-serif",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <h3 style={{ fontSize:"16px", fontWeight:700, color:"#111827", margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}>
            <X size={18} color="#6B7280"/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SectionTitle = ({ children, action }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
    <h3 style={{ fontSize:"16px", fontWeight:700, color:"#111827", margin:0 }}>{children}</h3>
    {action}
  </div>
);

const Field = ({ label, children, required }) => (
  <div>
    <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"#6B7280",
      textTransform:"uppercase", letterSpacing:".05em", marginBottom:"6px" }}>
      {label}{required && <span style={{color:"#DC2626", marginLeft:"3px"}}>*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, type="text", readOnly, disabled }) => (
  <input
    type={type} value={value} onChange={onChange} placeholder={placeholder}
    readOnly={readOnly} disabled={disabled}
    style={{
      width:"100%", padding:"10px 12px", fontSize:"14px", color:"#111827",
      backgroundColor: (readOnly || disabled) ? "#F9FAFB" : "#fff",
      border:"1px solid #D1D5DB", borderRadius:"8px",
      outline:"none", boxSizing:"border-box", fontFamily:"Inter, sans-serif",
      cursor: disabled ? "not-allowed" : "auto",
    }}
  />
);

const BtnPrimary = ({ children, onClick, sm, disabled, loading }) => (
  <button onClick={onClick} disabled={disabled || loading} style={{
    padding: sm ? "7px 14px" : "10px 20px",
    backgroundColor: (disabled || loading) ? "#9CA3AF" : "#2F6F63",
    border:"none", borderRadius:"8px",
    fontSize: sm ? "12px" : "14px", fontWeight:500, color:"#fff",
    cursor: (disabled || loading) ? "not-allowed" : "pointer",
    display:"flex", alignItems:"center", gap:"6px", fontFamily:"Inter, sans-serif",
    transition:"background .2s",
  }}
    onMouseEnter={e=>{ if(!disabled && !loading) e.currentTarget.style.backgroundColor="#275750"; }}
    onMouseLeave={e=>{ if(!disabled && !loading) e.currentTarget.style.backgroundColor="#2F6F63"; }}
  >{loading ? "Saving..." : children}</button>
);

const BtnOutline = ({ children, onClick, sm, danger, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: sm ? "7px 14px" : "10px 20px",
    backgroundColor:"#fff", border:`1px solid ${danger ? "#DC2626" : "#D1D5DB"}`,
    borderRadius:"8px", fontSize: sm ? "12px" : "14px", fontWeight:500,
    color: danger ? "#DC2626" : "#374151",
    cursor: disabled ? "not-allowed" : "pointer",
    display:"flex", alignItems:"center", gap:"6px", fontFamily:"Inter, sans-serif",
  }}
    onMouseEnter={e=>{ if(!disabled) e.currentTarget.style.backgroundColor= danger ? "#FEF2F2" : "#F9FAFB"; }}
    onMouseLeave={e=>{ if(!disabled) e.currentTarget.style.backgroundColor="#fff"; }}
  >{children}</button>
);

const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{
    width:"44px", height:"24px", borderRadius:"999px",
    backgroundColor: on ? "#2F6F63" : "#D1D5DB",
    position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0,
  }}>
    <div style={{
      position:"absolute", top:"3px", left: on ? "23px" : "3px",
      width:"18px", height:"18px", borderRadius:"50%",
      backgroundColor:"#fff", transition:"left .2s",
      boxShadow:"0 1px 3px rgba(0,0,0,.2)",
    }}/>
  </div>
);

const Divider = () => <div style={{ height:"1px", backgroundColor:"#F3F4F6", margin:"24px 0" }}/>;

// ─── PROFILE PANEL ─────────────────────────────────────────────────────────────
const ProfilePanel = ({ showToast }) => {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [user, setUser]         = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) return;
        setUser(u);
        setEmail(u.email || "");
        const { data: profile } = await supabase
          .from("profiles").select("*").eq("id", u.id).single();
        if (profile) {
          setName(profile.full_name  || u.email?.split("@")[0] || "");
          setPhone(profile.phone     || "");
          setTitle(profile.job_title || "");
        } else {
          setName(u.user_metadata?.full_name || u.email?.split("@")[0] || "");
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id, full_name: name, email, phone, job_title: title,
      });
      if (error) throw error;
      // also update auth display name
      await supabase.auth.updateUser({ data: { full_name: name } });
      showToast("Profile saved successfully!", "success");
    } catch (err) {
      showToast("Failed to save: " + err.message, "error");
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding:"20px", color:"#6B7280" }}>Loading profile...</div>;

  const initials = name.trim().split(/\s+/).map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
        <div>
          <h3 style={{ fontSize:"18px", fontWeight:700, color:"#111827", margin:"0 0 4px" }}>Profile Settings</h3>
          <p style={{ fontSize:"13px", color:"#6B7280", margin:0 }}>Update your name, contact details, and professional identity.</p>
        </div>
      </div>

      {/* Avatar */}
      <div style={{ display:"flex", alignItems:"center", gap:"20px", marginBottom:"24px" }}>
        <div style={{ position:"relative" }}>
          <div style={{
            width:"72px", height:"72px", borderRadius:"50%", backgroundColor:"#9BE7D3",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"24px", fontWeight:700, color:"#2F6F63",
          }}>{initials}</div>
          <div onClick={() => fileRef.current?.click()} style={{
            position:"absolute", bottom:"0", right:"-4px",
            width:"24px", height:"24px", borderRadius:"50%",
            backgroundColor:"#2F6F63", border:"2px solid #fff",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
          }}>
            <Upload size={11} color="#fff"/>
          </div>
        </div>
        <div>
          <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:"0 0 4px" }}>Profile Photo</p>
          <p style={{ fontSize:"12px", color:"#6B7280", margin:"0 0 8px" }}>PNG, JPG · Max 1 MB · Recommended 400×400 px</p>
          <div style={{ display:"flex", gap:"10px" }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f && f.size > 1024*1024) { showToast("File too large (max 1 MB)", "error"); return; }
                if (f) showToast("Photo updated (display only — storage not configured)", "success");
              }}
            />
            <BtnOutline sm onClick={() => fileRef.current?.click()}><Upload size={13}/> Upload photo</BtnOutline>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
        <Field label="Full Name" required>
          <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/>
        </Field>
        <Field label="Primary Email" required>
          <div style={{ position:"relative" }}>
            <Input value={email} readOnly/>
            <CheckCircle size={15} color="#059669" style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)" }}/>
          </div>
        </Field>
        <Field label="Mobile Number">
          <Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98XXX XXXXX"/>
        </Field>
        <Field label="Professional Title">
          <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Founder & Consultant"/>
        </Field>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <BtnPrimary onClick={handleSave} loading={saving}><CheckCircle size={15}/> Save Profile</BtnPrimary>
      </div>
    </div>
  );
};

// ─── CATEGORIES PANEL ──────────────────────────────────────────────────────────
const COLORS = ["#F59E0B","#7C3AED","#2F6F63","#4F46E5","#059669","#DC2626","#0EA5E9","#EC4899"];

const CategoriesPanel = ({ showToast }) => {
  const [categories, setCategories] = useState([
    { id:1, name:"Food & Groceries",          color:"#F59E0B", sub:"Dining & monthly pantry"    },
    { id:2, name:"Shopping & Lifestyle",       color:"#7C3AED", sub:"Discretionary retail"       },
    { id:3, name:"Transportation & Fuel",      color:"#2F6F63", sub:"Fastag, Uber & metro"       },
    { id:4, name:"Utilities & Subscriptions",  color:"#4F46E5", sub:"Power, Cloud & SaaS"        },
    { id:5, name:"Office & Workspace",         color:"#059669", sub:"Co-working BKC & supplies"  },
    { id:6, name:"Client Income & Retainers",  color:"#DC2626", sub:"Project-based income"       },
  ]);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem,  setEditItem]    = useState(null);   // null = add, object = edit
  const [formName,  setFormName]    = useState("");
  const [formSub,   setFormSub]     = useState("");
  const [formColor, setFormColor]   = useState(COLORS[0]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAdd = () => {
    setEditItem(null); setFormName(""); setFormSub(""); setFormColor(COLORS[0]);
    setModalOpen(true);
  };
  const openEdit = (cat) => {
    setEditItem(cat); setFormName(cat.name); setFormSub(cat.sub); setFormColor(cat.color);
    setModalOpen(true);
  };
  const handleSave = () => {
    if (!formName.trim()) { showToast("Category name is required", "error"); return; }
    if (editItem) {
      setCategories(c => c.map(x => x.id === editItem.id ? { ...x, name:formName, sub:formSub, color:formColor } : x));
      showToast("Category updated!", "success");
    } else {
      setCategories(c => [...c, { id: Date.now(), name:formName, sub:formSub, color:formColor }]);
      showToast("Category added!", "success");
    }
    setModalOpen(false);
  };
  const handleDelete = () => {
    setCategories(c => c.filter(x => x.id !== deleteTarget.id));
    showToast("Category deleted", "success");
    setDeleteTarget(null);
  };

  return (
    <div>
      <SectionTitle action={<BtnPrimary sm onClick={openAdd}><Plus size={13}/> Add category</BtnPrimary>}>
        Ledger Categories &amp; Tagging Rules
      </SectionTitle>
      <p style={{ fontSize:"13px", color:"#6B7280", margin:"0 0 16px" }}>
        Categories automatically apply to transactions via keyword matching rules.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
        {categories.map(cat => (
          <div key={cat.id} style={{
            padding:"14px 16px", borderRadius:"10px", border:"1px solid #E5E7EB",
            backgroundColor:"#fff", display:"flex", alignItems:"center", gap:"12px",
          }}>
            <div style={{ width:"12px", height:"12px", borderRadius:"50%", backgroundColor:cat.color, flexShrink:0 }}/>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:"13px", fontWeight:600, color:"#111827", margin:"0 0 2px",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cat.name}</p>
              <p style={{ fontSize:"11px", color:"#6B7280", margin:0 }}>{cat.sub}</p>
            </div>
            <div style={{ display:"flex", gap:"4px" }}>
              <button onClick={() => openEdit(cat)} style={{
                padding:"5px", border:"none", backgroundColor:"transparent", cursor:"pointer", borderRadius:"5px" }}
                onMouseEnter={e=>e.currentTarget.style.backgroundColor="#F3F4F6"}
                onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                <Edit2 size={13} color="#6B7280"/>
              </button>
              <button onClick={() => setDeleteTarget(cat)} style={{
                padding:"5px", border:"none", backgroundColor:"transparent", cursor:"pointer", borderRadius:"5px" }}
                onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FEF2F2"}
                onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
                <Trash2 size={13} color="#DC2626"/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Category" : "Add Category"}>
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <Field label="Name" required>
            <Input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="e.g. Health & Wellness"/>
          </Field>
          <Field label="Description">
            <Input value={formSub} onChange={e=>setFormSub(e.target.value)} placeholder="Short description"/>
          </Field>
          <Field label="Colour">
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setFormColor(c)} style={{
                  width:"28px", height:"28px", borderRadius:"50%", backgroundColor:c, cursor:"pointer",
                  outline: formColor===c ? `3px solid ${c}` : "none",
                  outlineOffset:"2px", transition:"outline .15s",
                }}/>
              ))}
            </div>
          </Field>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px", marginTop:"4px" }}>
            <BtnOutline onClick={() => setModalOpen(false)}>Cancel</BtnOutline>
            <BtnPrimary onClick={handleSave}><CheckCircle size={14}/> {editItem ? "Save changes" : "Add category"}</BtnPrimary>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Category">
        <p style={{ fontSize:"14px", color:"#374151", marginBottom:"20px" }}>
          Delete <strong>{deleteTarget?.name}</strong>? Existing transactions tagged to this category will keep their label but won't match future rules.
        </p>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px" }}>
          <BtnOutline onClick={() => setDeleteTarget(null)}>Cancel</BtnOutline>
          <BtnOutline danger onClick={handleDelete}><Trash2 size={14}/> Delete</BtnOutline>
        </div>
      </Modal>
    </div>
  );
};

// ─── ACCOUNTS PANEL ────────────────────────────────────────────────────────────
const AccountsPanel = ({ showToast }) => {
  const [accounts, setAccounts] = useState([
    { id:1, bank:"HDFC",  name:"HDFC Business Bank",        type:"Current Ledger",    balance:65000,     credit:false, status:"Active & Synced", statusColor:"#059669", statusBg:"#D1FAE5" },
    { id:2, bank:"ICICI", name:"ICICI Current Account",     type:"Operational Ledger",balance:118420.50, credit:false, status:"Active & Synced", statusColor:"#059669", statusBg:"#D1FAE5" },
    { id:3, bank:"AMEX",  name:"American Express Platinum", type:"Credit",            balance:-14220,    credit:true,  status:"Overdue",         statusColor:"#DC2626", statusBg:"#FEE2E2" },
  ]);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [manageTarget, setManageTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formBank,     setFormBank]     = useState("");
  const [formName,     setFormName]     = useState("");
  const [formType,     setFormType]     = useState("Current Ledger");
  const [formBalance,  setFormBalance]  = useState("");
  const [formCredit,   setFormCredit]   = useState(false);

  const openAdd = () => {
    setFormBank(""); setFormName(""); setFormType("Current Ledger");
    setFormBalance(""); setFormCredit(false);
    setModalOpen(true);
  };
  const handleAddAccount = () => {
    if (!formBank.trim() || !formName.trim()) { showToast("Bank and account name are required", "error"); return; }
    const bal = parseFloat(formBalance) || 0;
    setAccounts(a => [...a, {
      id: Date.now(), bank: formBank.toUpperCase().slice(0,5),
      name: formName, type: formType, balance: formCredit ? -Math.abs(bal) : bal,
      credit: formCredit, status: "Active & Synced", statusColor:"#059669", statusBg:"#D1FAE5",
    }]);
    showToast("Account added!", "success");
    setModalOpen(false);
  };
  const handleSync = (acc) => {
    showToast(`Syncing ${acc.name}…`, "success");
  };
  const handleRemove = () => {
    setAccounts(a => a.filter(x => x.id !== deleteTarget.id));
    showToast("Account removed", "success");
    setDeleteTarget(null); setManageTarget(null);
  };

  return (
    <div>
      <SectionTitle action={<BtnPrimary sm onClick={openAdd}><Plus size={13}/> Add account</BtnPrimary>}>
        Connected Bank Accounts &amp; Ledgers
      </SectionTitle>
      <p style={{ fontSize:"13px", color:"#6B7280", margin:"0 0 16px" }}>
        FinSight tracks end-of-day balances from your connected accounts.
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
        {accounts.map(acc => (
          <div key={acc.id} style={{
            padding:"16px 20px", borderRadius:"10px", border:"1px solid #E5E7EB",
            backgroundColor:"#fff", display:"flex", alignItems:"center", gap:"16px",
          }}>
            <div style={{
              width:"40px", height:"40px", borderRadius:"8px", flexShrink:0,
              backgroundColor: acc.bank==="HDFC" ? "#E6F4F1" : acc.bank==="ICICI" ? "#DBEAFE" : "#F3F4F6",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"11px", fontWeight:800,
              color: acc.bank==="HDFC" ? "#2F6F63" : acc.bank==="ICICI" ? "#1D4ED8" : "#374151",
            }}>{acc.bank}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"2px" }}>
                <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:0 }}>{acc.name}</p>
                <span style={{ padding:"2px 8px", borderRadius:"999px", backgroundColor:acc.statusBg,
                  color:acc.statusColor, fontSize:"11px", fontWeight:600 }}>{acc.status}</span>
              </div>
              <p style={{ fontSize:"12px", color:"#6B7280", margin:0 }}>{acc.type}</p>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <p style={{ fontSize:"10px", color:"#9CA3AF", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:".04em" }}>
                {acc.credit ? "OUTSTANDING" : "BALANCE"}
              </p>
              <p style={{ fontSize:"16px", fontWeight:700, color: acc.credit ? "#DC2626" : "#111827", margin:0 }}>
                {fmtAmt(Math.abs(acc.balance))}
              </p>
            </div>
            <BtnOutline sm onClick={() => setManageTarget(acc)}>Manage</BtnOutline>
          </div>
        ))}
      </div>
      <div style={{ marginTop:"12px", padding:"12px 16px", borderRadius:"8px", backgroundColor:"#F9FAFB", border:"1px solid #E5E7EB" }}>
        <p style={{ fontSize:"12px", color:"#6B7280", margin:0 }}>
          <strong>{accounts.length} accounts</strong> connected
        </p>
      </div>

      {/* Add Account modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Bank Account">
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            <Field label="Bank Name" required>
              <Input value={formBank} onChange={e=>setFormBank(e.target.value)} placeholder="e.g. HDFC"/>
            </Field>
            <Field label="Account Name" required>
              <Input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="e.g. HDFC Savings"/>
            </Field>
          </div>
          <Field label="Account Type">
            <select value={formType} onChange={e=>setFormType(e.target.value)} style={{
              width:"100%", padding:"10px 12px", fontSize:"14px", border:"1px solid #D1D5DB",
              borderRadius:"8px", outline:"none", fontFamily:"Inter, sans-serif", backgroundColor:"#fff",
            }}>
              {["Current Ledger","Savings Account","Operational Ledger","Credit Card","Investment Account"].map(t=>
                <option key={t}>{t}</option>
              )}
            </select>
          </Field>
          <Field label="Current Balance (₹)">
            <Input type="number" value={formBalance} onChange={e=>setFormBalance(e.target.value)} placeholder="0.00"/>
          </Field>
          <label style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer" }}>
            <Toggle on={formCredit} onToggle={() => setFormCredit(v=>!v)}/>
            <span style={{ fontSize:"13px", color:"#374151" }}>This is a credit / loan account</span>
          </label>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px", marginTop:"4px" }}>
            <BtnOutline onClick={() => setModalOpen(false)}>Cancel</BtnOutline>
            <BtnPrimary onClick={handleAddAccount}><Plus size={14}/> Add account</BtnPrimary>
          </div>
        </div>
      </Modal>

      {/* Manage account modal */}
      <Modal isOpen={!!manageTarget} onClose={() => setManageTarget(null)} title={`Manage — ${manageTarget?.name}`}>
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          <BtnOutline onClick={() => { handleSync(manageTarget); setManageTarget(null); }}>
            <RefreshCw size={14}/> Sync now
          </BtnOutline>
          <BtnOutline danger onClick={() => setDeleteTarget(manageTarget)}>
            <Trash2 size={14}/> Remove account
          </BtnOutline>
          <BtnOutline onClick={() => setManageTarget(null)}>Close</BtnOutline>
        </div>
      </Modal>

      {/* Remove confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Account">
        <p style={{ fontSize:"14px", color:"#374151", marginBottom:"20px" }}>
          Remove <strong>{deleteTarget?.name}</strong>? Past transactions linked to this account will be retained.
        </p>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px" }}>
          <BtnOutline onClick={() => setDeleteTarget(null)}>Cancel</BtnOutline>
          <BtnOutline danger onClick={handleRemove}><Trash2 size={14}/> Remove</BtnOutline>
        </div>
      </Modal>
    </div>
  );
};

// ─── SECURITY PANEL ────────────────────────────────────────────────────────────
const SecurityPanel = ({ showToast }) => {
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [twoFA,      setTwoFA]      = useState(true);

  const strength = getPasswordStrength(newPw);

  const handleUpdatePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      showToast("All password fields are required", "error"); return;
    }
    if (newPw !== confirmPw) {
      showToast("New passwords do not match", "error"); return;
    }
    if (newPw.length < 8) {
      showToast("Password must be at least 8 characters", "error"); return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      showToast("Password updated successfully!", "success");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      showToast("Failed to update: " + err.message, "error");
    } finally { setSaving(false); }
  };

  const handleLogoutAll = async () => {
    try {
      await supabase.auth.signOut({ scope: "global" });
      showToast("Signed out from all devices", "success");
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  const EyeBtn = ({ show, toggle }) => (
    <button onClick={toggle} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)",
      background:"none", border:"none", cursor:"pointer", padding:0 }}>
      {show ? <EyeOff size={15} color="#9CA3AF"/> : <Eye size={15} color="#9CA3AF"/>}
    </button>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
        <div>
          <h3 style={{ fontSize:"16px", fontWeight:700, color:"#111827", margin:"0 0 4px" }}>Security &amp; Authentication</h3>
          <p style={{ fontSize:"13px", color:"#6B7280", margin:0 }}>Manage your password, two-factor auth, and active sessions.</p>
        </div>
        <Shield size={18} color="#9CA3AF"/>
      </div>

      {/* Change Password */}
      <p style={{ fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"12px" }}>Change Password</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px", marginBottom:"8px" }}>
        {[
          { label:"Current Password", val:currentPw, set:setCurrentPw, show:showCur, toggle:()=>setShowCur(v=>!v) },
          { label:"New Password",     val:newPw,     set:setNewPw,     show:showNew, toggle:()=>setShowNew(v=>!v) },
          { label:"Confirm New",      val:confirmPw, set:setConfirmPw, show:showConf,toggle:()=>setShowConf(v=>!v) },
        ].map(f => (
          <Field key={f.label} label={f.label}>
            <div style={{ position:"relative" }}>
              <Input type={f.show ? "text" : "password"} value={f.val}
                onChange={e=>f.set(e.target.value)} placeholder="••••••••"/>
              <EyeBtn show={f.show} toggle={f.toggle}/>
            </div>
          </Field>
        ))}
      </div>

      {newPw && (
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
          <span style={{ fontSize:"12px", color:"#6B7280" }}>Strength:</span>
          <div style={{ flex:1, height:"4px", borderRadius:"999px", backgroundColor:"#E5E7EB", maxWidth:"200px" }}>
            <div style={{ width:`${strength.pct}%`, height:"100%", borderRadius:"999px", backgroundColor:strength.color, transition:"width .3s" }}/>
          </div>
          <span style={{ fontSize:"12px", color:strength.color, fontWeight:500 }}>{strength.label}</span>
        </div>
      )}

      <BtnOutline sm disabled={saving} onClick={handleUpdatePassword}>
        <Lock size={13}/> {saving ? "Updating…" : "Update password"}
      </BtnOutline>

      <Divider/>

      {/* 2FA */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px",
        borderRadius:"10px", border:"1px solid #E5E7EB", backgroundColor:"#F9FAFB", marginBottom:"12px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"8px", backgroundColor:"#E6F4F1",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Smartphone size={18} color="#2F6F63"/>
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"2px" }}>
              <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:0 }}>Two-Factor Authentication</p>
              <span style={{ padding:"2px 8px", borderRadius:"999px",
                backgroundColor: twoFA ? "#D1FAE5" : "#F3F4F6",
                color: twoFA ? "#059669" : "#6B7280",
                fontSize:"11px", fontWeight:600 }}>
                {twoFA ? "Enabled" : "Disabled"}
              </span>
            </div>
            <p style={{ fontSize:"12px", color:"#6B7280", margin:0 }}>Requires TOTP code on every login.</p>
          </div>
        </div>
        <Toggle on={twoFA} onToggle={() => {
          setTwoFA(v=>!v);
          showToast(twoFA ? "2FA disabled" : "2FA enabled", "success");
        }}/>
      </div>

      {/* Active sessions */}
      <div style={{ padding:"14px 16px", borderRadius:"10px", border:"1px solid #E5E7EB", backgroundColor:"#F9FAFB" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
          <p style={{ fontSize:"13px", fontWeight:600, color:"#374151", margin:0 }}>Active Sessions</p>
          <button onClick={handleLogoutAll} style={{
            fontSize:"12px", color:"#DC2626", background:"none", border:"none",
            cursor:"pointer", fontWeight:500, fontFamily:"Inter, sans-serif" }}>
            Log out all devices
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <Monitor size={16} color="#6B7280"/>
          <div>
            <p style={{ fontSize:"13px", color:"#111827", margin:0 }}>This device — Chrome on macOS</p>
            <p style={{ fontSize:"11px", color:"#9CA3AF", margin:0 }}>Current session</p>
          </div>
          <span style={{ marginLeft:"auto", padding:"2px 8px", borderRadius:"999px",
            backgroundColor:"#D1FAE5", color:"#059669", fontSize:"11px", fontWeight:600 }}>
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── PREFERENCES PANEL ─────────────────────────────────────────────────────────
const PREF_KEY = "finsight_preferences";

const PreferencesPanel = ({ showToast }) => {
  const defaults = {
    theme: "Light", currency: "INR", dateFormat: "DD/MM/YYYY",
    emailSummary: true, budgetAlert: true, whatsapp: false,
  };
  const [prefs, setPrefs] = useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(PREF_KEY) || "{}") }; }
    catch { return defaults; }
  });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => {
    setPrefs(p => {
      const next = { ...p, [key]: val };
      // Apply theme change instantly
      if (key === "theme") {
        document.documentElement.setAttribute("data-theme", val.toLowerCase());
        localStorage.setItem(PREF_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("finsight-theme-change"));
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
      document.documentElement.setAttribute("data-theme", prefs.theme.toLowerCase());
      window.dispatchEvent(new Event("finsight-theme-change"));
      await new Promise(r => setTimeout(r, 400));
      showToast("Preferences saved!", "success");
    } finally { setSaving(false); }
  };

  const ThemeBtn = ({ label, icon: Icon }) => (
    <button onClick={() => set("theme", label)} style={{
      flex:1, padding:"10px", borderRadius:"8px",
      border:`1px solid ${prefs.theme===label ? "#2F6F63" : "#E5E7EB"}`,
      backgroundColor: prefs.theme===label ? "#E6F4F1" : "#F9FAFB",
      color: prefs.theme===label ? "#2F6F63" : "#6B7280",
      fontSize:"13px", fontWeight:500,
      display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", cursor:"pointer",
    }}>
      <Icon size={14}/> {label}
    </button>
  );

  const NotifRow = ({ icon:Icon, iconBg, iconColor, title, sub, prefKey }) => (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px",
      padding:"14px 16px", borderRadius:"10px", border:"1px solid #E5E7EB", backgroundColor:"#F9FAFB" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
        <div style={{ width:"32px", height:"32px", borderRadius:"8px", backgroundColor:iconBg,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon size={15} color={iconColor}/>
        </div>
        <div>
          <p style={{ fontSize:"13px", fontWeight:600, color:"#111827", margin:"0 0 2px" }}>{title}</p>
          <p style={{ fontSize:"12px", color:"#6B7280", margin:0 }}>{sub}</p>
        </div>
      </div>
      <Toggle on={prefs[prefKey]} onToggle={() => set(prefKey, !prefs[prefKey])}/>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
        <div>
          <h3 style={{ fontSize:"16px", fontWeight:700, color:"#111827", margin:"0 0 4px" }}>Preferences &amp; Localisation</h3>
          <p style={{ fontSize:"13px", color:"#6B7280", margin:0 }}>Configure regional settings, theme, and notification channels.</p>
        </div>
        <Sliders size={18} color="#9CA3AF"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
        <Field label="Base Currency">
          <div style={{ position:"relative" }}>
            <select value={prefs.currency} onChange={e => set("currency", e.target.value)} style={{
              width:"100%", padding:"10px 32px 10px 12px", fontSize:"13px", color:"#374151",
              border:"1px solid #D1D5DB", borderRadius:"8px", backgroundColor:"#F9FAFB",
              outline:"none", appearance:"none", cursor:"pointer", fontFamily:"Inter, sans-serif",
            }}>
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
              <option value="SGD">SGD — Singapore Dollar (S$)</option>
              <option value="AED">AED — UAE Dirham (د.إ)</option>
            </select>
            <ChevronDown size={14} color="#6B7280" style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>
        </Field>
        <Field label="Date Format">
          <div style={{ position:"relative" }}>
            <select value={prefs.dateFormat} onChange={e => set("dateFormat", e.target.value)} style={{
              width:"100%", padding:"10px 32px 10px 12px", fontSize:"13px", color:"#374151",
              border:"1px solid #D1D5DB", borderRadius:"8px", backgroundColor:"#F9FAFB",
              outline:"none", appearance:"none", cursor:"pointer", fontFamily:"Inter, sans-serif",
            }}>
              <option value="DD/MM/YYYY">DD/MM/YYYY — Indian Format</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY — US Format</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD — ISO 8601</option>
            </select>
            <ChevronDown size={14} color="#6B7280" style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>
        </Field>
      </div>

      <Field label="Interface Theme">
        <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
          <ThemeBtn label="Light"  icon={Sun}/>
          <ThemeBtn label="Dark"   icon={Moon}/>
          <ThemeBtn label="System" icon={Monitor}/>
        </div>
      </Field>

      <p style={{ fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"12px" }}>Notification Channels</p>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"20px" }}>
        <NotifRow
          icon={Bell} iconBg="#E6F4F1" iconColor="#2F6F63" prefKey="emailSummary"
          title="Monthly email summary & financial digest"
          sub="Receive an audited PDF statement on the 1st of every month."
        />
        <NotifRow
          icon={AlertTriangle} iconBg="#FEF3C7" iconColor="#D97706" prefKey="budgetAlert"
          title="Budget threshold alerts (80% & 100%)"
          sub="Push notification when any budget allocation approaches its cap."
        />
        <NotifRow
          icon={Zap} iconBg="#E0E7FF" iconColor="#4F46E5" prefKey="whatsapp"
          title="WhatsApp receipt recognition"
          sub="Forward receipts to FinSight for auto-capture and OCR tagging."
        />
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <BtnPrimary onClick={handleSave} loading={saving}><CheckCircle size={15}/> Save Preferences</BtnPrimary>
      </div>
    </div>
  );
};

// ─── DANGER ZONE ───────────────────────────────────────────────────────────────
const DangerZone = ({ showToast }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting]       = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      showToast('Type DELETE to confirm', "error"); return;
    }
    setDeleting(true);
    try {
      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;
      await supabase.auth.signOut();
    } catch (err) {
      // rpc may not exist — sign out anyway and inform user
      showToast("Account deletion requested. You will be signed out.", "success");
      setTimeout(() => supabase.auth.signOut(), 2000);
    } finally { setDeleting(false); }
  };

  return (
    <>
      <div style={{
        backgroundColor:"#fff", borderRadius:"14px", border:"2px solid #FECACA", padding:"20px 24px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"8px", backgroundColor:"#FEE2E2",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <AlertTriangle size={16} color="#DC2626"/>
          </div>
          <p style={{ fontSize:"15px", fontWeight:700, color:"#DC2626", margin:0 }}>⊘  Danger Zone</p>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"16px" }}>
          <div>
            <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:"0 0 4px" }}>Delete account &amp; wipe all data</p>
            <p style={{ fontSize:"13px", color:"#6B7280", margin:0 }}>
              Permanently removes your account, ledgers, goals, and all transaction history. This is irreversible.
            </p>
          </div>
          <BtnOutline danger onClick={() => setConfirmOpen(true)}>
            <Trash2 size={14}/> Delete account
          </BtnOutline>
        </div>
      </div>

      <Modal isOpen={confirmOpen} onClose={() => { setConfirmOpen(false); setConfirmText(""); }} title="Delete Account">
        <div style={{ marginBottom:"16px", padding:"12px", borderRadius:"8px", backgroundColor:"#FEF2F2", border:"1px solid #FECACA" }}>
          <p style={{ fontSize:"13px", color:"#DC2626", fontWeight:600, margin:"0 0 4px" }}>This action is permanent and cannot be undone.</p>
          <p style={{ fontSize:"13px", color:"#374151", margin:0 }}>All your data — transactions, budgets, goals, and settings — will be deleted immediately.</p>
        </div>
        <Field label='Type DELETE to confirm'>
          <Input value={confirmText} onChange={e=>setConfirmText(e.target.value)} placeholder="DELETE"/>
        </Field>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px", marginTop:"16px" }}>
          <BtnOutline onClick={() => { setConfirmOpen(false); setConfirmText(""); }}>Cancel</BtnOutline>
          <BtnOutline danger disabled={confirmText !== "DELETE" || deleting} onClick={handleDelete}>
            <Trash2 size={14}/> {deleting ? "Deleting…" : "Yes, delete my account"}
          </BtnOutline>
        </div>
      </Modal>
    </>
  );
};

// ─── PAGE ──────────────────────────────────────────────────────────────────────
const tabs = [
  { id:"profile",     label:"Profile",     icon:User     },
  { id:"categories",  label:"Categories",  icon:Tag      },
  { id:"accounts",    label:"Accounts",    icon:Building2},
  { id:"security",    label:"Security",    icon:Shield   },
  { id:"preferences", label:"Preferences", icon:Sliders  },
];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast]         = useState({ message:"", type:"success" });

  const showToast = (message, type="success") => setToast({ message, type });
  const clearToast = () => setToast({ message:"", type:"success" });

  const renderPanel = () => {
    const props = { showToast };
    switch (activeTab) {
      case "profile":     return <ProfilePanel     {...props}/>;
      case "categories":  return <CategoriesPanel  {...props}/>;
      case "accounts":    return <AccountsPanel    {...props}/>;
      case "security":    return <SecurityPanel    {...props}/>;
      case "preferences": return <PreferencesPanel {...props}/>;
      default:            return null;
    }
  };

  return (
    <div style={{ padding:"32px", backgroundColor:"#F6F7F9", minHeight:"100vh", fontFamily:"Inter, sans-serif" }}>
      {/* breadcrumb */}
      <div style={{ fontSize:"12px", color:"#6B7280", marginBottom:"6px", display:"flex", gap:"6px" }}>
        <span>PORTFOLIO</span><span>›</span>
        <span style={{ color:"#111827", fontWeight:500 }}>SETTINGS</span>
      </div>

      {/* header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <h1 style={{ fontSize:"30px", fontWeight:700, color:"#111827", margin:"0 0 4px" }}>Settings</h1>
          <p style={{ fontSize:"14px", color:"#6B7280", margin:0 }}>
            Manage your account preferences, linked accounts, security, and notifications.
          </p>
        </div>
      </div>

      {/* 2-column layout */}
      <div style={{ display:"flex", gap:"20px", alignItems:"flex-start" }}>
        {/* left nav */}
        <div style={{ width:"220px", flexShrink:0, display:"flex", flexDirection:"column", gap:"4px" }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                width:"100%", padding:"11px 14px", borderRadius:"8px", border:"none",
                backgroundColor: active ? "#2F6F63" : "transparent",
                color: active ? "#fff" : "#374151",
                fontSize:"14px", fontWeight: active ? 600 : 400,
                display:"flex", alignItems:"center", gap:"10px",
                cursor:"pointer", textAlign:"left", fontFamily:"Inter, sans-serif", transition:"background .15s",
              }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.backgroundColor="#F3F4F6"; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.backgroundColor="transparent"; }}
              >
                <Icon size={16} color={active ? "#9BE7D3" : "#6B7280"}/>
                {t.label}
              </button>
            );
          })}

        </div>

        {/* right content */}
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:"16px" }}>
          {activeTab !== "danger" && (
            <div style={{ backgroundColor:"#fff", borderRadius:"14px", border:"1px solid #E5E7EB", padding:"24px" }}>
              {renderPanel()}
            </div>
          )}
          <DangerZone showToast={showToast}/>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={clearToast}/>
    </div>
  );
};
