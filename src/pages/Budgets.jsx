import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Utensils,
  ShoppingBag,
  Car,
  Zap,
  Briefcase,
  Heart,
  Sparkles,
  ChevronDown,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { api } from "../utils/apiClient";

// ─── data ────────────────────────────────────────────────────────────────────
const budgetData = {
  totalBudget: 125000,
  totalSpent: 103420,
  daysRemaining: 5,
  categories: [
    {
      id: 1,
      name: "Food & Groceries",
      subtitle: "Dining & monthly pantry",
      icon: Utensils,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      spent: 28400,
      limit: 30000,
      status: "warning", // amber – near limit
    },
    {
      id: 2,
      name: "Shopping & Lifestyle",
      subtitle: "Discretionary retail",
      icon: ShoppingBag,
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
      spent: 14220,
      limit: 12000,
      status: "danger", // red – over budget
    },
    {
      id: 3,
      name: "Transportation & Fuel",
      subtitle: "Fastag, Uber & metro",
      icon: Car,
      iconBg: "#D1FAE5",
      iconColor: "#059669",
      spent: 12800,
      limit: 18000,
      status: "healthy",
    },
    {
      id: 4,
      name: "Utilities & Subscriptions",
      subtitle: "Power, Cloud & SaaS",
      icon: Zap,
      iconBg: "#E0E7FF",
      iconColor: "#4F46E5",
      spent: 11500,
      limit: 15000,
      status: "healthy",
    },
    {
      id: 5,
      name: "Office & Workspace",
      subtitle: "Co-working BKC & supplies",
      icon: Briefcase,
      iconBg: "#E6F4F1",
      iconColor: "#2F6F63",
      spent: 32500,
      limit: 40000,
      status: "healthy",
    },
    {
      id: 6,
      name: "Health & Personal Care",
      subtitle: "Gym, fitness & checkups",
      icon: Heart,
      iconBg: "#FCE7F3",
      iconColor: "#DB2777",
      spent: 4000,
      limit: 10000,
      status: "healthy",
    },
  ],
};

const insights = [
  {
    id: 1,
    type: "danger",
    icon: AlertTriangle,
    title: "Shopping is over budget by 18%",
    body: "Discretionary retail spend at Apple Store BKC exceeded your monthly cap of ₹12,000 by ₹2,220. Consider pausing discretionary card purchases.",
    tags: ["Discretionary", "Impact: High"],
    tagColors: ["#FEF3C7", "#FEE2E2"],
    tagTextColors: ["#D97706", "#DC2626"],
  },
  {
    id: 2,
    type: "warning",
    icon: AlertTriangle,
    title: "Food & Groceries near threshold",
    body: "You have used 94.7% of your ₹30,000 dining allowance with 5 days remaining in the month. Projected overspend is ₹1,800 at current burn rate.",
    tags: ["₹320/day limit", "Swiggy & Instamart"],
    tagColors: ["#FEF3C7", "#F3F4F6"],
    tagTextColors: ["#D97706", "#374151"],
  },
  {
    id: 3,
    type: "success",
    icon: CheckCircle,
    title: "Transportation is on track",
    body: "Cab and fuel spending is 28.9% below target. You are projected to save ₹5,200 this cycle to rollover into your Japan Travel Portfolio.",
    tags: ["₹5,200 saved", "Auto-transfer enabled"],
    tagColors: ["#D1FAE5", "#E6F4F1"],
    tagTextColors: ["#059669", "#2F6F63"],
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────
const formatINR = (n) => {
  const abs = Math.abs(Math.round(n));
  const s = abs.toString();
  if (s.length <= 3) return "₹" + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return "₹" + formatted + "," + last3;
};

const pct = (spent, limit) => Math.round((spent / limit) * 100);

// status colours
const statusStyles = {
  danger:  { bar: "#DC2626", text: "#DC2626", bg: "#FEE2E2" },
  warning: { bar: "#F59E0B", text: "#D97706", bg: "#FEF3C7" },
  healthy: { bar: "#2F6F63", text: "#059669", bg: "#D1FAE5" },
};

const statusLabel = {
  danger:  "over limit",
  warning: "Near limit",
  healthy: "Healthy",
};

// ─── sub-components ───────────────────────────────────────────────────────────
const BudgetCard = ({ cat }) => {
  const p = pct(cat.spent, cat.limit);
  const st = statusStyles[cat.status];
  const remaining = cat.limit - cat.spent;
  const isOver = cat.spent > cat.limit;
  const Icon = cat.icon;

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      border: "1px solid #E5E7EB",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "8px",
            backgroundColor: cat.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon size={18} color={cat.iconColor} />
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 }}>{cat.name}</p>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{cat.subtitle}</p>
          </div>
        </div>
        <button style={{
          padding: "4px", backgroundColor: "transparent", border: "none",
          cursor: "pointer", borderRadius: "6px", color: "#9CA3AF",
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F3F4F6"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <Edit2 size={14} />
        </button>
      </div>

      {/* amount */}
      <div>
        <span style={{ fontSize: "24px", fontWeight: 700, color: st.text }}>
          {formatINR(cat.spent)}
        </span>
        <span style={{ fontSize: "14px", color: "#6B7280", marginLeft: "6px" }}>
          of {formatINR(cat.limit)} limit
        </span>
      </div>

      {/* progress bar */}
      <div style={{ position: "relative" }}>
        <div style={{
          height: "8px", borderRadius: "999px",
          backgroundColor: "#F3F4F6", overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${Math.min(p, 100)}%`,
            backgroundColor: st.bar,
            borderRadius: "999px",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: "12px", fontWeight: 500,
          color: st.text,
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          {isOver
            ? `⊙ ${formatINR(Math.abs(remaining))} over limit`
            : `+${formatINR(remaining)} left · ${p}%`}
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 600,
          padding: "3px 8px", borderRadius: "999px",
          backgroundColor: st.bg, color: st.text,
        }}>
          {isOver ? `${p}% used` : statusLabel[cat.status]}
        </span>
      </div>
    </div>
  );
};

const InsightCard = ({ ins }) => {
  const Icon = ins.icon;
  const colourMap = { danger: "#DC2626", warning: "#D97706", success: "#059669" };
  const bgMap    = { danger: "#FEF2F2", warning: "#FFFBEB", success: "#F0FDF4" };
  const borderMap = { danger: "#FECACA", warning: "#FDE68A", success: "#BBF7D0" };

  return (
    <div style={{
      borderRadius: "10px",
      padding: "14px",
      backgroundColor: bgMap[ins.type],
      border: `1px solid ${borderMap[ins.type]}`,
      marginBottom: "12px",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
        <Icon size={15} color={colourMap[ins.type]} style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.4 }}>
          {ins.title}
        </p>
      </div>
      <p style={{ fontSize: "12px", color: "#374151", margin: "0 0 10px 0", lineHeight: 1.5 }}>
        {ins.body}
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {ins.tags.map((tag, i) => (
          <span key={i} style={{
            fontSize: "11px", fontWeight: 600,
            padding: "3px 8px", borderRadius: "999px",
            backgroundColor: ins.tagColors[i],
            color: ins.tagTextColors[i],
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── New Budget Modal ─────────────────────────────────────────────────────────
const NewBudgetModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: "Food & Groceries",
    limit: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Food & Groceries",
    "Shopping & Lifestyle",
    "Transportation & Fuel",
    "Utilities & Subscriptions",
    "Office & Workspace",
    "Health & Personal Care",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.category || !formData.limit) {
      setError("All fields are required");
      return;
    }

    const limit = parseFloat(formData.limit);
    if (isNaN(limit) || limit <= 0) {
      setError("Budget limit must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const newBudget = await api.budgets.create({
        category: formData.category,
        limit: limit,
      });
      onSave(newBudget);
      onClose();
      setFormData({ category: "Food & Groceries", limit: "" });
    } catch (err) {
      setError(err.message || "Failed to create budget");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "500px",
            padding: "24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
            Create New Budget
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "6px" }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "6px" }}>
                Monthly Limit (₹) *
              </label>
              <input
                type="number"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                placeholder="0"
                step="1000"
                min="0"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                  backgroundColor: "#fff",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#fff",
                  backgroundColor: loading ? "#9BE7D3" : "#2F6F63",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating..." : "Create Budget"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ─── main page ────────────────────────────────────────────────────────────────
export const Budgets = () => {
  const [month, setMonth] = useState("October 2026");
  const [budgetsData, setBudgetsData] = useState(budgetData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { totalBudget, totalSpent, daysRemaining, categories } = budgetsData;
  const remaining = totalBudget - totalSpent;
  const usedPct = pct(totalSpent, totalBudget);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await api.budgets.list();
      if (data && data.totalBudget) {
        setBudgetsData(data);
      }
    } catch (err) {
      console.error("Failed to load budgets:", err);
      setError("Failed to load budgets. Using demo data.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewBudget = (newBudget) => {
    if (budgetsData.categories) {
      setBudgetsData({
        ...budgetsData,
        categories: [newBudget, ...budgetsData.categories],
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{
      padding: "32px",
      backgroundColor: "#F6F7F9",
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* breadcrumb */}
      <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px", display: "flex", gap: "6px" }}>
        <span>PORTFOLIO</span><span>›</span>
        <span style={{ color: "#111827", fontWeight: 500 }}>BUDGETS</span>
      </div>

      {/* page header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
            Budgets
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
            Set monthly limits for each category and track active burn rate
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* month selector */}
          <button style={{
            padding: "9px 16px", borderRadius: "8px",
            border: "1px solid #D1D5DB", backgroundColor: "#fff",
            fontSize: "14px", fontWeight: 500, color: "#374151",
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
          }}>
            <Calendar size={15} />
            October 2026
            <ChevronDown size={14} />
          </button>
          {/* new budget */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
            padding: "9px 18px", borderRadius: "8px",
            border: "none", backgroundColor: "#2F6F63",
            fontSize: "14px", fontWeight: 500, color: "#fff",
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#275750"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2F6F63"}
          >
            <Plus size={15} />
            New budget
          </button>
        </div>
      </div>

      {/* ── Overview card ───────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: "#fff", borderRadius: "14px",
        border: "1px solid #E5E7EB", marginBottom: "24px",
        padding: "24px",
      }}>
        {/* top row: 4 metrics */}
        <div style={{ display: "flex", gap: "0", flexWrap: "wrap" }}>
          {/* label col */}
          <div style={{ flex: "1 1 220px", paddingRight: "24px", borderRight: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>
                Monthly Budget Overview
              </p>
              <span style={{
                padding: "3px 10px", borderRadius: "999px",
                backgroundColor: "#FEF3C7", color: "#D97706",
                fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap",
              }}>
                Cycle ends in {daysRemaining} days
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
              Overall spending vs planned limit across 6 active expense verticals
            </p>
          </div>

          {/* planned cap */}
          <div style={{ flex: "1 1 160px", padding: "0 24px", borderRight: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", margin: "0 0 6px" }}>
              Planned Cap
            </p>
            <p style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
              {formatINR(totalBudget)}
            </p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Allocated limit</p>
          </div>

          {/* current outflow */}
          <div style={{ flex: "1 1 160px", padding: "0 24px", borderRight: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", margin: 0 }}>
                Current Outflow
              </p>
              <span style={{
                padding: "2px 7px", borderRadius: "999px",
                backgroundColor: "#FEF3C7", color: "#D97706",
                fontSize: "11px", fontWeight: 600,
              }}>
                {usedPct}%
              </span>
            </div>
            <p style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
              {formatINR(totalSpent)}
            </p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Total debits recorded</p>
          </div>

          {/* safe surplus */}
          <div style={{ flex: "1 1 160px", paddingLeft: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em", margin: 0 }}>
                Safe Surplus
              </p>
              <span style={{
                padding: "2px 7px", borderRadius: "999px",
                backgroundColor: "#D1FAE5", color: "#059669",
                fontSize: "11px", fontWeight: 600,
              }}>
                +17.3%
              </span>
            </div>
            <p style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
              {formatINR(remaining)}
            </p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Remaining balance</p>
          </div>
        </div>

        {/* progress section */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "13px", color: "#374151" }}>
              <strong>{usedPct}% utilized</strong> · {formatINR(totalSpent)} of {formatINR(totalBudget)} threshold
            </span>
            <span style={{ fontSize: "12px", color: "#D97706", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              ⏱ {daysRemaining} days remaining in billing cycle
            </span>
          </div>

          {/* wide bar with markers */}
          <div style={{ position: "relative", height: "12px", borderRadius: "999px", backgroundColor: "#F3F4F6", overflow: "visible" }}>
            {/* fill */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${usedPct}%`,
              background: "linear-gradient(to right, #2F6F63, #9BE7D3)",
              borderRadius: "999px",
              transition: "width 0.5s ease",
            }} />
            {/* 80% warning marker */}
            <div style={{
              position: "absolute",
              left: "80%",
              top: "-4px",
              bottom: "-4px",
              width: "2px",
              backgroundColor: "#F59E0B",
              borderRadius: "2px",
            }} />
          </div>

          {/* scale labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "11px", color: "#9CA3AF" }}>0%</span>
            <span style={{ fontSize: "11px", color: "#9CA3AF" }}>50% (₹62.5k)</span>
            <span style={{ fontSize: "11px", color: "#F59E0B", fontWeight: 600 }}>80% Warning</span>
            <span style={{ fontSize: "11px", color: "#9CA3AF" }}>100% (Cap)</span>
          </div>
        </div>
      </div>

      {/* ── 2-column layout: grid + insights ────────────────────────────────── */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

        {/* ── Category grid (left) ──────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
                Department &amp; Category Allocations
              </h2>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                Real-time status calculated from synced HDFC &amp; ICICI accounts
              </p>
            </div>
            <span style={{
              fontSize: "12px", fontWeight: 600, padding: "4px 10px",
              borderRadius: "999px", backgroundColor: "#E6F4F1", color: "#2F6F63",
            }}>
              6 Categories
            </span>
          </div>

          {/* 2-column card grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {categories.map(cat => <BudgetCard key={cat.id} cat={cat} />)}
          </div>
        </div>

        {/* ── Insights panel (right) ─────────────────────────────────────────── */}
        <div style={{
          width: "300px", flexShrink: 0,
          backgroundColor: "#fff", borderRadius: "14px",
          border: "1px solid #E5E7EB", padding: "20px",
          fontFamily: "Inter, sans-serif",
        }}>
          {/* panel header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={16} color="#2F6F63" />
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>Budget Insights</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "6px",
                backgroundColor: "#2F6F63",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700, color: "#fff",
              }}>3</div>
              <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0", letterSpacing: "0.03em" }}>New</p>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "0 0 16px" }}>
            AI patterns for Oct 2026
          </p>

          {/* insight cards */}
          {insights.map(ins => <InsightCard key={ins.id} ins={ins} />)}

          {/* CTA */}
          <button style={{
            width: "100%", padding: "10px", marginTop: "4px",
            border: "1px solid #D1D5DB", borderRadius: "8px",
            backgroundColor: "#fff", fontSize: "13px", fontWeight: 500,
            color: "#374151", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F9FAFB"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
          >
            Adjust category allocations
            <ArrowRight size={14} />
          </button>

          {/* spend variance footer */}
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em" }}>
                Spend Variance
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#059669" }}>
                −4.2% vs Sep
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 10px" }}>
              Your aggregate burn velocity slowed down in the final week compared to September 2026.
            </p>
            {/* mini sparkline placeholder */}
            <svg width="100%" height="40" viewBox="0 0 260 40" fill="none">
              <polyline
                points="0,32 40,28 80,22 120,25 160,18 200,20 260,14"
                stroke="#2F6F63" strokeWidth="2.5" fill="none"
                strokeLinecap="round" strokeLinejoin="round"
              />
              <polyline
                points="0,32 40,28 80,22 120,25 160,18 200,20 260,14"
                stroke="#9BE7D3" strokeWidth="8" fill="none"
                strokeLinecap="round" strokeLinejoin="round"
                opacity="0.25"
              />
            </svg>
          </div>
        </div>
      </div>

      <NewBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleNewBudget} />
    </div>
  );
};
