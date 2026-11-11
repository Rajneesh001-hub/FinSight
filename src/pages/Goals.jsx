import React, { useState } from "react";
import {
  Plus,
  Edit2,
  PiggyBank,
  Target,
  Trophy,
  Shield,
  Monitor,
  Plane,
  Building,
  CheckCircle,
  Calendar,
  RefreshCw,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => {
  const s = Math.abs(Math.round(n)).toString();
  if (s.length <= 3) return "₹" + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return "₹" + rest + "," + last3;
};

// ─── data ─────────────────────────────────────────────────────────────────────
const goals = [
  {
    id: 1,
    icon: Shield,
    iconBg: "#E6F4F1",
    iconColor: "#2F6F63",
    name: "Emergency fund",
    subtitle: "6 months of essential living &...",
    tag: "PRIORITY",
    tagBg: "#2F6F63",
    tagColor: "#fff",
    tagIcon: "priority",
    pct: 75,
    saved: 375000,
    target: 500000,
    remaining: 125000,
    remainingLabel: "₹1,25,000 to go",
    remainingColor: "#D97706",
    dueLabel: "Target: Dec 2026",
    daysLeft: "65 days left",
    autoLabel: "Auto-debit: ₹25,000/mo ...",
    status: "active",
    rowLabel: "Remaining balance",
  },
  {
    id: 2,
    icon: Monitor,
    iconBg: "#D1FAE5",
    iconColor: "#059669",
    name: "New laptop",
    subtitle: "Mac Studio M3 Max for product...",
    tag: "Completed",
    tagBg: "#D1FAE5",
    tagColor: "#059669",
    tagIcon: "check",
    pct: 100,
    saved: 180000,
    target: 180000,
    remaining: 0,
    remainingLabel: "Fully funded · Ready to buy",
    remainingColor: "#059669",
    dueLabel: "Completed on Oct 18, 2026",
    daysLeft: "Achieved 14 days early",
    autoLabel: null,
    status: "completed",
    rowLabel: "Goal milestone",
  },
  {
    id: 3,
    icon: Plane,
    iconBg: "#E0E7FF",
    iconColor: "#4F46E5",
    name: "Japan trip",
    subtitle: "Tokyo & Kyoto cherry blossom...",
    tag: "Lifestyle",
    tagBg: "#E6F4F1",
    tagColor: "#2F6F63",
    tagIcon: null,
    pct: 34,
    saved: 85000,
    target: 250000,
    remaining: 165000,
    remainingLabel: "₹1,65,000 to go",
    remainingColor: "#6B7280",
    dueLabel: "Target: Mar 2027",
    daysLeft: "152 days left",
    autoLabel: "Auto-save: ₹15,000/mo",
    status: "active",
    rowLabel: "Remaining balance",
  },
  {
    id: 4,
    icon: Building,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    name: "Home down payment",
    subtitle: "2BHK apartment booking token in...",
    tag: "Long-term",
    tagBg: "#F3F4F6",
    tagColor: "#6B7280",
    tagIcon: null,
    pct: 37.5,
    saved: 345000,
    target: 920000,
    remaining: 575000,
    remainingLabel: "₹5,75,000 to go",
    remainingColor: "#6B7280",
    dueLabel: "Target: Oct 2027",
    daysLeft: "365 days left",
    autoLabel: "Auto-deposit: ₹35,000/m...",
    status: "active",
    rowLabel: "Remaining balance",
  },
];

// ─── Circular progress ring ───────────────────────────────────────────────────
const CircleRing = ({ pct, completed }) => {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const fill = Math.min(pct, 100) / 100;
  const dashOffset = circ * (1 - fill);
  const color = completed ? "#059669" : "#2F6F63";
  const trackColor = completed ? "#D1FAE5" : "#E5E7EB";

  return (
    <div style={{ position: "relative", width: "112px", height: "112px", flexShrink: 0 }}>
      <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: "rotate(-90deg)" }}>
        {/* track */}
        <circle cx="56" cy="56" r={r} fill="none" stroke={trackColor} strokeWidth="10" />
        {/* fill */}
        <circle
          cx="56" cy="56" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      {/* centre text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {completed
          ? <CheckCircle size={24} color="#059669" />
          : <>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#111827", lineHeight: 1 }}>
                {pct}%
              </span>
              <span style={{ fontSize: "10px", color: "#6B7280", marginTop: "2px" }}>funded</span>
            </>
        }
      </div>
    </div>
  );
};

// ─── Goal card ────────────────────────────────────────────────────────────────
const GoalCard = ({ goal }) => {
  const Icon = goal.icon;
  const isCompleted = goal.status === "completed";

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "14px",
      border: `1px solid ${isCompleted ? "#BBF7D0" : "#E5E7EB"}`,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      fontFamily: "Inter, sans-serif",
      boxShadow: isCompleted ? "0 0 0 2px #D1FAE5" : "none",
    }}>
      {/* header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            backgroundColor: goal.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon size={20} color={goal.iconColor} />
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>
              {goal.name}
            </p>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
              {goal.subtitle}
            </p>
          </div>
        </div>

        {/* tag */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "4px 10px", borderRadius: "999px",
          backgroundColor: goal.tagBg, color: goal.tagColor,
          fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap",
          border: `1px solid ${isCompleted ? "#6EE7B7" : "transparent"}`,
        }}>
          {goal.tagIcon === "check" && <CheckCircle size={12} />}
          {goal.tagIcon === "priority" && <span style={{ fontSize: "12px" }}>⚑</span>}
          {goal.tag}
        </span>
      </div>

      {/* body: ring + amounts */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <CircleRing pct={goal.pct} completed={isCompleted} />

        {/* amount table */}
        <div style={{ flex: 1 }}>
          {[
            { label: "Current Saved", value: fmt(goal.saved), color: isCompleted ? "#059669" : "#111827", bold: true },
            { label: "Target Amount", value: fmt(goal.target), color: "#111827", bold: false },
            { label: goal.rowLabel, value: goal.remainingLabel, color: goal.remainingColor, bold: false },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "5px 0",
              borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
            }}>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>{row.label}</span>
              <span style={{
                fontSize: "13px",
                fontWeight: row.bold ? 700 : 500,
                color: row.color,
              }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* footer: due date + auto */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px",
        backgroundColor: "#F9FAFB",
        borderRadius: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={14} color="#6B7280" />
          <div>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#374151", margin: 0 }}>
              {goal.dueLabel}
            </p>
            <p style={{ fontSize: "11px", color: isCompleted ? "#059669" : "#6B7280", margin: 0, fontWeight: isCompleted ? 600 : 400 }}>
              {goal.daysLeft}
            </p>
          </div>
        </div>
        {goal.autoLabel && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <RefreshCw size={13} color="#9CA3AF" />
            <span style={{ fontSize: "12px", color: "#6B7280" }}>{goal.autoLabel}</span>
          </div>
        )}
      </div>

      {/* action buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        {isCompleted ? (
          <>
            <button style={btnOutline}>
              <Edit2 size={14} /> Edit
            </button>
            <button style={btnOutline}>
              <TrendingUp size={14} /> Purchase note
            </button>
          </>
        ) : (
          <>
            <button style={btnOutline}>
              <Edit2 size={14} /> Edit
            </button>
            <button style={btnPrimary}>
              <Plus size={14} /> Add money
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── shared button styles ─────────────────────────────────────────────────────
const btnOutline = {
  flex: 1,
  padding: "9px 0",
  fontSize: "13px",
  fontWeight: 500,
  color: "#374151",
  backgroundColor: "#fff",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontFamily: "Inter, sans-serif",
};

const btnPrimary = {
  flex: 1,
  padding: "9px 0",
  fontSize: "13px",
  fontWeight: 500,
  color: "#fff",
  backgroundColor: "#2F6F63",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontFamily: "Inter, sans-serif",
};

// ─── Summary card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, sub, subColor, icon: Icon, iconBg, iconColor }) => (
  <div style={{
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    padding: "20px 24px",
    fontFamily: "Inter, sans-serif",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
      <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em" }}>
        {label}
      </span>
      <div style={{
        width: "34px", height: "34px", borderRadius: "8px",
        backgroundColor: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={17} color={iconColor} />
      </div>
    </div>
    <p style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>{value}</p>
    <p style={{ fontSize: "13px", color: subColor || "#6B7280", margin: 0 }}>{sub}</p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export const Goals = () => {
  const totalSaved  = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const completed   = goals.filter(g => g.status === "completed").length;

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
        <span style={{ color: "#111827", fontWeight: 500 }}>GOALS</span>
      </div>

      {/* page header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "24px",
        flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#111827", margin: 0 }}>Goals</h1>
            <span style={{
              padding: "4px 10px", borderRadius: "999px",
              backgroundColor: "#E6F4F1", color: "#2F6F63",
              fontSize: "12px", fontWeight: 600,
            }}>
              {goals.length} Targets
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
            Track progress toward what matters and manage dedicated capital milestones.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* filter dropdown */}
          <button style={{
            padding: "9px 16px", borderRadius: "8px",
            border: "1px solid #D1D5DB", backgroundColor: "#fff",
            fontSize: "14px", fontWeight: 500, color: "#374151",
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
          }}>
            <SlidersHorizontal size={15} />
            All Goals ({goals.length})
            <ChevronDown size={14} />
          </button>
          {/* new goal */}
          <button style={{
            padding: "9px 18px", borderRadius: "8px",
            backgroundColor: "#2F6F63", border: "none",
            fontSize: "14px", fontWeight: 500, color: "#fff",
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#275750"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2F6F63"}
          >
            <Plus size={15} />
            New goal
          </button>
        </div>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
        <SummaryCard
          label="Total Saved"
          value={fmt(totalSaved)}
          sub={<><span style={{ color: "#059669", fontWeight: 600 }}>↑ +₹45,000</span> deposited this month</>}
          icon={PiggyBank}
          iconBg="#E6F4F1"
          iconColor="#2F6F63"
        />
        <SummaryCard
          label="Total Target"
          value={fmt(totalTarget)}
          sub={<><span style={{ color: "#2F6F63", fontWeight: 600 }}>53.2% allocated</span> across 4 milestones</>}
          icon={Target}
          iconBg="#F3F4F6"
          iconColor="#6B7280"
        />
        <SummaryCard
          label="Goals Completed"
          value={`${completed} of ${goals.length}`}
          sub={<><span style={{ color: "#059669", fontWeight: 600 }}>✓ 25% overall</span> · 1 goal fully funded</>}
          icon={Trophy}
          iconBg="#D1FAE5"
          iconColor="#059669"
        />
      </div>

      {/* ── Goal cards grid ─────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {goals.map(g => <GoalCard key={g.id} goal={g} />)}
      </div>

      {/* ── Upcoming milestone banner ─────────────────────────────────────── */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "8px",
            backgroundColor: "#E6F4F1",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={18} color="#2F6F63" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".05em" }}>
                Upcoming Milestone
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                padding: "2px 8px", borderRadius: "999px",
                backgroundColor: "#D1FAE5", color: "#059669",
                fontSize: "11px", fontWeight: 600,
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#059669", display: "inline-block" }} />
                On Track
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
              <strong>Emergency Fund</strong> will reach{" "}
              <strong>80% milestone</strong> with your planned{" "}
              <strong>₹25,000</strong> deposit on November 1st.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{
            padding: "9px 16px", borderRadius: "8px",
            border: "none", backgroundColor: "transparent",
            fontSize: "13px", fontWeight: 500, color: "#2F6F63",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          }}>
            View savings projections <ArrowUpRight size={14} />
          </button>
          <button style={{
            padding: "9px 16px", borderRadius: "8px",
            border: "1px solid #D1D5DB", backgroundColor: "#fff",
            fontSize: "13px", fontWeight: 500, color: "#374151",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F9FAFB"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
          >
            <RefreshCw size={14} /> Manage automation
          </button>
        </div>
      </div>
    </div>
  );
};
