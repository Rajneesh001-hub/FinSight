import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Smartphone, TrendingUp, ShieldCheck, CheckCircle } from "lucide-react";

// ─── mini bar-chart illustration ─────────────────────────────────────────────
const MiniBarChart = () => {
  const bars = [
    { h: 60, label: "May",  color: "rgba(255,255,255,0.25)" },
    { h: 72, label: "Jun",  color: "rgba(255,255,255,0.25)" },
    { h: 48, label: "Jul",  color: "rgba(255,255,255,0.25)" },
    { h: 80, label: "Aug",  color: "rgba(255,255,255,0.25)" },
    { h: 55, label: "Sep",  color: "rgba(255,255,255,0.25)" },
    { h: 100,label: "Oct",  color: "#9BE7D3", peak: true },
  ];
  return (
    <div style={{
      backgroundColor: "rgba(255,255,255,0.08)",
      borderRadius: "14px",
      padding: "20px 24px",
      border: "1px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(4px)",
    }}>
      {/* card header */}
      <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: ".08em", margin: "0 0 6px", textTransform: "uppercase" }}>
        Net Cash Flow (Oct 2026)
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "26px", fontWeight: 700, color: "#fff" }}>₹1,46,580.00</span>
        <span style={{ padding: "4px 10px", borderRadius: "999px", backgroundColor: "rgba(155,231,211,0.2)", color: "#9BE7D3", fontSize: "12px", fontWeight: 700 }}>
          +18.4%
        </span>
      </div>

      {/* bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "100px", marginBottom: "8px" }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            {b.peak && (
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#2F6F63", backgroundColor: "#9BE7D3", padding: "2px 7px", borderRadius: "999px", marginBottom: "2px" }}>
                Peak
              </span>
            )}
            <div style={{ width: "100%", height: `${b.h}%`, backgroundColor: b.color, borderRadius: "5px 5px 0 0" }}/>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{b.label}</div>
        ))}
      </div>

      {/* footer badges */}
      <div style={{ display: "flex", gap: "16px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {["Synced Accounts: 3 Linked", "RBI Certified: 256-bit AES"].map(t => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#9BE7D3", flexShrink: 0 }}/>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Left panel ───────────────────────────────────────────────────────────────
const LeftPanel = () => (
  <div style={{
    flex: 1, backgroundColor: "#1E4D42",
    background: "linear-gradient(160deg, #1a4a3f 0%, #2F6F63 60%, #1a3d35 100%)",
    display: "flex", flexDirection: "column",
    padding: "36px 48px", position: "relative", overflow: "hidden",
    minHeight: "100vh",
  }}>
    {/* subtle background circles */}
    <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", backgroundColor: "rgba(155,231,211,0.06)" }}/>
    <div style={{ position: "absolute", bottom: "60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", backgroundColor: "rgba(155,231,211,0.05)" }}/>

    {/* logo */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "auto" }}>
      <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(155,231,211,0.2)", border: "1px solid rgba(155,231,211,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <TrendingUp size={20} color="#9BE7D3"/>
      </div>
      <span style={{ fontSize: "20px", fontWeight: 700, color: "#fff", letterSpacing: "-.3px" }}>FinSight</span>
    </div>

    {/* main copy */}
    <div style={{ marginTop: "60px", marginBottom: "36px", flex: 1 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 12px", borderRadius: "999px", backgroundColor: "rgba(155,231,211,0.15)", border: "1px solid rgba(155,231,211,0.25)", marginBottom: "24px" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#9BE7D3" }}/>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Trusted personal finance &amp; ledger</span>
      </div>

      <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-.5px" }}>
        Take control of<br/>your money.
      </h1>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: "0 0 36px", maxWidth: "380px" }}>
        Track multi-bank accounts, automate GST categorisation, monitor monthly burn rates, and reach your savings milestones with clarity.
      </p>

      <MiniBarChart/>
    </div>

    {/* footer */}
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(255,255,255,0.35)", paddingTop: "20px" }}>
      <span>© 2026 FinSight Technologies Pvt. Ltd.</span>
      <span>Mumbai • Bengaluru</span>
    </div>
  </div>
);

// ─── Login Page ───────────────────────────────────────────────────────────────
export const Login = ({ onLogin, onGoRegister }) => {
  const [email, setEmail]       = useState("Enter Email");
  const [password, setPassword] = useState("Password");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim())    e.email    = "Email is required";
    if (!password.trim()) e.password = "Password is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onLogin();
  };

  const inputStyle = (err) => ({
    width: "100%", padding: "11px 14px", fontSize: "14px", color: "#111827",
    backgroundColor: "#F9FAFB", border: `1.5px solid ${err ? "#DC2626" : "#E5E7EB"}`,
    borderRadius: "8px", outline: "none", boxSizing: "border-box",
    fontFamily: "Inter, sans-serif", transition: "border .15s",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <LeftPanel/>

      {/* right */}
      <div style={{ flex: 1, backgroundColor: "#F6F7F9", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "36px 40px", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Welcome back</h2>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 28px" }}>Sign in to your FinSight financial console</p>

            <form onSubmit={handleSubmit}>
              {/* email */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "7px" }}>
                  Work Email or Mobile
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    style={inputStyle(errors.email)}
                    onFocus={e => e.target.style.borderColor = "#2F6F63"}
                    onBlur={e => e.target.style.borderColor = errors.email ? "#DC2626" : "#E5E7EB"}
                  />
                  <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "10px", color: "#9CA3AF" }}>@</span>
                    </div>
                  </div>
                </div>
                {errors.email && <p style={{ fontSize: "12px", color: "#DC2626", margin: "5px 0 0" }}>{errors.email}</p>}
              </div>

              {/* password */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".07em" }}>
                    Password
                  </label>
                  <button type="button" style={{ background: "none", border: "none", fontSize: "13px", color: "#2F6F63", fontWeight: 500, cursor: "pointer", padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password} onChange={e => setPassword(e.target.value)}
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
                {errors.password && <p style={{ fontSize: "12px", color: "#DC2626", margin: "5px 0 0" }}>{errors.password}</p>}
              </div>

              {/* remember */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", cursor: "pointer" }}>
                <div
                  onClick={() => setRemember(v => !v)}
                  style={{
                    width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0,
                    backgroundColor: remember ? "#2F6F63" : "#fff",
                    border: `2px solid ${remember ? "#2F6F63" : "#D1D5DB"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}>
                  {remember && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: "13px", color: "#374151" }}>Remember this device for 30 days</span>
              </label>

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
                Log in <ArrowRight size={16}/>
              </button>

              {/* divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}/>
                <span style={{ fontSize: "12px", color: "#9CA3AF", whiteSpace: "nowrap" }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}/>
              </div>

              {/* OTP */}
              <button type="button" style={{
                width: "100%", padding: "11px", backgroundColor: "#fff",
                border: "1.5px solid #E5E7EB", borderRadius: "8px",
                fontSize: "14px", fontWeight: 500, color: "#374151",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                cursor: "pointer", marginBottom: "24px",
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
              >
                <Smartphone size={16}/> Login via Mobile OTP (+91)
              </button>

              {/* switch to register */}
              <p style={{ textAlign: "center", fontSize: "14px", color: "#6B7280", margin: 0 }}>
                New here?{" "}
                <button type="button" onClick={onGoRegister}
                  style={{ background: "none", border: "none", color: "#2F6F63", fontWeight: 700, cursor: "pointer", fontSize: "14px", padding: 0 }}>
                  Create an account
                </button>
              </p>
            </form>
          </div>

          {/* trust badges below card */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "16px" }}>
            {[
              { icon: ShieldCheck, text: "256-bit SSL Encrypted" },
              { icon: CheckCircle, text: "RBI Compliant Ledger" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#9CA3AF" }}>
                <Icon size={13} color="#9CA3AF"/> {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
