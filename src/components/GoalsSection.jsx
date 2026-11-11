import React from "react";
import { Plus, Shield, Laptop, Plane } from "lucide-react";
import { formatIndianCurrency } from "../utils/formatting";

const iconMap = {
  shield: Shield,
  laptop: Laptop,
  plane: Plane,
};

export const GoalCard = ({ goal }) => {
  const Icon = iconMap[goal.icon] || Shield;
  const remaining = goal.target - goal.saved;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '12px',
        gap: '8px',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '4px',
            margin: 0,
          }}>{goal.name}</h4>
          <p style={{
            fontSize: '11px',
            color: '#9ca3af',
            margin: 0,
          }}>
            Target: {formatIndianCurrency(goal.target)}
          </p>
        </div>
        <div style={{
          backgroundColor: '#f0fdf9',
          padding: '8px',
          borderRadius: '8px',
          flexShrink: 0,
          marginLeft: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={16} color="#2F6F63" />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          width: '100%',
          backgroundColor: '#e5e7eb',
          borderRadius: '9999px',
          height: '6px',
          marginBottom: '6px',
          overflow: 'hidden',
        }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#2F6F63',
              borderRadius: '9999px',
              width: `${Math.min(goal.percentage, 100)}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
        }}>
          <span style={{ color: '#6b7280' }}>
            {formatIndianCurrency(goal.saved)} saved
          </span>
          <span style={{ fontWeight: '600', color: '#2F6F63' }}>
            {goal.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Amount remaining and due date */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        paddingTop: '10px',
        borderTop: '1px solid #e5e7eb',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
        }}>
          <span style={{ color: '#6b7280' }}>Remaining</span>
          <span style={{ fontWeight: '600', color: '#1f2937' }}>
            {formatIndianCurrency(remaining)}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
        }}>
          <span style={{ color: '#6b7280' }}>Due</span>
          <span style={{ fontWeight: '600', color: '#1f2937' }}>{goal.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export const GoalsSection = ({ goals }) => {
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
            Financial goals
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '4px',
            margin: 0,
          }}>
            Capital accumulation and milestones
          </p>
        </div>
        <button style={{
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '6px',
          paddingBottom: '6px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '500',
          color: '#6b7280',
          backgroundColor: '#FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
        >
          <Plus size={14} />
          New Goal
        </button>
      </div>

      {/* Goals Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};
