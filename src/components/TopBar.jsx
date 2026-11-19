import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { transactionsMock } from "../data/mockData";

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatAmount = (amount) => {
  const abs = Math.abs(amount).toLocaleString("en-IN");
  return amount >= 0 ? `+₹${abs}` : `-₹${abs}`;
};

export const TopBar = ({ userName = "Arjun Mehta", onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Filter transactions by query
  const query = searchQuery.trim().toLowerCase();
  const results = query.length >= 1
    ? transactionsMock.filter((t) =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.account.toLowerCase().includes(query) ||
        t.details.toLowerCase().includes(query)
      ).slice(0, 6)
    : [];

  const showDropdown = searchFocus && query.length >= 1;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
  };

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
        {/* Left: spacer to push search to center */}
        <div style={{ flex: 1 }} />

        {/* Center: Search */}
        <div style={{ flex: 1, maxWidth: '448px', position: 'relative' }}>
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
            <Search size={18} color={searchFocus ? '#2F6F63' : '#9CA3AF'} />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              placeholder="Search transactions, categories..."
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
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
            {searchQuery && (
              <button
                onClick={clearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#9CA3AF'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              boxShadow: '0 10px 25px -3px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.07)',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              zIndex: 50
            }}>
              {results.length === 0 ? (
                <div style={{
                  padding: '16px',
                  fontSize: '14px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center'
                }}>
                  No transactions found for "{searchQuery}"
                </div>
              ) : (
                <>
                  <div style={{
                    padding: '8px 12px 4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Transactions
                  </div>
                  {results.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        borderTop: '1px solid #F3F4F6'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Icon */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: t.amount >= 0 ? '#D1FAE5' : '#FEE2E2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginRight: '10px'
                      }}>
                        {t.amount >= 0
                          ? <ArrowUpRight size={16} color="#059669" />
                          : <ArrowDownRight size={16} color="#DC2626" />
                        }
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#111827',
                          fontFamily: 'Inter, sans-serif',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {t.description}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#9CA3AF',
                          fontFamily: 'Inter, sans-serif',
                          marginTop: '1px'
                        }}>
                          {t.category} · {t.date}
                        </div>
                      </div>
                      {/* Amount */}
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: t.amount >= 0 ? '#059669' : '#DC2626',
                        fontFamily: 'Inter, sans-serif',
                        marginLeft: '12px',
                        flexShrink: 0
                      }}>
                        {formatAmount(t.amount)}
                      </div>
                    </div>
                  ))}
                  {transactionsMock.filter((t) =>
                    t.description.toLowerCase().includes(query) ||
                    t.category.toLowerCase().includes(query) ||
                    t.account.toLowerCase().includes(query) ||
                    t.details.toLowerCase().includes(query)
                  ).length > 6 && (
                    <div style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#2F6F63',
                      fontFamily: 'Inter, sans-serif',
                      textAlign: 'center',
                      borderTop: '1px solid #F3F4F6',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0FDF9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      View all results →
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Icons and Profile */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '24px'
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
          <div style={{ position: 'relative' }} ref={profileRef}>
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
                {getInitials(userName)}
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
                onClick={onLogout}
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
