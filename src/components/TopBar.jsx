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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Search */}
        <div className={`flex-1 max-w-md`}>
          <div
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors
              ${
                searchFocus
                  ? "border-teal-700 bg-white"
                  : "border-gray-200 bg-gray-50"
              }
            `}
          >
            <Search
              size={18}
              className={searchFocus ? "text-teal-700" : "text-gray-400"}
            />
            <input
              type="text"
              placeholder="Search transactions, reports..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right: Icons and Profile */}
        <div className="flex items-center gap-6 ml-8">
          {/* Notification Bell */}
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Help Icon */}
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Help"
          >
            <HelpCircle size={20} />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-1 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <img
                src="https://ui-avatars.com/api/?name=Arjun+Mehta&background=2F6F63&color=fff&size=32"
                alt={userName}
                className="w-8 h-8 rounded-lg"
              />
              <ChevronDown
                size={16}
                className={`text-gray-600 transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="font-semibold text-sm text-gray-900">
                    {userName}
                  </div>
                  <div className="text-xs text-gray-500">
                    arjun.mehta@fintech.co
                  </div>
                </div>

                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <SettingsIcon size={16} />
                  Settings
                </button>

                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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
