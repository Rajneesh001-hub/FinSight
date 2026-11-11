import React from "react";
import { ChevronRight, Download, Plus } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '16px',
        paddingBottom: '16px',
      }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '12px',
        }}>
          <span>PORTFOLIO</span>
          <ChevronRight size={14} />
          <span style={{ color: '#4b5563', fontWeight: '500' }}>DASHBOARD</span>
        </div>

        {/* Title and Subtitle */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '4px',
            margin: 0,
          }}>Dashboard</h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
          }}>
            Welcome back, Arjun. Here's your consolidated financial position for Mumbai
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div>
            {/* Month Filter */}
            <select style={{
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#6b7280',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>
              <option value="this-month">This month (Oct 2026)</option>
              <option value="last-month">Last month</option>
              <option value="last-3-months">Last 3 months</option>
              <option value="last-6-months">Last 6 months</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {/* Export Button */}
            <button style={{
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#6b7280',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
            >
              <Download size={14} />
              Export
            </button>

            {/* Add Transaction Button - PRIMARY */}
            <button style={{
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              backgroundColor: '#2F6F63',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1f5952'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2F6F63'}
            >
              <Plus size={14} />
              Add transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
