import React, { useState } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

export const TopBar = ({ userName = "Arjun Mehta" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <div style={{
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left: Search */}
        <div style={{ flex: 1, maxWidth: '448px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: searchFocus ? '2px solid #2F6F63' : '2px solid #E5E7EB',
              backgroundColor: searchFocus ? '#ffffff' : '#F9FAFB',
              transition: 'all 0.2s ease'
            }}
          >
            <Search
              size={18}
              color={searchFocus ? '#2F6F63' : '#9CA3AF'}
            />
            <input
              type="text"
              placeholder="Search transactions, reports..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              style={{
                backgroundColor: 'transparent',
                outline: 'none',
                border: 'none',
                flex: 1,
                fontSize: '14px',
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>
        </div>

        {/* Right: Icons and Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginLeft: '32px'
        }}>
          {/* Notification Bell */}
          <button
            style={{
              position: 'relative',
              padding: '8px',
              color: '#4B5563',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            title="Notifications"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              backgroundColor: '#EF4444',
              borderRadius: '50%'
            }} />
          </button>

          {/* Help Icon */}
          <button
            style={{
              padding: '8px',
              color: '#4B5563',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            title="Help"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <HelpCircle size={20} />
          </button>

          {/* User Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '4px 12px',
                backgroundColor: 'transparent',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#9BE7D3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                color: '#2F6F63',
                fontFamily: 'Inter, sans-serif'
              }}>
                AM
              </div>
              <ChevronDown
                size={16}
                color="#4B5563"
                style={{
                  transition: 'transform 0.2s ease',
                  transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: '8px',
                width: '192px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                border: '1px solid #E5E7EB',
                padding: '8px 0',
                zIndex: 40
              }}>
                <div style={{
                  padding: '8px 16px',
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#111827',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {userName}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    arjun.mehta@fintech.co
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  padding: '8px 16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#374151',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <SettingsIcon size={16} />
                  Settings
                </button>

                <button style={{
                  width: '100%',
                  padding: '8px 16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#DC2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
