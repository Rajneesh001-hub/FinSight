import React from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { formatIndianCurrency, formatPercentage } from "../utils/formatting";

const iconMap = {
  wallet: Wallet,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "piggy-bank": PiggyBank,
};

export const SummaryCard = ({
  label,
  amount,
  change,
  icon = "wallet",
  color = "teal",
}) => {
  const Icon = iconMap[icon] || Wallet;
  const isPositive = change >= 0;

  const colorClasses = {
    teal: {
      bg: "bg-teal-50",
      icon: "text-teal-700",
      text: "text-teal-700",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-700",
      text: "text-green-700",
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-700",
      text: "text-red-700",
    },
  };

  const colors = colorClasses[color] || colorClasses.teal;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header with icon and label */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
        </div>
        <div className={`${colors.bg} p-2 rounded-lg`}>
          <Icon size={20} className={colors.icon} />
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <h3 className="text-3xl font-bold text-gray-900">
          {formatIndianCurrency(amount)}
        </h3>
      </div>

      {/* Change percentage */}
      <div
        className={`flex items-center gap-2 ${
          isPositive ? "text-green-700" : "text-red-700"
        }`}
      >
        {isPositive ? (
          <ArrowUp size={16} className="flex-shrink-0" />
        ) : (
          <ArrowDown size={16} className="flex-shrink-0" />
        )}
        <span className="text-sm font-semibold">
          {formatPercentage(change)} vs last month
        </span>
      </div>
    </div>
  );
};
