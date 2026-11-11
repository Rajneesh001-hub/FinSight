import React, { useState } from "react";
import {
  Upload,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  X,
  RefreshCw,
  Shield,
  Clock,
  ArrowRight,
  TrendingUp,
  Zap,
  Building2,
  FileSpreadsheet,
  Braces,
  History,
  Eye,
} from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => {
  const isNeg = n < 0;
  const s = Math.abs(Math.round(n)).toString();
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const formatted = rest ? rest + "," + last3 : last3;
  return (isNeg ? "−₹" : "+₹") + formatted;
};

// ─── mock preview rows ────────────────────────────────────────────────────────
const previewRows = [
  {
    id: 1, date: "24 Oct 2026",
    description: "Swiggy Gourmet BKC", ref: "UTR/23481B/SwiggyRest",
    amount: -1240, category: "Food & Dining",
    icon: "🍽️", iconBg: "#FEF3C7",
    status: "new",
  },
  {
    id: 2, date: "23 Oct 2026",
    description: "WeWork Co-working Hub", ref: "NEFT/WW/NU/OfficeMonthl",
    amount: -32500, category: "Office & Workspace",
    icon: "🏢", iconBg: "#DBEAFE",
    status: "new",
  },
  {
    id: 3, date: "22 Oct 2026",
    description: "Client Retainer – FinEdge", ref: "RTGS/CR/InwardRemittance",
    amount: 80000, category: "Income",
    icon: "💼", iconBg: "#D1FAE5",
    status: "new",
  },
  {
    id: 4, date: "21 Oct 2026",
    description: "Reliance Fresh BKC Bandra", ref: "Matches existing Txn #HDFC-991204",
    amount: -2480, category: "Skipped (Duplicate)",
    icon: "🛒", iconBg: "#FEE2E2",
    status: "duplicate",
  },
  {
    id: 5, date: "20 Oct 2026",
    description: "Mumbai Metro One Recharge", ref: "POS/MMOP/Ghatkopar",
    amount: -500, category: "Transportation",
    icon: "🚇", iconBg: "#E0E7FF",
    status: "new",
  },
  {
    id: 6, date: "19 Oct 2026",
    description: "Apple Store BKC (Mac Cable)", ref: "POS/AppleRetail/Mumbai",
    amount: -6890, category: "Shopping",
    icon: "🛍️", iconBg: "#F3E8FF",
    status: "new",
  },
];

const columnMappings = ["Date", "Description / Payee", "Amount (INR)", "Category", "Reference", "Account", "— Skip —"];

const importHistory = [
  { id: 1, name: "HDFC_Cu...", full: "HDFC_Current_Oct2026.csv", date: "Oct 02, 2026", rows: 112, status: "Success", color: "#059669" },
  { id: 2, name: "Amex_Pl...", full: "Amex_Platinum_Sep2026.csv", date: "Sep 28, 2026", rows: 45, status: "Success", color: "#059669" },
  { id: 3, name: "ICICI_Dir...", full: "ICICI_Direct_Sep2026.csv", date: "Sep 15, 2026", rows: 88, status: "Success", color: "#059669" },
  { id: 4, name: "Cash_Ex...", full: "Cash_Expenses_Aug2026.csv", date: "Aug 31, 2026", rows: 24, status: "Success", color: "#059669" },
];

// ─── Step indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { n: 1, label: "UPLOAD", sub: "HDFC_Stateme...", detail: "420 KB · Clean parse" },
    { n: 2, label: "PREVIEW & MAP", sub: "Verify columns...", detail: "48 pending records" },
    { n: 3, label: "INGESTION", sub: "Sync with Gener...", detail: "Awaiting confirmation" },
  ];
  return (
    <div style={{ display: "flex", gap: "0", marginBottom: "24px" }}>
      {steps.map((s, i) => {
        const done = s.n < currentStep;
        const active = s.n === currentStep;
        return (
          <React.Fragment key={s.n}>
            <div style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: i === 0 ? "10px 0 0 10px" : i === 2 ? "0 10px 10px 0" : "0",
              backgroundColor: active ? "#2F6F63" : done ? "#E6F4F1" : "#F9FAFB",
              border: `1px solid ${active ? "#2F6F63" : "#E5E7EB"}`,
              borderRight: i < 2 ? "none" : undefined,
              fontFamily: "Inter, sans-serif",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  backgroundColor: active ? "#fff" : done ? "#2F6F63" : "#E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {done
                    ? <CheckCircle size={14} color="#2F6F63" />
                    : <span style={{ fontSize: "12px", fontWeight: 700, color: active ? "#2F6F63" : "#9CA3AF" }}>{s.n}</span>
                  }
                </div>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 600, color: active ? "#9BE7D3" : "#9CA3AF", margin: 0, letterSpacing: ".05em" }}>
                    STEP {s.n}: {s.label}
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: active ? "#fff" : done ? "#2F6F63" : "#9CA3AF", margin: 0 }}>
                    {s.sub}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: "11px", color: active ? "#9BE7D3" : "#9CA3AF", margin: 0, paddingLeft: "30px" }}>
                {s.detail}
              </p>
            </div>
            {i < 2 && (
              <div style={{ width: "1px", backgroundColor: "#E5E7EB", alignSelf: "stretch" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const ImportExport = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep] = useState(2);
  const [exportFormat, setExportFormat] = useState("CSV");
  const [dateRange, setDateRange] = useState("Current Financial Year (FY 202...)");
  const [account, setAccount] = useState("All Accounts (HDFC, ICICI, Ame...)");

  return (
    <div style={{ padding: "32px", backgroundColor: "#F6F7F9", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* breadcrumb */}
      <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px", display: "flex", gap: "6px" }}>
        <span>PORTFOLIO</span><span>›</span>
        <span style={{ color: "#111827", fontWeight: 500 }}>IMPORT / EXPORT</span>
      </div>

      {/* page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Import / Export</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
            Bring in your bank statements or download your consolidated data
          </p>
        </div>
        {/* action buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            { label: "Audit Trail", icon: Clock },
            { label: "Mapping Rules", icon: RefreshCw },
          ].map(({ label, icon: Icon }) => (
            <button key={label} style={{
              padding: "9px 16px", borderRadius: "8px",
              border: "1px solid #D1D5DB", backgroundColor: "#fff",
              fontSize: "13px", fontWeight: 500, color: "#374151",
              display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
            }}>
              <Icon size={14} /> {label}
            </button>
          ))}
          <button style={{
            padding: "9px 18px", borderRadius: "8px",
            backgroundColor: "#2F6F63", border: "none",
            fontSize: "13px", fontWeight: 500, color: "#fff",
            display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
          }}>
            <RefreshCw size={14} /> Sync NetBanking
          </button>
        </div>
      </div>

      {/* ── 2-column layout ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

        {/* ══ LEFT: Import card ══════════════════════════════════════════════ */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* import header card */}
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#E6F4F1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Upload size={18} color="#2F6F63" />
                </div>
                <div>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>Import transactions</p>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>Automated bank statement reconciliation and ledger ingestion</p>
                </div>
              </div>
              <span style={{
                padding: "4px 10px", borderRadius: "999px",
                backgroundColor: "#D1FAE5", color: "#059669",
                fontSize: "12px", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "5px",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#059669", display: "inline-block" }} />
                Step 2 of 3: Preview active
              </span>
            </div>

            {/* step indicator */}
            <StepIndicator currentStep={currentStep} />

            {/* drag & drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); }}
              style={{
                border: `2px dashed ${isDragging ? "#2F6F63" : "#D1D5DB"}`,
                borderRadius: "12px",
                backgroundColor: isDragging ? "#F0FAF8" : "#FAFAFA",
                padding: "36px 24px",
                textAlign: "center",
                transition: "all 0.2s ease",
                marginBottom: "16px",
              }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#E6F4F1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Upload size={24} color="#2F6F63" />
              </div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>
                Drag and drop your bank statement (CSV, XLSX, XLS) here, or browse
              </p>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 20px", lineHeight: 1.5 }}>
                FinSight's smart parser automatically maps headers, standardises<br />
                currency values, and checks for transaction hash collisions.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                <button style={{
                  padding: "10px 20px", borderRadius: "8px",
                  border: "1px solid #D1D5DB", backgroundColor: "#fff",
                  fontSize: "14px", fontWeight: 500, color: "#374151",
                  display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
                }}>
                  <FileText size={15} /> Choose file
                </button>
                <button style={{
                  padding: "10px 20px", borderRadius: "8px",
                  border: "1px solid #D1D5DB", backgroundColor: "#fff",
                  fontSize: "14px", fontWeight: 500, color: "#374151",
                  display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
                }}>
                  <Download size={15} /> Download sample CSV template
                </button>
              </div>
            </div>

            {/* supported banks */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>Supported native formats:</span>
              {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Amex India", "Standard CSV"].map(b => (
                <span key={b} style={{
                  padding: "3px 10px", borderRadius: "999px",
                  backgroundColor: "#F3F4F6", color: "#374151",
                  fontSize: "12px", fontWeight: 500,
                }}>{b}</span>
              ))}
            </div>

            {/* privacy note */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#F0FAF8", border: "1px solid #9BE7D3" }}>
              <Shield size={15} color="#2F6F63" />
              <p style={{ fontSize: "12px", color: "#374151", margin: 0 }}>
                Your file is processed locally for your account only. Bank credentials or raw PII are never stored.
              </p>
            </div>
          </div>

          {/* ── Preview table ─────────────────────────────────────────────────── */}
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "20px 24px" }}>
            {/* table header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>Parsed statement preview</p>
                <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                  Showing 5 of 50 rows{" "}
                  <span style={{ color: "#059669", fontWeight: 600 }}>(48 new,</span>{" "}
                  <span style={{ color: "#D97706", fontWeight: 600 }}>2 skipped)</span>
                </p>
              </div>
              {/* duplicate warning */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 12px", borderRadius: "8px",
                backgroundColor: "#FFFBEB", border: "1px solid #FDE68A",
                fontSize: "13px", fontWeight: 600, color: "#D97706",
              }}>
                <AlertTriangle size={14} /> 2 duplicates found, skipped
              </span>
            </div>

            {/* column mapping row */}
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 130px 160px 40px", gap: "0", backgroundColor: "#F9FAFB", borderRadius: "8px 8px 0 0", border: "1px solid #E5E7EB", borderBottom: "none", padding: "10px 12px" }}>
              {["SOURCE: COL 1", "SOURCE: COL 2", "SOURCE: COL 3", "SOURCE: COL 4"].map((col, i) => (
                <div key={i} style={{ paddingRight: "8px" }}>
                  <p style={{ fontSize: "9px", fontWeight: 600, color: "#9CA3AF", margin: "0 0 4px", letterSpacing: ".05em" }}>{col}</p>
                  <select style={{
                    width: "100%", padding: "5px 8px",
                    fontSize: "12px", color: "#374151",
                    border: "1px solid #D1D5DB", borderRadius: "6px",
                    backgroundColor: "#fff", cursor: "pointer", outline: "none",
                  }}>
                    {columnMappings.map(m => (
                      <option key={m} selected={m === ["Date", "Description / Payee", "Amount (INR)", "Category"][i]}>
                        {m === ["Date", "Description / Payee", "Amount (INR)", "Category"][i] ? `Map to: ${["T...", "Description / Pay", "A...", "Expense C..."][i]}` : m}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div />
            </div>

            {/* table */}
            <div style={{ border: "1px solid #E5E7EB", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
                <thead style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <tr>
                    {["Date", "Description & Payee", "Amount (INR)", "Category & Status", ""].map((h, i) => (
                      <th key={i} style={{
                        padding: "10px 12px", textAlign: i === 2 ? "right" : "left",
                        fontSize: "11px", fontWeight: 600, color: "#6B7280",
                        textTransform: "uppercase", letterSpacing: ".05em",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, idx) => {
                    const isDupe = row.status === "duplicate";
                    return (
                      <tr key={row.id} style={{
                        borderBottom: idx < previewRows.length - 1 ? "1px solid #F3F4F6" : "none",
                        backgroundColor: isDupe ? "#FFFBEB" : "transparent",
                        opacity: isDupe ? 0.85 : 1,
                      }}>
                        <td style={{ padding: "12px", fontSize: "13px", fontWeight: 500, color: "#111827", whiteSpace: "nowrap" }}>
                          {row.date}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "8px", backgroundColor: row.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px" }}>
                              {row.icon}
                            </div>
                            <div>
                              <p style={{ fontSize: "13px", fontWeight: 600, color: isDupe ? "#9CA3AF" : "#111827", margin: 0, textDecoration: isDupe ? "line-through" : "none" }}>
                                {row.description}
                              </p>
                              <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>{row.ref}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px", fontWeight: 700, textAlign: "right", color: row.amount > 0 ? "#059669" : "#DC2626" }}>
                          {fmt(row.amount)}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {isDupe ? (
                            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "999px", backgroundColor: "#FEF3C7", color: "#D97706", fontSize: "12px", fontWeight: 600 }}>
                              Skipped (Duplicate)
                            </span>
                          ) : (
                            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "999px", backgroundColor: "#F3F4F6", color: "#374151", fontSize: "12px", fontWeight: 500 }}>
                              {row.category}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button style={{ padding: "4px", border: "none", backgroundColor: "transparent", cursor: "pointer", borderRadius: "4px" }}>
                            <Eye size={14} color="#9CA3AF" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* bottom action bar */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: "16px", padding: "12px 16px",
              backgroundColor: "#F9FAFB", borderRadius: "8px",
              border: "1px solid #E5E7EB",
              flexWrap: "wrap", gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <Zap size={14} color="#2F6F63" />
                <span style={{ fontSize: "12px", color: "#6B7280" }}>
                  Auto-categorisation matched with <strong>96% confidence</strong>
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{
                  padding: "9px 18px", borderRadius: "8px",
                  border: "1px solid #D1D5DB", backgroundColor: "#fff",
                  fontSize: "13px", fontWeight: 500, color: "#374151", cursor: "pointer",
                }}>
                  Cancel
                </button>
                <button style={{
                  padding: "9px 20px", borderRadius: "8px",
                  backgroundColor: "#2F6F63", border: "none",
                  fontSize: "13px", fontWeight: 600, color: "#fff",
                  display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
                }}>
                  <CheckCircle size={15} /> Import 48 transactions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Export + History ════════════════════════════════════════ */}
        <div style={{ width: "300px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Export card */}
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#E6F4F1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Download size={16} color="#2F6F63" />
              </div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>Export data</p>
            </div>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 16px" }}>
              Download your consolidated records, tax reports, or raw ledger.
            </p>

            {/* format toggle */}
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", margin: "0 0 8px" }}>Export Format</p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              {["CSV", "JSON"].map(f => (
                <label key={f} style={{
                  flex: 1, display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 12px", borderRadius: "8px",
                  border: `1px solid ${exportFormat === f ? "#2F6F63" : "#E5E7EB"}`,
                  backgroundColor: exportFormat === f ? "#E6F4F1" : "#F9FAFB",
                  cursor: "pointer",
                }}>
                  <input
                    type="radio" name="format" value={f}
                    checked={exportFormat === f}
                    onChange={() => setExportFormat(f)}
                    style={{ accentColor: "#2F6F63" }}
                  />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: exportFormat === f ? "#2F6F63" : "#374151", margin: 0 }}>{f}</p>
                    <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0 }}>{f === "CSV" ? "Spreadsheet" : "Developer/API"}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* date range */}
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", margin: "0 0 6px" }}>Date Range</p>
            <div style={{ position: "relative", marginBottom: "14px" }}>
              <select style={{
                width: "100%", padding: "10px 36px 10px 12px",
                fontSize: "13px", color: "#374151",
                border: "1px solid #D1D5DB", borderRadius: "8px",
                backgroundColor: "#F9FAFB", cursor: "pointer",
                outline: "none", appearance: "none",
              }}>
                <option>Current Financial Year (FY 2026)</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Custom range</option>
              </select>
              <ChevronDown size={14} color="#6B7280" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>

            {/* account */}
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", margin: "0 0 6px" }}>Account / Ledger</p>
            <div style={{ position: "relative", marginBottom: "18px" }}>
              <select style={{
                width: "100%", padding: "10px 36px 10px 12px",
                fontSize: "13px", color: "#374151",
                border: "1px solid #D1D5DB", borderRadius: "8px",
                backgroundColor: "#F9FAFB", cursor: "pointer",
                outline: "none", appearance: "none",
              }}>
                <option>All Accounts (HDFC, ICICI, Amex)</option>
                <option>HDFC Business Bank</option>
                <option>ICICI Current</option>
                <option>Amex Card •• 4092</option>
              </select>
              <ChevronDown size={14} color="#6B7280" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>

            {/* export button */}
            <button style={{
              width: "100%", padding: "11px",
              backgroundColor: "#2F6F63", border: "none", borderRadius: "8px",
              fontSize: "14px", fontWeight: 600, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "7px", cursor: "pointer", marginBottom: "10px",
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#275750"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2F6F63"}
            >
              <Download size={16} /> Export data
            </button>
            <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", margin: 0 }}>
              Includes all categorised expenses, tax tags, and receipt notes.
            </p>
          </div>

          {/* Import history card */}
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <History size={16} color="#2F6F63" />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>Import history</span>
              </div>
              <button style={{
                fontSize: "12px", fontWeight: 500, color: "#2F6F63",
                backgroundColor: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "4px",
              }}>
                View all logs <ArrowRight size={12} />
              </button>
            </div>

            {/* history rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {importHistory.map(h => (
                <div key={h.id} style={{
                  padding: "10px 12px", borderRadius: "8px",
                  backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "6px",
                    backgroundColor: "#E6F4F1",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <FileSpreadsheet size={15} color="#2F6F63" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {h.name}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>
                      Imported on {h.date} · {h.rows} rows
                    </p>
                  </div>
                  <span style={{
                    padding: "3px 8px", borderRadius: "999px",
                    backgroundColor: "#D1FAE5", color: "#059669",
                    fontSize: "11px", fontWeight: 600, flexShrink: 0,
                  }}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>

            {/* totals row */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: "14px", padding: "12px",
              backgroundColor: "#F9FAFB", borderRadius: "8px",
              border: "1px solid #E5E7EB",
            }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".04em", margin: "0 0 2px" }}>
                  Total Imported (FY)
                </p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>1,420 Txns</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".04em", margin: "0 0 2px" }}>
                  Accuracy Rate
                </p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#059669", margin: 0 }}>99.8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
