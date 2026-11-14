import React, { useState } from "react";
import {
  ChevronRight, Download, Plus, Wallet, TrendingUp,
  TrendingDown, PiggyBank, ArrowUp, ArrowDown,
  AlertCircle, ChevronRight as CR, Shield, Laptop, Plane, CheckCircle, Loader,
} from "lucide-react";
import {
  summaryCards, spendingByCategory, incomeVsExpenses,
  monthlyBudgets, financialGoals, recentTransactions, filterCategories,
} from "../data/mockData";
import { AddTransactionModal } from "../components/AddTransactionModal";
import { api } from "../utils/apiClient";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n) => {
  const isNeg = n < 0;
  const abs = Math.abs(Math.round(n));
  const s = abs.toString();
  if (s.length <= 3) return (isNeg ? "-₹" : "₹") + s;
  const last3 = s.slice(-3);
  const rest  = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (isNeg ? "-₹" : "₹") + rest + "," + last3;
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const iconMap = { wallet: Wallet, "trending-up": TrendingUp, "trending-down": TrendingDown, "piggy-bank": PiggyBank };
const colorMap = {
  teal:  { iconBg: "#E6F4F1", iconColor: "#2F6F63" },
  green: { iconBg: "#DCFCE7", iconColor: "#16A34A" },
  red:   { iconBg: "#FEE2E2", iconColor: "#DC2626" },
};

const SummaryCard = ({ label, amount, change, icon, color }) => {
  const Icon = iconMap[icon] || Wallet;
  const c = colorMap[color] || colorMap.teal;
  const pos = change >= 0;
  return (
    <div style={{
      backgroundColor: "#fff", borderRadius: "14px",
      padding: "20px 22px", border: "1px solid #E5E7EB",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <span style={{ fontSize: "14px", color: "#6B7280", fontWeight: 500 }}>{label}</span>
        <div style={{ backgroundColor: c.iconBg, padding: "8px", borderRadius: "8px" }}>
          <Icon size={18} color={c.iconColor} />
        </div>
      </div>
      <h3 style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
        {fmtINR(amount)}
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: pos ? "#16A34A" : "#DC2626" }}>
        {pos ? <ArrowUp size={13}/> : <ArrowDown size={13}/>}
        <span>{pos ? "+" : ""}{change}% vs last month</span>
      </div>
    </div>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.amount, 0);
  const r = 70, cx = 100, cy = 100;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "22px", border: "1px solid #E5E7EB" }}>
      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>Spending by category</h3>
      <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "0 0 20px" }}>October 2026 • Total outflow ₹1,18,420</p>

      {/* donut */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{ position: "relative", width: "200px", height: "200px" }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.map((item, i) => {
              const seg = circ * (item.amount / total);
              const dash = `${seg} ${circ}`;
              const off  = -offset;
              offset += seg;
              return (
                <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                  stroke={item.color} strokeWidth="34"
                  strokeDasharray={dash} strokeDashoffset={off}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px" }}
                />
              );
            })}
            <circle cx={cx} cy={cy} r="51" fill="#fff"/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 600, letterSpacing: ".05em" }}>TOTAL</span>
            <span style={{ fontSize: "19px", fontWeight: 700, color: "#2F6F63", lineHeight: 1.2 }}>₹1.18L</span>
            <span style={{ fontSize: "10px", color: "#9CA3AF" }}>6 Categories</span>
          </div>
        </div>
      </div>

      {/* legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginBottom: "14px" }}>
        {data.map((item, i) => {
          const pct = ((item.amount / total) * 100).toFixed(1);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: item.color, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", margin: "0 0 1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B7280" }}>
                  <span>{fmtINR(item.amount)}</span>
                  <span style={{ fontWeight: 600 }}>{pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "12px", textAlign: "center" }}>
        <button style={{ color: "#2F6F63", fontSize: "13px", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
          View budget audit trail →
        </button>
      </div>
    </div>
  );
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = ({ data, title, subtitle }) => {
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expenses]));
  const yMax   = Math.ceil(maxVal / 50000) * 50000;
  const ySteps = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "22px", border: "1px solid #E5E7EB" }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>{title}</h3>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>{subtitle}</p>
        </div>
        <div style={{ display: "flex", gap: "14px" }}>
          {[["#2F6F63","Inflow (₹)"],["#9BE7D3","Outflow (₹)"]].map(([bg,lbl]) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#6B7280" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: bg, borderRadius: "2px" }}/>
              {lbl}
            </div>
          ))}
        </div>
      </div>

      {/* chart body */}
      <div style={{ display: "flex", height: "200px", gap: "8px" }}>
        {/* Y axis */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: "20px", paddingTop: "4px", minWidth: "50px", textAlign: "right" }}>
          {ySteps.map((r,i) => (
            <span key={i} style={{ fontSize: "10px", color: "#9CA3AF" }}>
              {r === 0 ? "₹0" : `₹${(yMax * r / 100000).toFixed(2)}L`}
            </span>
          ))}
        </div>

        {/* bars */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-around", paddingBottom: "20px" }}>
          {data.map((m, i) => {
            const ih = (m.income   / yMax) * 160;
            const eh = (m.expenses / yMax) * 160;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "160px", justifyContent: "center" }}>
                  <div style={{ width: "12px", height: `${ih}px`, backgroundColor: "#2F6F63", borderRadius: "3px 3px 0 0" }}/>
                  <div style={{ width: "12px", height: `${eh}px`, backgroundColor: "#9BE7D3", borderRadius: "3px 3px 0 0" }}/>
                </div>
                <span style={{ fontSize: "10px", color: "#6B7280", marginTop: "7px", fontWeight: 500 }}>{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* info strip */}
      <div style={{ padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "50%", flexShrink: 0 }}/>
        <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
          <strong>Net positive liquidity delta sustained</strong> across all 4 reporting periods.{" "}
          <strong style={{ color: "#2F6F63" }}>Avg. Retention: ₹1,27,430/mo</strong>
        </p>
      </div>
    </div>
  );
};

// ─── Budget Section ───────────────────────────────────────────────────────────
const BudgetSection = ({ budgets }) => {
  const statusStyles = {
    ok:      { bar: "#10B981", badgeBg: "#DCFCE7", badgeText: "#16A34A", label: "On track"   },
    warning: { bar: "#F59E0B", badgeBg: "#FEF3C7", badgeText: "#D97706", label: "Near limit" },
    danger:  { bar: "#EF4444", badgeBg: "#FEE2E2", badgeText: "#DC2626", label: "Over limit" },
  };

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "22px", border: "1px solid #E5E7EB" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Monthly budgets</h3>
          <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Categorize expenditure caps and utilization</p>
        </div>
        <button style={{ background: "none", border: "none", color: "#2F6F63", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
          Manage budgets <CR size={13}/>
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {budgets.map(b => {
          const pct = (b.spent / b.limit) * 100;
          const over = b.spent > b.limit;
          const st = statusStyles[b.status] || statusStyles.ok;
          return (
            <div key={b.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>{b.name}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px",
                  backgroundColor: st.badgeBg, color: st.badgeText }}>
                  {st.label}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B7280", marginBottom: "6px" }}>
                <span>{fmtINR(b.spent)} / {fmtINR(b.limit)}</span>
                <span style={{ fontWeight: 600, color: over ? "#DC2626" : "#16A34A" }}>
                  {over ? `+${fmtINR(b.spent - b.limit)} over` : `${fmtINR(b.limit - b.spent)} left`}
                </span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#E5E7EB", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, backgroundColor: st.bar, borderRadius: "999px", transition: "width .3s" }}/>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "16px", padding: "10px 12px", backgroundColor: "#FFFBEB", borderRadius: "8px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
        <AlertCircle size={15} color="#D97706" style={{ flexShrink: 0, marginTop: "1px" }}/>
        <p style={{ fontSize: "12px", color: "#92400E", margin: 0, lineHeight: 1.5 }}>
          <strong>Shopping & Lifestyle</strong> is over budget by ₹2,220. Consider pausing discretionary spending for the rest of the month.
        </p>
      </div>
    </div>
  );
};

// ─── Goals Section ────────────────────────────────────────────────────────────
const goalIconMap = { shield: Shield, laptop: Laptop, plane: Plane };

const GoalsSection = ({ goals }) => (
  <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "22px", border: "1px solid #E5E7EB" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Financial goals</h3>
        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Capital accumulation and milestones</p>
      </div>
      <button style={{ padding: "6px 12px", border: "1px solid #D1D5DB", borderRadius: "8px",
        backgroundColor: "#fff", fontSize: "12px", fontWeight: 500, color: "#6B7280",
        display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
        <Plus size={13}/> New goal
      </button>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {goals.map(g => {
        const Icon = goalIconMap[g.icon] || Shield;
        const remaining = g.target - g.saved;
        return (
          <div key={g.id} style={{ padding: "14px", borderRadius: "10px", border: "1px solid #E5E7EB", backgroundColor: "#FAFAFA" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{g.name}</p>
                <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>Target: {fmtINR(g.target)}</p>
              </div>
              <div style={{ backgroundColor: "#E6F4F1", padding: "7px", borderRadius: "8px", flexShrink: 0 }}>
                <Icon size={15} color="#2F6F63"/>
              </div>
            </div>

            {/* progress */}
            <div style={{ height: "5px", backgroundColor: "#E5E7EB", borderRadius: "999px", marginBottom: "6px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(g.percentage, 100)}%`, backgroundColor: "#2F6F63", borderRadius: "999px" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
              <span style={{ color: "#6B7280" }}>{fmtINR(g.saved)} saved</span>
              <span style={{ fontWeight: 700, color: "#2F6F63" }}>{g.percentage.toFixed(1)}%</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #E5E7EB" }}>
              <span style={{ color: "#6B7280" }}>Remaining: <strong style={{ color: "#111827" }}>{fmtINR(remaining)}</strong></span>
              <span style={{ color: "#6B7280" }}>Due: <strong style={{ color: "#111827" }}>{g.dueDate}</strong></span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Transactions Table ───────────────────────────────────────────────────────
const categoryColors = {
  Income:          { bg: "#D1FAE5", text: "#059669" },
  "Food & Dining": { bg: "#FED7AA", text: "#C2410C" },
  "Rent & Housing":{ bg: "#DBEAFE", text: "#1D4ED8" },
  Shopping:        { bg: "#E9D5FF", text: "#7C3AED" },
  "Bills & Utilities":{ bg: "#FEE2E2", text: "#DC2626" },
  Transport:       { bg: "#FEF3C7", text: "#D97706" },
};

const TransactionsTable = ({ transactions, categories }) => {
  const [sel, setSel] = React.useState("All");
  const [q,   setQ  ] = React.useState("");

  const filtered = transactions.filter(t => {
    const catMatch = sel === "All" || t.category === sel;
    const qMatch   = !q || t.description.toLowerCase().includes(q.toLowerCase());
    return catMatch && qMatch;
  });

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid #E5E7EB" }}>
      {/* header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 3px" }}>Recent transactions</h3>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>(Showing 6 of 84 entries for October 2026)</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px",
              backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search payee, notes..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "#111827", width: "180px" }}/>
            </div>
            <button style={{ padding: "8px 14px", border: "1px solid #D1D5DB", borderRadius: "8px",
              backgroundColor: "#fff", fontSize: "13px", color: "#374151", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filter
            </button>
            <button style={{ padding: "8px 14px", border: "1px solid #D1D5DB", borderRadius: "8px",
              backgroundColor: "#fff", fontSize: "13px", color: "#374151", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              CSV
            </button>
          </div>
        </div>

        {/* category pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setSel(c)} style={{
              padding: "7px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: 500,
              whiteSpace: "nowrap", border: "none", cursor: "pointer",
              backgroundColor: sel === c ? "#2F6F63" : "#F3F4F6",
              color: sel === c ? "#fff" : "#374151",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
          <thead style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
            <tr>
              {["DATE","DESCRIPTION","CATEGORY","ACCOUNT","AMOUNT (₹)","STATUS"].map((h,i) => (
                <th key={h} style={{
                  padding: "11px " + (i===0||i===5 ? "24px" : "16px"),
                  textAlign: i===4 ? "right" : i===5 ? "center" : "left",
                  fontSize: "11px", fontWeight: 600, color: "#6B7280", letterSpacing: ".05em",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn, idx) => {
              const isIncome = txn.amount > 0;
              const cc = categoryColors[txn.category] || { bg: "#F3F4F6", text: "#374151" };
              return (
                <tr key={txn.id}
                  style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #F3F4F6" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={{ padding: "14px 24px", fontSize: "13px", fontWeight: 500, color: "#111827", whiteSpace: "nowrap" }}>
                    {txn.date}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: "0 0 2px" }}>{txn.description}</p>
                    <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>{txn.details}</p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
                      backgroundColor: cc.bg, color: cc.text }}>{txn.category}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{txn.account}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 700, textAlign: "right",
                    color: isIncome ? "#059669" : "#111827" }}>
                    {isIncome ? "+" : "-"}{fmtINR(Math.abs(txn.amount))}
                  </td>
                  <td style={{ padding: "14px 24px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      <span style={{ fontSize: "12px", color: "#059669", fontWeight: 500 }}>Completed</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div style={{ padding: "14px 24px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          Showing <strong>1 to 6</strong> of <strong>84</strong> entries
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {["Previous", 1, 2, 3, "...", 14, "Next"].map((p, i) => (
            <button key={i} style={{
              padding: "6px 12px", border: "none", borderRadius: "6px", fontSize: "13px",
              fontWeight: 500, cursor: "pointer",
              backgroundColor: p === 1 ? "#2F6F63" : "transparent",
              color: p === 1 ? "#fff" : (p === "Previous" || p === "Next") ? "#9CA3AF" : "#374151",
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 1000,
      animation: "slideIn 0.3s ease-out",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "8px",
        backgroundColor: type === "success" ? "#D1FAE5" : "#FEE2E2",
        color: type === "success" ? "#065F46" : "#7F1D1D",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}>
        {type === "success" ? (
          <CheckCircle size={18} />
        ) : (
          <AlertCircle size={18} />
        )}
        <span style={{ fontSize: "13px", fontWeight: 500 }}>{message}</span>
      </div>
    </div>
  );
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const handleAddTransactionClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTransactionSave = (newTransaction) => {
    setIsModalOpen(false);
    setToastMessage("Transaction added successfully!");
    setToastType("success");
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await api.export.csv();
      setToastMessage("Export completed successfully!");
      setToastType("success");
    } catch (err) {
      setToastMessage(err.message || "Failed to export data");
      setToastType("error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#F6F7F9", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* ── Page header: white bar, full width, same 32px padding ── */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ padding: "16px 32px" }}>

          {/* breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#9CA3AF", marginBottom: "10px" }}>
            <span style={{ letterSpacing: ".04em" }}>PORTFOLIO</span>
            <ChevronRight size={12}/>
            <span style={{ color: "#4B5563", fontWeight: 600, letterSpacing: ".04em" }}>DASHBOARD</span>
          </div>

          {/* title + controls — same row, same 32px indent */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#111827", margin: "0 0 3px", lineHeight: 1.2 }}>Dashboard</h1>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                Welcome back, Arjun. Here's your consolidated financial position for Mumbai
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <select style={{
                padding: "8px 32px 8px 12px", border: "1px solid #D1D5DB", borderRadius: "8px",
                fontSize: "13px", color: "#374151", backgroundColor: "#fff",
                cursor: "pointer", fontFamily: "Inter, sans-serif", outline: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
              }}>
                <option>This month (Oct 2026)</option>
                <option>Last month</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
              </select>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                style={{
                  padding: "8px 16px", border: "1px solid #D1D5DB", borderRadius: "8px",
                  backgroundColor: "#fff", fontSize: "13px", fontWeight: 500, color: "#374151",
                  display: "flex", alignItems: "center", gap: "6px", cursor: isExporting ? "not-allowed" : "pointer",
                  opacity: isExporting ? 0.6 : 1,
                }}
                onMouseEnter={e => !isExporting && (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                onMouseLeave={e => !isExporting && (e.currentTarget.style.backgroundColor = "#fff")}
              >
                {isExporting ? (
                  <>
                    <Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> Exporting...
                  </>
                ) : (
                  <>
                    <Download size={14}/> Export
                  </>
                )}
              </button>
              <button 
                onClick={handleAddTransactionClick}
                style={{
                  padding: "8px 18px", backgroundColor: "#2F6F63", border: "none",
                  borderRadius: "8px", fontSize: "13px", fontWeight: 500, color: "#fff",
                  display: "flex", alignItems: "center", gap: "6px", cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#275750"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2F6F63"}
              >
                <Plus size={14}/> Add transaction
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Body: same 32px padding left/right, no max-width centering ── */}
      <div style={{ padding: "24px 32px" }}>

        {/* Row 1 – 4 summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <SummaryCard label={summaryCards.totalBalance.label} amount={summaryCards.totalBalance.amount} change={summaryCards.totalBalance.change} icon="wallet" color="teal"/>
          <SummaryCard label={summaryCards.income.label}       amount={summaryCards.income.amount}       change={summaryCards.income.change}       icon="trending-up"   color="green"/>
          <SummaryCard label={summaryCards.expenses.label}     amount={summaryCards.expenses.amount}     change={summaryCards.expenses.change}     icon="trending-down" color="red"/>
          <SummaryCard label={summaryCards.savings.label}      amount={summaryCards.savings.amount}      change={summaryCards.savings.change}      icon="piggy-bank"    color="teal"/>
        </div>

        {/* Row 2 – Donut + Bar chart side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          <DonutChart data={spendingByCategory.categories}/>
          <BarChart
            data={incomeVsExpenses.months}
            title={incomeVsExpenses.title}
            subtitle={incomeVsExpenses.subtitle}
          />
        </div>

        {/* Row 3 – Budgets + Goals side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          <BudgetSection budgets={monthlyBudgets}/>
          <GoalsSection  goals={financialGoals}/>
        </div>

        {/* Row 4 – Full-width transactions */}
        <TransactionsTable transactions={recentTransactions} categories={filterCategories}/>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        onSave={handleTransactionSave}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
};
