import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, TrendingUp, CheckCircle, Zap } from "lucide-react";

// ─── left panel illustration ──────────────────────────────────────────────────
const GoalCard = () => (
  <div style={{
    backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "14px",
    padding: "20px 24px", border: "1px solid rgba(255,255,255,0.12)",
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "9px", backgroundColor: "rgba(155,231,211,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={18} color="#9BE7D3"/>
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", margin: 0 }}>Emergency Capital Fund</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0 }}>Target: ₹5,00,000 • 75% Achieved</p>
        </div>
      </div>
      <span style={{ padding: "4px 10px", borderRadius: "999px", backgroundColor: "rgba(155,231,211,0.15)", color: "#9BE7D3", fontSize: "11px", fontWeight: 600, border: "1px solid rgba(155,231,211,0.25)" }}>
        On Track
      </span>
    </div>

    {/* progress bar */}
    <div style={{ height: "8px", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "999px", marginBottom: "16px" }}>
      <div style={{ height: "100%", width: "75%", background: "linear-gradient(to right, #2F6F63, #9BE7D3)", borderRadius: "999px" }}/>
    </div>

    <div style={{ display: "flex", gap: "24px" }}>
      {["Instant Bank Sync (HDFC, ICICI)", "Automated GST & Categorisation"].map(t => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
          <CheckCircle size={12} color="#9BE7D3"/>{t}
        </div>
      ))}
    </div>
  </div>
);

const LeftPanel = () => (
  <div style={{
    flex: 1, background: "linear-gradient(160deg, #1a4a3f 0%, #2F6F63 60%, #1a3d35 100%)",
    display: "flex", flexDirection: "column", padding: "36px 48px",
    position: "relative", overflow: "hidden", minHeight: "100vh",
  }}>
    <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", backgroundColor: "rgba(155,231,211,0.06)" }}/>
    <div style={{ position: "absolute", bottom: "60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", backgroundColor: "rgba(155,231,211,0.05)" }}/>

    {/* logo */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "auto" }}>
      <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(155,231,211,0.2)", border: "1px solid rgba(155,231,211,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TrendingUp size={20} color="#9BE7D3"/>
      </div>
      <span style={{ fontSize: "20px", fontWeight: 700, color: "#fff", letterSpacing: "-.3px" }}>FinSight</span>
    </div>

    <div style={{ marginTop: "60px", marginBottom: "36px", flex: 1 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 12px", borderRadius: "999px", backgroundColor: "rgba(155,231,211,0.15)", border: "1px solid rgba(155,231,211,0.25)", marginBottom: "24px" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#9BE7D3" }}/>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Start your 14-day Pro trial • No card required</span>
      </div>

      <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-.5px" }}>
        Take control of<br/>your money.
      </h1>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: "0 0 36px", maxWidth: "380px" }}>
        Join thousands of founders, freelancers, and entrepreneurs in India getting real-time cash flow oversight and automated tax preparation.
      </p>

      <GoalCard/>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(255,255,255,0.35)", paddingTop: "20px" }}>
      <span>© 2026 FinSight Technologies Pvt. Ltd.</span>
      <span>Security audited &amp; RBI compliant</span>
    </div>
  </div>
);

// ─── Password strength ────────────────────────────────────────────────────────
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)              score++;
  if (/[A-Z]/.test(pw))           score++;
  if (/[0-9]/.test(pw))           score++;
  if (/[^A-Za-z0-9]/.test(pw))   score++;
  return score;
};

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#DC2626", "#F59E0B", "#3B82F6", "#059669"];

const StrengthBar = ({ password }) => {
  const s = getStrength(password);
  if (!password) return null;
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <span style={{ fontSize: "12px", color: "#6B7280" }}>Password strength:</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: strengthColor[s] }}>{strengthLabel[s]} ({s} of 4)</span>
      </div>
      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: "4px", borderRadius: "999px", backgroundColor: i <= s ? strengthColor[s] : "#E5E7EB", transition: "background .2s" }}/>
        ))}
      </div>
      <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
        Must be at least 8 characters and include uppercase, numbers, and symbols.
      </p>
    </div>
  );
};

// ─── Register Page ────────────────────────────────────────────────────────────
export const Register = ({ onRegister, onGoLogin }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]       = useState(false);
  const [errors, setErrors]       = useState({});

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name    = "Full name is required";
    if (!form.email.trim())    e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)        e.password = "Password is required";
    else if (getStrength(form.password) < 2) e.password = "Password is too weak";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    if (!agreed)               e.agreed  = "You must accept the terms";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onRegister();
  };

  const inputStyle = (err) => ({
    width: "100%", padding: "11px 40px 11px 14px", fontSize: "14px", color: "#111827",
    backgroundColor: "#F9FAFB", border: `1.5px solid ${err ? "#DC2626" : "#E5E7EB"}`,
    borderRadius: "8px", outline: "none", boxSizing: "border-box",
    fontFamily: "Inter, sans-serif", transition: "border .15s",
  });

  const Label = ({ children }) => (
    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "7px" }}>
      {children}
    </label>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <LeftPanel/>

      {/* right */}
      <div style={{ flex: 1, backgroundColor: "#F6F7F9", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "36px 40px", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Create your account</h2>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 28px" }}>Start tracking your business and personal cash flow</p>

            <form onSubmit={handleSubmit}>
              {/* name */}
              <div style={{ marginBottom: "16px" }}>
                <Label>Full Name</Label>
                <input value={form.name} onChange={set("name")} placeholder="Enter your Full Name"
                  style={{ ...inputStyle(errors.name), padding: "11px 14px" }}
                  onFocus={e => e.target.style.borderColor = "#2F6F63"}
                  onBlur={e => e.target.style.borderColor = errors.name ? "#DC2626" : "#E5E7EB"}
                />
                {errors.name && <p style={{ fontSize: "12px", color: "#DC2626", margin: "5px 0 0" }}>{errors.name}</p>}
              </div>

              {/* email */}
              <div style={{ marginBottom: "16px" }}>
                <Label>Email Address</Label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="Enter Your Email"
                  style={{ ...inputStyle(errors.email), padding: "11px 14px" }}
                  onFocus={e => e.target.style.borderColor = "#2F6F63"}
                  onBlur={e => e.target.style.borderColor = errors.email ? "#DC2626" : "#E5E7EB"}
                />
                {errors.email && <p style={{ fontSize: "12px", color: "#DC2626", margin: "5px 0 0" }}>{errors.email}</p>}
              </div>

              {/* password */}
              <div style={{ marginBottom: "16px" }}>
                <Label>Password</Label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                    placeholder="Enter your Password"
                    style={inputStyle(errors.password)}
                    onFocus={e => e.target.style.borderColor = "#2F6F63"}
                    onBlur={e => e.target.style.borderColor = errors.password ? "#DC2626" : "#E5E7EB"}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    {showPw ? <EyeOff size={16} color="#9CA3AF"/> : <Eye size={16} color="#9CA3AF"/>}
                  </button>
                </div>
                <StrengthBar password={form.password}/>
                {errors.password && <p style={{ fontSize: "12px", color: "#DC2626", margin: "5px 0 0" }}>{errors.password}</p>}
              </div>

              {/* confirm password */}
              <div style={{ marginBottom: "18px" }}>
                <Label>Confirm Password</Label>
                <div style={{ position: "relative" }}>
                  <input type={showConfirm ? "text" : "password"} value={form.confirm} onChange={set("confirm")}
                    placeholder="Re-enter password"
                    style={inputStyle(errors.confirm)}
                    onFocus={e => e.target.style.borderColor = "#2F6F63"}
                    onBlur={e => e.target.style.borderColor = errors.confirm ? "#DC2626" : "#E5E7EB"}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    {showConfirm ? <EyeOff size={16} color="#9CA3AF"/> : <Eye size={16} color="#9CA3AF"/>}
                  </button>
                </div>
                {errors.confirm && <p style={{ fontSize: "12px", color: "#DC2626", margin: "5px 0 0" }}>{errors.confirm}</p>}
              </div>

              {/* terms */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "22px", cursor: "pointer" }}>
                <div
                  onClick={() => setAgreed(v => !v)}
                  style={{
                    width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0, marginTop: "1px",
                    backgroundColor: agreed ? "#2F6F63" : "#fff",
                    border: `2px solid ${agreed ? "#2F6F63" : errors.agreed ? "#DC2626" : "#D1D5DB"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  }}>
                  {agreed && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
                  I agree to FinSight's{" "}
                  <span style={{ color: "#2F6F63", fontWeight: 600, cursor: "pointer" }}>Terms of Service</span>
                  {" "}and{" "}
                  <span style={{ color: "#2F6F63", fontWeight: 600, cursor: "pointer" }}>Privacy Policy</span>.
                </span>
              </label>
              {errors.agreed && <p style={{ fontSize: "12px", color: "#DC2626", margin: "-16px 0 16px" }}>{errors.agreed}</p>}

              {/* submit */}
              <button type="submit" style={{
                width: "100%", padding: "12px", backgroundColor: "#2F6F63", border: "none",
                borderRadius: "8px", fontSize: "15px", fontWeight: 600, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                cursor: "pointer", marginBottom: "20px", transition: "background .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#275750"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2F6F63"}
              >
                Create Account <ArrowRight size={16}/>
              </button>

              {/* switch to login */}
              <p style={{ textAlign: "center", fontSize: "14px", color: "#6B7280", margin: 0 }}>
                Already have an account?{" "}
                <button type="button" onClick={onGoLogin}
                  style={{ background: "none", border: "none", color: "#2F6F63", fontWeight: 700, cursor: "pointer", fontSize: "14px", padding: 0 }}>
                  Log in
                </button>
              </p>
            </form>
          </div>

          {/* trust note */}
          <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", marginTop: "14px" }}>
            Encrypted with 256-bit bank-grade protocol • No credit card needed for setup
          </p>
        </div>
      </div>
    </div>
  );
};
