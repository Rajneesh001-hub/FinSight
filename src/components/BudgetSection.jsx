import React from "react";
import { AlertCircle, ChevronRight } from "lucide-react";
import { formatIndianCurrency } from "../utils/formatting";

export const BudgetSection = ({ budgets }) => {
  const getProgressColor = (status) => {
    const colors = {
      ok: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    };
    return colors[status] || '#d1d5db';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      ok: { bg: '#dcfce7', text: '#16a34a' },
      warning: { bg: '#fef3c7', text: '#d97706' },
      danger: { bg: '#fee2e2', text: '#dc2626' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const getStatusLabel = (status) => {
    const labels = {
      ok: "On track",
      warning: "Near limit",
      danger: "Over limit",
    };
    return labels[status] || "Normal";
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0,
          }}>
            Monthly budgets
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '4px',
            margin: 0,
          }}>
            Categorize expenditure caps and utilization
          </p>
        </div>
        <button style={{
          color: '#2F6F63',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
        }}>
          Manage budgets
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Budget Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
          const isOverBudget = budget.spent > budget.limit;
          const colors = getStatusBadgeColor(budget.status);

          return (
            <div key={budget.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Name and Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1f2937',
                  margin: 0,
                }}>
                  {budget.name}
                </h4>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  borderRadius: '9999px',
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}>
                  {getStatusLabel(budget.status)}
                </span>
              </div>

              {/* Amount info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#6b7280',
              }}>
                <span>{formatIndianCurrency(budget.spent)} / {formatIndianCurrency(budget.limit)}</span>
                <span style={{
                  fontWeight: '600',
                  color: isOverBudget ? '#dc2626' : '#16a34a',
                }}>
                  {isOverBudget
                    ? `+${formatIndianCurrency(budget.spent - budget.limit)} over`
                    : formatIndianCurrency(remaining) + " left"}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                backgroundColor: '#e5e7eb',
                borderRadius: '9999px',
                height: '6px',
                overflow: 'hidden',
              }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '9999px',
                    backgroundColor: getProgressColor(budget.status),
                    width: `${Math.min(percentage, 100)}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Info banner */}
      <div style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingBottom: '12px',
        backgroundColor: '#fffbeb',
        borderRadius: '8px',
      }}>
        <AlertCircle size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
        <p style={{
          fontSize: '12px',
          color: '#92400e',
          margin: 0,
          lineHeight: '1.5',
        }}>
          <span style={{ fontWeight: '600' }}>Get positive liquidity alerts</span> sustained across all 4 reporting periods.
          <br />
          <span style={{ fontWeight: '600', color: '#d97706' }}>Avg. Retention: ₹1,27,430/mo</span>
        </p>
      </div>
    </div>
  );
};
