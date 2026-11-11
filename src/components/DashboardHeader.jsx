import React from "react";
import { ChevronRight, Download, Plus } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Portfolio</span>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-medium">Dashboard</span>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, Arjun. Here's your financial position.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Month Filter */}
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white cursor-pointer">
              <option value="this-month">This month</option>
              <option value="last-month">Last month</option>
              <option value="last-3-months">Last 3 months</option>
              <option value="last-6-months">Last 6 months</option>
              <option value="this-year">This year</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Export Button */}
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white flex items-center gap-2 transition-colors">
              <Download size={16} />
              Export
            </button>

            {/* Add Transaction Button */}
            <button className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm font-medium hover:bg-teal-800 flex items-center gap-2 transition-colors">
              <Plus size={16} />
              Add transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
