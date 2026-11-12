import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Target,
  FileUp,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const Sidebar = ({ activePage = "dashboard", onPageChange, isMobile, isOpen, setIsOpen, onLogout, userName = "User" }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "budgets", label: "Budgets", icon: TrendingUp },
    { id: "goals", label: "Goals", icon: Target },
    { id: "import-export", label: "Import/Export", icon: FileUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleMenuClick = (pageId) => {
    onPageChange(pageId);
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 40,
            padding: '8px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 20
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: isMobile ? 'fixed' : 'relative',
          left: 0,
          top: 0,
          zIndex: isMobile ? 30 : 'auto',
          height: isMobile ? '100vh' : 'auto',
          width: '256px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          transform: (isMobile && !isOpen) ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#2F6F63',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '18px' }}>FS</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '18px', color: '#111827', fontFamily: 'Inter, sans-serif' }}>
              FinSight
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div style={{
          padding: '16px 24px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontFamily: 'Inter, sans-serif'
        }}>
          Financial Management
        </div>

        {/* Menu Items */}
        <nav style={{
          flex: 1,
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                onClick={() => handleMenuClick(id)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '14px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: isActive ? '#2F6F63' : 'transparent',
                  color: isActive ? '#ffffff' : '#374151',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon
                  size={20}
                  color={isActive ? '#9BE7D3' : '#6B7280'}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          padding: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#9BE7D3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '16px',
              color: '#2F6F63',
              fontFamily: 'Inter, sans-serif'
            }}>
              AM
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600,
                fontSize: '14px',
                color: '#111827',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif'
              }}>
                {userName}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6B7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif'
              }}>
                Entrepreneur
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              color: '#374151',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px'
            }}
            title="Logout"
            onClick={onLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
