// Utility functions for formatting

/**
 * Format amount to Indian Rupee format with proper comma placement
 * Examples: ₹8,42,850 or ₹1,25,000
 */
export const formatIndianCurrency = (amount) => {
  if (typeof amount !== "number") return "₹0";

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Convert to string and split into parts
  const parts = Math.floor(absAmount).toString().split("");
  const fractional = (absAmount % 1).toFixed(2).slice(1);

  // Apply Indian number system formatting
  let formatted = "";
  let count = 0;

  for (let i = parts.length - 1; i >= 0; i--) {
    if (count === 2 || (count > 2 && (count - 2) % 2 === 0)) {
      formatted = "," + formatted;
    }
    formatted = parts[i] + formatted;
    count++;
  }

  const result = isNegative ? `-₹${formatted}` : `₹${formatted}`;
  return fractional !== ".00" ? result + fractional : result;
};

/**
 * Format percentage change display with color and symbol
 * Examples: "+12.5%" or "-2.1%"
 */
export const formatPercentage = (value, decimals = 1) => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format date in Indian format
 * Examples: "Oct 24, 2026" or "24 Oct 2026"
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-IN", options);
};

/**
 * Get progress bar color based on percentage filled
 */
export const getBudgetStatusColor = (spent, limit) => {
  const percentage = (spent / limit) * 100;
  if (percentage > 100) return "red"; // Over budget
  if (percentage >= 90) return "amber"; // Near limit
  return "green"; // Under budget
};

/**
 * Get status badge color and text
 */
export const getStatusColor = (status) => {
  const statusMap = {
    completed: "green",
    pending: "amber",
    failed: "red",
    ok: "green",
    warning: "amber",
    danger: "red",
  };
  return statusMap[status] || "gray";
};
