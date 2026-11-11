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

export const Sidebar = ({ activePage = "dashboard", onPageChange, isMobile, isOpen, setIsOpen }) => {
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
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-sm"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? "fixed left-0 top-0 z-30 h-screen w-64" : "w-64"}
          bg-white border-r border-gray-200 flex flex-col transition-transform
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FS</span>
            </div>
            <span className="font-semibold text-lg text-gray-900">FinSight</span>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Financial Management
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                onClick={() => handleMenuClick(id)}
                className={`
                  w-full px-4 py-3 rounded-lg font-medium text-left flex items-center gap-3
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-teal-700 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-mint-200" : "text-gray-600"}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="border-t border-gray-200 p-4 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="https://ui-avatars.com/api/?name=Arjun+Mehta&background=2F6F63&color=fff&size=40"
              alt="Arjun Mehta"
              className="w-10 h-10 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900 truncate">
                Arjun Mehta
              </div>
              <div className="text-xs text-gray-500 truncate">
                Entrepreneur
              </div>
            </div>
          </div>

          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
