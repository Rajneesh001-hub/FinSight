import React, { useState } from "react";
import {
  User, Tag, Building2, Shield, Sliders,
  Upload, Edit2, Trash2, Plus, Eye, EyeOff,
  CheckCircle, AlertTriangle, ChevronDown,
  Smartphone, Globe, Bell, Moon, Sun, Monitor,
  CreditCard, LogOut, Lock, RefreshCw, Zap,
} from "lucide-react";

// ─── data ─────────────────────────────────────────────────────────────────────
const categoryList = [
  { id: 1, name: "Food & Groceries",        color: "#F59E0B", sub: "Dining & monthly pantry",    txns: 24 },
  { id: 2, name: "Shopping & Lifestyle",    color: "#7C3AED", sub: "Discretionary retail",        txns: 12 },
  { id: 3, name: "Transportation & Fuel",   color: "#2F6F63", sub: "Fastag, Uber & metro",        txns: 18 },
  { id: 4, name: "Utilities & Subscriptions",color:"#4F46E5", sub: "Power, Cloud & SaaS",         txns: 9  },
  { id: 5, name: "Office & Workspace",      color: "#059669", sub: "Co-working BKC & supplies",   txns: 7  },
  { id: 6, name: "Client Income & Retainers",color:"#DC2626", sub: "Project-based income",        txns: 5  },
];

const accountList = [
  { id: 1, bank: "HDFC",  name: "HDFC Business Bank",    type: "Current Ledger", sub: "• Synced 6 minutes ago", balance: 65000,  credit: false, status: "Active & Synced",  statusColor:"#059669", statusBg:"#D1FAE5" },
  { id: 2, bank: "ICICI", name: "ICICI Current Account", type: "Operational Ledger", sub: "• Synced 1 hr ago", balance: 118420.50, credit: false, status: "Active & Synced", statusColor:"#059669", statusBg:"#D1FAE5" },
  { id: 3, bank: "AMEX",  name: "American Express Platinum", type: "Credit",     sub: "• Billing Annuity (Credit)", balance: -14220, credit: true, status: "Overdue",       statusColor:"#DC2626", statusBg:"#FEE2E2" },
];

const fmtAmt = (n) => {
  const isNeg = n < 0;
  const s = Math.abs(Math.round(n * 100) / 100).toFixed(2);
  const [whole, dec] = s.split(".");
  const last3 = whole.slice(-3);
  const rest  = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (isNeg ? "−₹" : "₹") + (rest ? rest + "," + last3 : last3) + "." + dec;
};

// ─── small shared pieces ──────────────────────────────────────────────────────
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

const Input = ({ value, onChange, placeholder, type="text", readOnly }) => (
  <input
    type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
    style={{
      width:"100%", padding:"10px 12px", fontSize:"14px", color:"#111827",
      backgroundColor: readOnly ? "#F9FAFB" : "#fff",
      border:"1px solid #D1D5DB", borderRadius:"8px",
      outline:"none", boxSizing:"border-box", fontFamily:"Inter, sans-serif",
    }}
  />
);

const BtnPrimary = ({ children, onClick, sm }) => (
  <button onClick={onClick} style={{
    padding: sm ? "7px 14px" : "10px 20px",
    backgroundColor:"#2F6F63", border:"none", borderRadius:"8px",
    fontSize: sm ? "12px" : "14px", fontWeight:500, color:"#fff",
    cursor:"pointer", display:"flex", alignItems:"center", gap:"6px",
    fontFamily:"Inter, sans-serif",
  }}
    onMouseEnter={e=>e.currentTarget.style.backgroundColor="#275750"}
    onMouseLeave={e=>e.currentTarget.style.backgroundColor="#2F6F63"}
  >{children}</button>
);

const BtnOutline = ({ children, onClick, sm, danger }) => (
  <button onClick={onClick} style={{
    padding: sm ? "7px 14px" : "10px 20px",
    backgroundColor:"#fff",
    border:`1px solid ${danger ? "#DC2626" : "#D1D5DB"}`,
    borderRadius:"8px",
    fontSize: sm ? "12px" : "14px", fontWeight:500,
    color: danger ? "#DC2626" : "#374151",
    cursor:"pointer", display:"flex", alignItems:"center", gap:"6px",
    fontFamily:"Inter, sans-serif",
  }}
    onMouseEnter={e=>e.currentTarget.style.backgroundColor= danger ? "#FEF2F2" : "#F9FAFB"}
    onMouseLeave={e=>e.currentTarget.style.backgroundColor="#fff"}
  >{children}</button>
);

const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{
    width:"44px", height:"24px", borderRadius:"999px",
    backgroundColor: on ? "#2F6F63" : "#D1D5DB",
    position:"relative", cursor:"pointer", transition:"background .2s",
    flexShrink:0,
  }}>
    <div style={{
      position:"absolute", top:"3px",
      left: on ? "23px" : "3px",
      width:"18px", height:"18px", borderRadius:"50%",
      backgroundColor:"#fff", transition:"left .2s",
      boxShadow:"0 1px 3px rgba(0,0,0,.2)",
    }} />
  </div>
);

const Divider = () => <div style={{ height:"1px", backgroundColor:"#F3F4F6", margin:"24px 0" }} />;

// ─── tab panels ───────────────────────────────────────────────────────────────

/* PROFILE */
const ProfilePanel = () => {
  const [name, setName]   = useState("Arjun Mehta");
  const [email]           = useState("arjun.mehta@fintech.co");
  const [phone, setPhone] = useState("+91 98101 48021");
  const [title, setTitle] = useState("Founder & Principal Consultant, FinEdge Adv…");

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
        <div>
          <h3 style={{ fontSize:"18px", fontWeight:700, color:"#111827", margin:"0 0 4px" }}>Profile Settings</h3>
          <p style={{ fontSize:"13px", color:"#6B7280", margin:0 }}>Update your public profile, security credentials, and authorised communications.</p>
        </div>
        <Edit2 size={18} color="#9CA3AF" style={{ cursor:"pointer" }} />
      </div>

      {/* avatar */}
      <div style={{ display:"flex", alignItems:"center", gap:"20px", marginBottom:"24px" }}>
        <div style={{ position:"relative" }}>
          <div style={{
            width:"72px", height:"72px", borderRadius:"50%",
            backgroundColor:"#9BE7D3",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"24px", fontWeight:700, color:"#2F6F63",
          }}>AM</div>
          <div style={{
            position:"absolute", bottom:"0", right:"-4px",
            width:"24px", height:"24px", borderRadius:"50%",
            backgroundColor:"#2F6F63", border:"2px solid #fff",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
          }}>
            <Upload size={11} color="#fff" />
          </div>
        </div>
        <div>
          <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:"0 0 4px" }}>Profile Photo</p>
          <p style={{ fontSize:"12px", color:"#6B7280", margin:"0 0 8px" }}>PNG, JPG, GIF · Recommended resolution 400×400px. Maximum size 1MB.</p>
          <div style={{ display:"flex", gap:"10px" }}>
            <BtnOutline sm><Upload size={13}/> Upload new photo</BtnOutline>
            <button style={{ background:"none", border:"none", fontSize:"13px", color:"#DC2626", cursor:"pointer" }}>Remove</button>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
        <Field label="Full Name" required>
          <Input value={name} onChange={e=>setName(e.target.value)} />
        </Field>
        <Field label="Primary Work Email" required>
          <div style={{ position:"relative" }}>
            <Input value={email} readOnly />
            <CheckCircle size={15} color="#059669" style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)" }}/>
          </div>
        </Field>
        <Field label="Mobile Number">
          <div style={{ position:"relative" }}>
            <Input value={phone} onChange={e=>setPhone(e.target.value)} />
            <span style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)",
              fontSize:"11px", fontWeight:600, color:"#059669", backgroundColor:"#D1FAE5",
              padding:"2px 7px", borderRadius:"999px" }}>+ Verified</span>
          </div>
        </Field>
        <Field label="Professional Title / Business Identity">
          <Input value={title} onChange={e=>setTitle(e.target.value)} />
        </Field>
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <BtnPrimary><CheckCircle size={15}/> Save Profile</BtnPrimary>
      </div>
    </div>
  );
};

/* CATEGORIES */
const CategoriesPanel = () => (
  <div>
    <SectionTitle
      action={<BtnPrimary sm><Plus size={13}/> Add category</BtnPrimary>}
    >
      Ledger Categories &amp; Tagging Rules
    </SectionTitle>
    <p style={{ fontSize:"13px", color:"#6B7280", margin:"0 0 16px" }}>
      Category annotations automatically apply to new and existing transactions via rule engine.
    </p>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
      {categoryList.map(cat => (
        <div key={cat.id} style={{
          padding:"14px 16px", borderRadius:"10px",
          border:"1px solid #E5E7EB", backgroundColor:"#fff",
          display:"flex", alignItems:"center", gap:"12px",
        }}>
          <div style={{ width:"12px", height:"12px", borderRadius:"50%", backgroundColor:cat.color, flexShrink:0 }}/>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:"13px", fontWeight:600, color:"#111827", margin:"0 0 2px",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cat.name}</p>
            <p style={{ fontSize:"11px", color:"#6B7280", margin:0 }}>{cat.sub} · {cat.txns} txns</p>
          </div>
          <div style={{ display:"flex", gap:"6px" }}>
            <button style={{ padding:"5px", border:"none", backgroundColor:"transparent", cursor:"pointer", borderRadius:"5px" }}
              onMouseEnter={e=>e.currentTarget.style.backgroundColor="#F3F4F6"}
              onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
              <Edit2 size={13} color="#6B7280"/>
            </button>
            <button style={{ padding:"5px", border:"none", backgroundColor:"transparent", cursor:"pointer", borderRadius:"5px" }}
              onMouseEnter={e=>e.currentTarget.style.backgroundColor="#FEF2F2"}
              onMouseLeave={e=>e.currentTarget.style.backgroundColor="transparent"}>
              <Trash2 size={13} color="#DC2626"/>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ACCOUNTS */
const AccountsPanel = () => (
  <div>
    <SectionTitle
      action={<BtnPrimary sm><Plus size={13}/> Add account</BtnPrimary>}
    >
      Connected Bank Accounts &amp; Ledgers
    </SectionTitle>
    <p style={{ fontSize:"13px", color:"#6B7280", margin:"0 0 16px" }}>
      FinSight fetches end-of-day balances from the NetBanking feeds for real-time tracking.
    </p>
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
      {accountList.map(acc => (
        <div key={acc.id} style={{
          padding:"16px 20px", borderRadius:"10px",
          border:"1px solid #E5E7EB", backgroundColor:"#fff",
          display:"flex", alignItems:"center", gap:"16px",
        }}>
          {/* bank logo placeholder */}
          <div style={{
            width:"40px", height:"40px", borderRadius:"8px",
            backgroundColor: acc.bank==="HDFC" ? "#E6F4F1" : acc.bank==="ICICI" ? "#DBEAFE" : "#F3F4F6",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"11px", fontWeight:800,
            color: acc.bank==="HDFC" ? "#2F6F63" : acc.bank==="ICICI" ? "#1D4ED8" : "#374151",
            flexShrink:0,
          }}>{acc.bank}</div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"2px" }}>
              <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:0 }}>{acc.name}</p>
              <span style={{
                padding:"2px 8px", borderRadius:"999px",
                backgroundColor:acc.statusBg, color:acc.statusColor,
                fontSize:"11px", fontWeight:600,
              }}>{acc.status}</span>
            </div>
            <p style={{ fontSize:"12px", color:"#6B7280", margin:0 }}>{acc.type} · {acc.sub}</p>
          </div>

          <div style={{ textAlign:"right", flexShrink:0 }}>
            <p style={{ fontSize:"10px", color:"#9CA3AF", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:".04em" }}>
              {acc.credit ? "OUTSTANDING BALANCE" : "AVAILABLE BALANCE"}
            </p>
            <p style={{ fontSize:"16px", fontWeight:700, color: acc.credit ? "#DC2626" : "#111827", margin:0 }}>
              {fmtAmt(Math.abs(acc.balance))}
            </p>
          </div>
          <BtnOutline sm>Manage</BtnOutline>
        </div>
      ))}
    </div>
    <div style={{ marginTop:"12px", padding:"12px 16px", borderRadius:"8px", backgroundColor:"#F9FAFB", border:"1px solid #E5E7EB" }}>
      <p style={{ fontSize:"12px", color:"#6B7280", margin:0 }}>
        <strong>3 accounts</strong> connected · Last full reconciliation: <strong>Oct 26, 2026 at 11:42 PM</strong>
      </p>
    </div>
  </div>
);

/* SECURITY */
const SecurityPanel = () => {
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [strength] = useState("Strong Entropy: 64 bits");

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
          <p style={{ fontSize:"13px", color:"#6B7280", margin:0 }}>Manage master passwords, two-factor authentication app, and audit active devices.</p>
        </div>
        <Shield size={18} color="#9CA3AF" />
      </div>

      {/* Change Password */}
      <p style={{ fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"12px" }}>Change Password</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px", marginBottom:"8px" }}>
        {[
          { label:"Current Password", show:showCurrent, toggle:()=>setShowCurrent(v=>!v) },
          { label:"New Password",     show:showNew,     toggle:()=>setShowNew(v=>!v)     },
          { label:"Confirm New Password", show:showConfirm, toggle:()=>setShowConfirm(v=>!v) },
        ].map(f => (
          <Field key={f.label} label={f.label}>
            <div style={{ position:"relative" }}>
              <Input type={f.show?"text":"password"} value="••••••••••" />
              <EyeBtn show={f.show} toggle={f.toggle}/>
            </div>
          </Field>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
        <span style={{ fontSize:"12px", color:"#6B7280" }}>Password Strength:</span>
        <div style={{ flex:1, height:"4px", borderRadius:"999px", backgroundColor:"#D1FAE5", maxWidth:"200px" }}>
          <div style={{ width:"80%", height:"100%", borderRadius:"999px", backgroundColor:"#059669" }}/>
        </div>
        <span style={{ fontSize:"12px", color:"#059669", fontWeight:500 }}>{strength}</span>
      </div>
      <BtnOutline sm><Lock size={13}/> Update password</BtnOutline>

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
              <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:0 }}>Two-Factor Authentication (2FA)</p>
              <span style={{ padding:"2px 8px", borderRadius:"999px", backgroundColor:"#D1FAE5",
                color:"#059669", fontSize:"11px", fontWeight:600 }}>Enabled</span>
            </div>
            <p style={{ fontSize:"12px", color:"#6B7280", margin:0 }}>Preferred via Google Authenticator. High-security actions require TOTP verification.</p>
          </div>
        </div>
        <BtnOutline sm>Manage 2A</BtnOutline>
      </div>

      {/* Active sessions */}
      <div style={{ padding:"14px 16px", borderRadius:"10px", border:"1px solid #E5E7EB", backgroundColor:"#F9FAFB" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
          <p style={{ fontSize:"13px", fontWeight:600, color:"#374151", margin:0 }}>Active Logged-in Sessions</p>
          <button style={{ fontSize:"12px", color:"#DC2626", background:"none", border:"none", cursor:"pointer", fontWeight:500 }}>
            Log out of all devices
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <Monitor size={16} color="#6B7280"/>
          <div>
            <p style={{ fontSize:"13px", color:"#111827", margin:0 }}>Mumbai, India — Chrome on MacOS</p>
            <p style={{ fontSize:"11px", color:"#9CA3AF", margin:0 }}>Oct 26, 2026 · 11:34 PM</p>
          </div>
          <span style={{ marginLeft:"auto", padding:"2px 8px", borderRadius:"999px",
            backgroundColor:"#D1FAE5", color:"#059669", fontSize:"11px", fontWeight:600 }}>
            Current Session
          </span>
        </div>
      </div>
    </div>
  );
};

/* PREFERENCES */
const PreferencesPanel = () => {
  const [theme, setTheme]         = useState("Light");
  const [emailSummary, setEmail]  = useState(true);
  const [budgetAlert, setBudget]  = useState(true);
  const [whatsapp, setWhatsapp]   = useState(false);
  const [currency]                = useState("INR — Indian Rupee (Default: symbol ₹)");
  const [dateFormat]              = useState("DD/MM/YYYY (06/26/2026) — Indian Format");

  const ThemeBtn = ({ label, icon: Icon }) => (
    <button onClick={()=>setTheme(label)} style={{
      flex:1, padding:"10px", borderRadius:"8px",
      border:`1px solid ${theme===label ? "#2F6F63" : "#E5E7EB"}`,
      backgroundColor: theme===label ? "#E6F4F1" : "#F9FAFB",
      color: theme===label ? "#2F6F63" : "#6B7280",
      fontSize:"13px", fontWeight:500,
      display:"flex", alignItems:"center", justifyContent:"center", gap:"6px",
      cursor:"pointer",
    }}>
      <Icon size={14}/> {label}
    </button>
  );

  const NotifRow = ({ icon:Icon, iconBg, iconColor, title, sub, on, toggle }) => (
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
      <Toggle on={on} onToggle={toggle}/>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
        <div>
          <h3 style={{ fontSize:"16px", fontWeight:700, color:"#111827", margin:"0 0 4px" }}>Preferences &amp; Localisation</h3>
          <p style={{ fontSize:"13px", color:"#6B7280", margin:0 }}>Configure reporting units, regional notation, and automated notifications.</p>
        </div>
        <Sliders size={18} color="#9CA3AF"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
        <Field label="Base Currency">
          <div style={{ position:"relative" }}>
            <select style={{ width:"100%", padding:"10px 32px 10px 12px", fontSize:"13px", color:"#374151",
              border:"1px solid #D1D5DB", borderRadius:"8px", backgroundColor:"#F9FAFB",
              outline:"none", appearance:"none", cursor:"pointer" }}>
              <option>{currency}</option>
            </select>
            <ChevronDown size={14} color="#6B7280" style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          </div>
        </Field>
        <Field label="Date &amp; Number Format">
          <div style={{ position:"relative" }}>
            <select style={{ width:"100%", padding:"10px 32px 10px 12px", fontSize:"13px", color:"#374151",
              border:"1px solid #D1D5DB", borderRadius:"8px", backgroundColor:"#F9FAFB",
              outline:"none", appearance:"none", cursor:"pointer" }}>
              <option>{dateFormat}</option>
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

      <p style={{ fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"12px" }}>Notification Channels &amp; Automation</p>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        <NotifRow
          icon={Bell} iconBg="#E6F4F1" iconColor="#2F6F63"
          title="Monthly email summary & financial digest"
          sub="Receive audited PDF statement with automated reconciliation on the 1st of every month."
          on={emailSummary} toggle={()=>setEmail(v=>!v)}
        />
        <NotifRow
          icon={AlertTriangle} iconBg="#FEF3C7" iconColor="#D97706"
          title="Budget threshold alerts (at 80% & 100% cap)"
          sub="Single-priority push notification when departmental allocations approach threshold."
          on={budgetAlert} toggle={()=>setBudget(v=>!v)}
        />
        <NotifRow
          icon={Zap} iconBg="#E0E7FF" iconColor="#4F46E5"
          title="Instant WhatsApp: receipt recognition"
          sub="Forward receipt to this FinSight wallet for auto-capture. 1 special character recognition (OCR) tagging."
          on={whatsapp} toggle={()=>setWhatsapp(v=>!v)}
        />
      </div>
    </div>
  );
};

// ─── tabs config ──────────────────────────────────────────────────────────────
const tabs = [
  { id:"profile",    label:"Profile",    icon:User,      panel:<ProfilePanel/>    },
  { id:"categories", label:"Categories", icon:Tag,       panel:<CategoriesPanel/> },
  { id:"accounts",   label:"Accounts",   icon:Building2, panel:<AccountsPanel/>   },
  { id:"security",   label:"Security",   icon:Shield,    panel:<SecurityPanel/>   },
  { id:"preferences",label:"Preferences",icon:Sliders,   panel:<PreferencesPanel/>},
];

// ─── page ─────────────────────────────────────────────────────────────────────
export const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const current = tabs.find(t=>t.id===activeTab);

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
            Manage your personal account preferences, linked savings ledgers, security, and notification settings.
          </p>
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <BtnOutline>Discard</BtnOutline>
          <BtnPrimary><CheckCircle size={15}/> Save Changes</BtnPrimary>
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
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
                width:"100%", padding:"11px 14px",
                borderRadius:"8px", border:"none",
                backgroundColor: active ? "#2F6F63" : "transparent",
                color: active ? "#fff" : "#374151",
                fontSize:"14px", fontWeight: active ? 600 : 400,
                display:"flex", alignItems:"center", gap:"10px",
                cursor:"pointer", textAlign:"left", fontFamily:"Inter, sans-serif",
                transition:"background .15s",
              }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.backgroundColor="#F3F4F6"; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.backgroundColor="transparent"; }}
              >
                <Icon size={16} color={active ? "#9BE7D3" : "#6B7280"}/>
                {t.label}
              </button>
            );
          })}

          <Divider/>

          {/* danger zone in nav */}
          <button style={{
            width:"100%", padding:"11px 14px", borderRadius:"8px",
            border:"1px solid #FECACA", backgroundColor:"#FEF2F2",
            color:"#DC2626", fontSize:"13px", fontWeight:500,
            display:"flex", alignItems:"center", gap:"10px",
            cursor:"pointer", textAlign:"left", fontFamily:"Inter, sans-serif",
          }}>
            <AlertTriangle size={15} color="#DC2626"/>
            Danger Zone
          </button>
        </div>

        {/* right content */}
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:"16px" }}>

          {/* main tab panel */}
          <div style={{ backgroundColor:"#fff", borderRadius:"14px", border:"1px solid #E5E7EB", padding:"24px" }}>
            {current?.panel}
          </div>

          {/* danger zone */}
          <div style={{
            backgroundColor:"#fff", borderRadius:"14px",
            border:"2px solid #FECACA", padding:"20px 24px",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"8px", backgroundColor:"#FEE2E2",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <AlertTriangle size={16} color="#DC2626"/>
              </div>
              <div>
                <p style={{ fontSize:"15px", fontWeight:700, color:"#DC2626", margin:0 }}>⊘  Danger Zone</p>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"16px" }}>
              <div>
                <p style={{ fontSize:"14px", fontWeight:600, color:"#111827", margin:"0 0 4px" }}>Delete account &amp; wipe circuit ledgers</p>
                <p style={{ fontSize:"13px", color:"#6B7280", margin:0 }}>
                  Permanently removes all FinSight account, historical ledgers, categorisation rules, goals<br/>
                  and notification rules from this account. This action is immediate and irreversible.
                </p>
              </div>
              <BtnOutline danger>
                <Trash2 size={14}/> Delete account
              </BtnOutline>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
