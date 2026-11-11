import React from "react";
import { formatIndianCurrency } from "../utils/formatting";

/**
 * Donut Chart for Spending by Category
 * Shows spending breakdown with legend and amounts
 */
export const DonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // SVG Donut Chart with proper SVG implementation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const segments = data.map((item, index) => {
    const percentage = item.amount / total;
    const segmentLength = circumference * percentage;
    const offset = currentOffset;
    currentOffset += segmentLength;

    return {
      ...item,
      offset,
      length: segmentLength,
      percentage,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Spending by category
        </h3>
        <p className="text-sm text-gray-500">
          October 2026 • Total outflow {formatIndianCurrency(total)}
        </p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="relative w-64 h-64">
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full transform -rotate-90"
          >
            {segments.map((segment, index) => (
              <circle
                key={index}
                cx="150"
                cy="150"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="40"
                strokeDasharray={`${segment.length} ${circumference}`}
                strokeDashoffset={-segment.offset}
                className="transition-all"
              />
            ))}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">TOTAL</p>
              <p className="text-2xl font-bold text-teal-700">
                {formatIndianCurrency(total)}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {data.length} Categories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend with amounts */}
      <div className="grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 font-medium">{item.name}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500">
                  {formatIndianCurrency(item.amount)}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View budget audit link */}
      <button className="mt-6 w-full text-center text-sm font-medium text-teal-700 hover:text-teal-800 py-2 rounded-lg hover:bg-teal-50 transition-colors">
        View budget audit trail →
      </button>
    </div>
  );
};

/**
 * Bar Chart for Income vs Expenses
 * Shows 6-month comparison with grouped bars
 */
export const BarChart = ({ data, title, subtitle }) => {
  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expenses]));
  const yAxisMax = Math.ceil(maxValue / 50000) * 50000;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Y-axis labels and chart */}
      <div className="flex gap-4">
        {/* Y-axis */}
        <div className="flex flex-col justify-between items-end pr-4 border-r border-gray-200 w-16">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
            <div key={ratio} className="text-xs text-gray-500 h-8 flex items-center">
              {ratio === 1
                ? formatIndianCurrency(yAxisMax)
                : ratio === 0
                ? "₹0"
                : ""}
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="flex-1">
          <div className="flex items-end justify-between gap-6 h-64 mb-4">
            {data.map((month, idx) => {
              const incomeHeight = (month.income / yAxisMax) * 100;
              const expensesHeight = (month.expenses / yAxisMax) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  {/* Bars */}
                  <div className="flex items-end justify-center gap-2 w-full h-56">
                    {/* Income bar */}
                    <div
                      className="flex-1 bg-teal-700 rounded-t-lg hover:bg-teal-800 transition-colors cursor-pointer group"
                      style={{ height: `${incomeHeight}%` }}
                      title={`Income: ${formatIndianCurrency(month.income)}`}
                    >
                      <div className="hidden group-hover:block absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {formatIndianCurrency(month.income)}
                      </div>
                    </div>

                    {/* Expenses bar */}
                    <div
                      className="flex-1 bg-teal-200 rounded-t-lg hover:bg-teal-300 transition-colors cursor-pointer group"
                      style={{ height: `${expensesHeight}%` }}
                      title={`Expenses: ${formatIndianCurrency(month.expenses)}`}
                    >
                      <div className="hidden group-hover:block absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {formatIndianCurrency(month.expenses)}
                      </div>
                    </div>
                  </div>

                  {/* Month label */}
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {month.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-700 rounded" />
              <span className="text-sm text-gray-600">Inflow (₹)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-200 rounded" />
              <span className="text-sm text-gray-600">Outflow (₹)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
