import React from "react";
import { Plus, Shield, Laptop, Plane } from "lucide-react";
import { formatIndianCurrency, formatPercentage } from "../utils/formatting";

const iconMap = {
  shield: Shield,
  laptop: Laptop,
  plane: Plane,
};

export const GoalCard = ({ goal }) => {
  const Icon = iconMap[goal.icon] || Shield;
  const remaining = goal.target - goal.saved;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{goal.name}</h4>
          <p className="text-xs text-gray-500">
            Target: {formatIndianCurrency(goal.target)}
          </p>
        </div>
        <div className="bg-teal-50 p-2 rounded-lg flex-shrink-0">
          <Icon size={20} className="text-teal-700" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
          <div
            className="h-full bg-teal-700 rounded-full transition-all"
            style={{ width: `${Math.min(goal.percentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">
            {formatIndianCurrency(goal.saved)} saved
          </span>
          <span className="font-semibold text-teal-700">
            {goal.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Amount remaining and due date */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Remaining</span>
          <span className="font-semibold text-gray-900">
            {formatIndianCurrency(remaining)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Due</span>
          <span className="font-semibold text-gray-900">{goal.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Financial Goals Section
 * Shows goal progress cards and add new goal button
 */
export const GoalsSection = ({ goals }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Financial goals
          </h3>
          <p className="text-sm text-gray-500">
            Capital accumulation and milestones
          </p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
          <Plus size={16} />
          New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};
