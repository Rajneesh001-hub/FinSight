import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Briefcase,
  Building2,
  ShoppingBag,
  Server,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { formatIndianCurrency, formatDate } from "../utils/formatting";

const iconMap = {
  briefcase: Briefcase,
  building: Building2,
  "shopping-bag": ShoppingBag,
  server: Server,
  "trending-up": TrendingUp,
};

export const TransactionsTable = ({
  transactions,
  categories = [
    "All",
    "Income",
    "Food",
    "Rent",
    "Shopping",
    "Bills",
    "Transport",
    "Other",
  ],
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const categoryMatch =
      selectedCategory === "All" || txn.category === selectedCategory;
    const searchMatch =
      txn.description.toLowerCase().includes(searchText.toLowerCase()) ||
      txn.details.toLowerCase().includes(searchText.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getTransactionIcon = (txn) => {
    const Icon = iconMap[txn.icon] || Briefcase;
    return Icon;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Income: "bg-green-100 text-green-700",
      Food: "bg-orange-100 text-orange-700",
      Rent: "bg-blue-100 text-blue-700",
      Shopping: "bg-purple-100 text-purple-700",
      Bills: "bg-red-100 text-red-700",
      Transport: "bg-yellow-100 text-yellow-700",
      "Rent & Housing": "bg-blue-100 text-blue-700",
      "Food & Dining": "bg-orange-100 text-orange-700",
      "Bills & Utilities": "bg-red-100 text-red-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Recent transactions
            </h3>
            <p className="text-sm text-gray-500">
              Showing 8 of 64 entries for October 2026
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Download size={16} />
            CSV
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search box */}
          <div className="flex-1 min-w-72">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus-within:border-teal-700 focus-within:bg-white transition-colors">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search payee, notes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filter button */}
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="px-8 py-4 border-b border-gray-200 flex items-center gap-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? "bg-teal-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Account
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Amount
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => {
                const Icon = getTransactionIcon(txn);
                const isIncome = txn.amount > 0;

                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(txn.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                          <Icon size={16} className="text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm">
                            {txn.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {txn.details}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                          txn.category
                        )}`}
                      >
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{txn.account}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          isIncome ? "text-green-700" : "text-gray-900"
                        }`}
                      >
                        {isIncome ? "+" : ""}
                        {formatIndianCurrency(txn.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <CheckCircle size={18} className="text-green-500" />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-8 py-12 text-center">
                  <p className="text-gray-500 text-sm">
                    No transactions found matching your criteria.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
