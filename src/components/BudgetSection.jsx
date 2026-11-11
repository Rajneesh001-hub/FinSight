import React from "react";
import {
  AlertCircle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { formatIndianCurrency } from "../utils/formatting";

/**
 * Monthly Budgets with progress bars
 * Shows budget status with color indicators (green, amber, red)
 */
export const BudgetSection = ({ budgets }) => {
  const getProgressColor = (status) => {
    const colors = {
      ok: "bg-green-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
    };
    return colors[status] || "bg-gray-300";
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      ok: "text-green-700 bg-green-50",
      warning: "text-amber-700 bg-amber-50",
      danger: "text-red-700 bg-red-50",
    };
    return colors[status] || "text-gray-700 bg-gray-50";
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
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Monthly budgets
          </h3>
          <p className="text-sm text-gray-500">
            Categorize expenditure caps and utilization
          </p>
        </div>
        <button className="text-teal-700 hover:text-teal-800 font-medium text-sm flex items-center gap-1">
          Manage budgets
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Budget Items */}
      <div className="space-y-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
          const isOverBudget = budget.spent > budget.limit;

          return (
            <div key={budget.id} className="space-y-2">
              {/* Header with name and amount */}
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  {budget.name}
                </h4>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(
                    budget.status
                  )}`}
                >
                  {getStatusLabel(budget.status)}
                </span>
              </div>

              {/* Amount and percentage */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {formatIndianCurrency(budget.spent)} / {formatIndianCurrency(budget.limit)}
                </span>
                <span className={`font-semibold ${
                  isOverBudget ? "text-red-700" : "text-green-700"
                }`}>
                  {isOverBudget
                    ? `+${formatIndianCurrency(budget.spent - budget.limit)} over`
                    : formatIndianCurrency(remaining) + " left"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor(
                    budget.status
                  )}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
                {/* Overflow indicator */}
                {isOverBudget && (
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${Math.min((percentage - 100) / 2, 30)}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
        <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          <span className="font-semibold">Get positive liquidity alerts</span> sustained across all  
          4 reporting periods.
          <span className="font-semibold text-amber-700 ml-1">Avg. Retention: ₹1,27,430/mo</span>
        </p>
      </div>
    </div>
  );
};
