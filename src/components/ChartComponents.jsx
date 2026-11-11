import React from "react";
import { formatIndianCurrency } from "../utils/formatting";

/**
 * Donut Chart - EXACTLY matching UI image
 * Chart centered on top, legend below in 2 columns
 */
export const DonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '4px',
          margin: 0,
        }}>
          Spending by category
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#9ca3af',
          margin: 0,
        }}>
          October 2026 • Total outflow ₹1,18,420
        </p>
      </div>

      {/* Donut Chart - Centered */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px',
      }}>
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            {(() => {
              const radius = 70;
              const centerX = 100;
              const centerY = 100;
              const circumference = 2 * Math.PI * radius;
              let currentOffset = 0;

              return data.map((item, index) => {
                const percentage = item.amount / total;
                const segmentLength = circumference * percentage;
                const offset = currentOffset;
                currentOffset += segmentLength;

                return (
                  <circle
                    key={index}
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="35"
                    strokeDasharray={`${segmentLength} ${circumference}`}
                    strokeDashoffset={-offset}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                  />
                );
              });
            })()}
            {/* White center circle */}
            <circle cx="100" cy="100" r="50" fill="#FFFFFF" />
          </svg>
          
          {/* Center text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '11px',
              color: '#9ca3af',
              fontWeight: '500',
              marginBottom: '2px',
            }}>
              TOTAL
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#2F6F63',
              marginBottom: '2px',
            }}>
              ₹1.18L
            </div>
            <div style={{
              fontSize: '10px',
              color: '#9ca3af',
            }}>
              6 Categories
            </div>
          </div>
        </div>
      </div>

      {/* Legend - 2 columns below chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px',
      }}>
        {data.map((item, index) => {
          const percentage = (item.amount / total) * 100;
          
          return (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginBottom: '2px',
                }}>
                  {item.name}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#6b7280',
                }}>
                  <span>{formatIndianCurrency(item.amount)}</span>
                  <span style={{ fontWeight: '600', marginLeft: '8px' }}>{percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View budget audit link */}
      <div style={{ textAlign: 'center', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
        <button style={{
          color: '#2F6F63',
          fontSize: '13px',
          fontWeight: '500',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
        }}>
          View budget audit trail →
        </button>
      </div>
    </div>
  );
};

/**
 * Bar Chart - EXACTLY matching UI image
 * Thinner bars, proper spacing, dark teal and light teal colors
 */
export const BarChart = ({ data, title, subtitle }) => {
  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expenses]));
  const yAxisMax = Math.ceil(maxValue / 50000) * 50000;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}>
        <div>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '4px',
            margin: 0,
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#9ca3af',
            margin: 0,
          }}>
            {subtitle}
          </p>
        </div>
        {/* Legend on top right */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#2F6F63', borderRadius: '2px' }} />
            <span style={{ color: '#6b7280' }}>Inflow (₹)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#9BE7D3', borderRadius: '2px' }} />
            <span style={{ color: '#6b7280' }}>Outflow (₹)</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ display: 'flex', gap: '12px', height: '220px' }}>
        {/* Y-Axis */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '4px',
          paddingBottom: '20px',
          minWidth: '65px',
          textAlign: 'right',
          paddingRight: '8px',
        }}>
          {[1, 0.75, 0.5, 0.25, 0].map((ratio, idx) => {
            const value = yAxisMax * ratio;
            return (
              <span key={idx} style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1' }}>
                {value === 0 ? '₹0' : `₹${(value / 100000).toFixed(2)}L`}
              </span>
            );
          })}
        </div>

        {/* Bars Container */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          gap: '4px',
          paddingBottom: '20px',
          position: 'relative',
        }}>
          {data.map((month, idx) => {
            const incomeHeight = (month.income / yAxisMax) * 100;
            const expensesHeight = (month.expenses / yAxisMax) * 100;

            return (
              <div key={idx} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                {/* Bars */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '3px',
                  height: '180px',
                  width: '100%',
                  justifyContent: 'center',
                }}>
                  {/* Income bar */}
                  <div style={{
                    width: '12px',
                    height: `${incomeHeight}%`,
                    backgroundColor: '#2F6F63',
                    borderRadius: '3px 3px 0 0',
                  }} />
                  {/* Expenses bar */}
                  <div style={{
                    width: '12px',
                    height: `${expensesHeight}%`,
                    backgroundColor: '#9BE7D3',
                    borderRadius: '3px 3px 0 0',
                  }} />
                </div>
                {/* Month label */}
                <span style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  marginTop: '8px',
                  fontWeight: '500',
                }}>
                  {month.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info banner at bottom */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
        }} />
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: 0,
        }}>
          <span style={{ fontWeight: '600' }}>Net positive liquidity delta sustained</span> across all 4 reporting periods. <span style={{ fontWeight: '600', color: '#2F6F63' }}>Avg. Retention: ₹1,27,430/mo</span>
        </p>
      </div>
    </div>
  );
};
