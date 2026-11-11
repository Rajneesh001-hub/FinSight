import React, { useState } from "react";
import {
  Upload,
  Download,
  Plus,
  Search,
  Calendar,
  ChevronDown,
  X,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Briefcase,
  Building2,
  ShoppingBag,
  Server,
  TrendingUp,
  ShoppingCart,
  Home,
  Cloud,
  Zap,
  Utensils,
  Coffee,
  Car,
} from "lucide-react";
import { formatIndianCurrency } from "../utils/formatting";
import { transactionsMock } from "../data/mockData";

const iconMap = {
  briefcase: Briefcase,
  building: Building2,
  shopping: ShoppingCart,
  server: Server,
  "trending-up": TrendingUp,
  home: Home,
  cloud: Cloud,
  zap: Zap,
  utensils: Utensils,
  coffee: Coffee,
  car: Car,
};

export const Transactions = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState("Oct 1, 2026 - Oct 31, 2026");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [accountFilter, setAccountFilter] = useState("All Accounts (HDFC, ICICI, Amex)");
  const [typeFilter, setTypeFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Get all transactions
  const allTransactions = transactionsMock;

  // Filter transactions
  const filteredTransactions = allTransactions.filter((txn) => {
    const searchMatch =
      searchText === "" ||
      txn.description.toLowerCase().includes(searchText.toLowerCase()) ||
      txn.details.toLowerCase().includes(searchText.toLowerCase());
    
    const typeMatch =
      typeFilter === "All" ||
      (typeFilter === "Income" && txn.amount > 0) ||
      (typeFilter === "Expense" && txn.amount < 0);

    return searchMatch && typeMatch;
  });

  // Calculate summary stats
  const totalIncome = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(
    filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );
  
  const netPosition = totalIncome - totalExpenses;
  const incomeCount = filteredTransactions.filter((t) => t.amount > 0).length;
  const expenseCount = filteredTransactions.filter((t) => t.amount < 0).length;

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIdx, endIdx);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedTransactions.map((t) => t.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const getTransactionIcon = (txn) => {
    const Icon = iconMap[txn.icon] || Briefcase;
    return Icon;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Income: { bg: "#D1FAE5", text: "#059669" },
      "Food & Dining": { bg: "#FED7AA", text: "#C2410C" },
      "Office & Rent": { bg: "#DBEAFE", text: "#1D4ED8" },
      "Rent & Housing": { bg: "#DBEAFE", text: "#1D4ED8" },
      Shopping: { bg: "#E9D5FF", text: "#7C3AED" },
      "Bills & Utilities": { bg: "#FEE2E2", text: "#DC2626" },
      Transport: { bg: "#FEF3C7", text: "#D97706" },
      "Software & Tech": { bg: "#DBEAFE", text: "#2563EB" },
    };
    return colors[category] || { bg: "#F3F4F6", text: "#374151" };
  };

  const clearFilters = () => {
    setSearchText("");
    setTypeFilter("All");
    setCategoryFilter("All Categories");
    setAccountFilter("All Accounts (HDFC, ICICI, Amex)");
  };

  const combinedTotal = selectedRows.reduce((sum, id) => {
    const txn = paginatedTransactions.find((t) => t.id === id);
    return sum + (txn ? txn.amount : 0);
  }, 0);

  return (
    <div style={{
      padding: "32px",
      backgroundColor: "#F6F7F9",
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Breadcrumb */}
      <div style={{
        fontSize: "13px",
        color: "#6B7280",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span>PORTFOLIO</span>
        <span>›</span>
        <span style={{ color: "#111827", fontWeight: 500 }}>TRANSACTIONS</span>
      </div>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div>
          <h1 style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "4px",
          }}>
            Transactions
          </h1>
          <p style={{
            fontSize: "14px",
            color: "#6B7280",
          }}>
            All your income and expenses in one verified ledger
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
            padding: "10px 20px",
            backgroundColor: "#ffffff",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#374151",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
          >
            <Upload size={16} />
            Import
          </button>

          <button style={{
            padding: "10px 20px",
            backgroundColor: "#ffffff",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#374151",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
          >
            <Download size={16} />
            Export
          </button>

          <button style={{
            padding: "10px 20px",
            backgroundColor: "#2F6F63",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#275750"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2F6F63"}
          >
            <Plus size={16} />
            Add transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}>
        {/* Total Income */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #E5E7EB",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Total Income
            </span>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#D1FAE5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <ArrowDownRight size={18} color="#059669" />
            </div>
          </div>
          <div style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "8px",
          }}>
            {formatIndianCurrency(totalIncome)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              fontSize: "13px",
              color: "#059669",
              fontWeight: 500,
            }}>
              +42.5% vs target
            </span>
            <span style={{
              fontSize: "13px",
              color: "#6B7280",
            }}>
              {incomeCount} transactions
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #E5E7EB",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Total Expenses
            </span>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <ArrowUpRight size={18} color="#DC2626" />
            </div>
          </div>
          <div style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "8px",
          }}>
            {formatIndianCurrency(totalExpenses)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              fontSize: "13px",
              color: "#DC2626",
              fontWeight: 500,
            }}>
              +44.7% of income
            </span>
            <span style={{
              fontSize: "13px",
              color: "#6B7280",
            }}>
              {expenseCount} transactions
            </span>
          </div>
        </div>

        {/* Net Position */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #E5E7EB",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Net Position
            </span>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#D1FAE5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <RefreshCw size={18} color="#059669" />
            </div>
          </div>
          <div style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "8px",
          }}>
            +{formatIndianCurrency(netPosition)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: "#D1FAE5",
              fontSize: "12px",
              color: "#059669",
              fontWeight: 600,
            }}>
              Net Positive Surplus
            </span>
            <span style={{
              fontSize: "13px",
              color: "#6B7280",
            }}>
              55.3% retained
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        border: "1px solid #E5E7EB",
      }}>
        {/* Search and Type Toggle */}
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          {/* Search */}
          <div style={{
            flex: "1 1 300px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
          }}>
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search by description, payee, notes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                color: "#111827",
              }}
            />
          </div>

          {/* Type Toggle */}
          <div style={{
            display: "flex",
            gap: "4px",
            marginLeft: "auto",
          }}>
            {["All", "Income", "Expense"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: typeFilter === type ? "#2F6F63" : "#6B7280",
                  backgroundColor: typeFilter === type ? "#E6F4F1" : "transparent",
                  border: typeFilter === type ? "1px solid #2F6F63" : "1px solid #E5E7EB",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {type} {type === "All" ? `(${filteredTransactions.length})` : type === "Income" ? `(${incomeCount})` : `(${expenseCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Date, Category, Account Filters */}
        <div style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          {/* Date Range */}
          <button style={{
            padding: "8px 14px",
            fontSize: "14px",
            color: "#374151",
            backgroundColor: "#ffffff",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Calendar size={16} />
            {dateRange}
            <ChevronDown size={14} />
          </button>

          {/* Category Filter */}
          <button style={{
            padding: "8px 14px",
            fontSize: "14px",
            color: "#374151",
            backgroundColor: "#ffffff",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            {categoryFilter}
            <ChevronDown size={14} />
          </button>

          {/* Account Filter */}
          <button style={{
            padding: "8px 14px",
            fontSize: "14px",
            color: "#374151",
            backgroundColor: "#ffffff",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Building2 size={16} />
            {accountFilter}
            <ChevronDown size={14} />
          </button>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            style={{
              padding: "8px 14px",
              fontSize: "14px",
              color: "#DC2626",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginLeft: "auto",
            }}
          >
            <X size={16} />
            Clear filters
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedRows.length > 0 && (
        <div style={{
          backgroundColor: "#2F6F63",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#ffffff",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>
              {selectedRows.length} Transactions selected
            </span>
            <span style={{ fontSize: "14px", color: "#9BE7D3" }}>
              Combined: {formatIndianCurrency(combinedTotal)}
            </span>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#2F6F63",
              backgroundColor: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <RefreshCw size={16} />
              Change category
            </button>
            <button style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#2F6F63",
              backgroundColor: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <Download size={16} />
              Export selected
            </button>
            <button style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#ffffff",
              backgroundColor: "#DC2626",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <Trash2 size={16} />
              Delete ({selectedRows.length})
            </button>
            <button
              onClick={() => setSelectedRows([])}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                color: "#ffffff",
                backgroundColor: "transparent",
                border: "1px solid #9BE7D3",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Deselect all
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
          }}>
            <thead style={{
              backgroundColor: "#F9FAFB",
              borderBottom: "1px solid #E5E7EB",
            }}>
              <tr>
                <th style={{
                  padding: "12px 24px",
                  textAlign: "left",
                  width: "40px",
                }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                    onChange={handleSelectAll}
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                      accentColor: "#2F6F63",
                    }}
                  />
                </th>
                <th style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  Date
                </th>
                <th style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  Description
                </th>
                <th style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  Category
                </th>
                <th style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  Account
                </th>
                <th style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  Amount (INR)
                </th>
                <th style={{
                  padding: "12px 24px",
                  textAlign: "center",
                  width: "60px",
                }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((txn, idx) => {
                const Icon = getTransactionIcon(txn);
                const isIncome = txn.amount > 0;
                const categoryColors = getCategoryColor(txn.category);
                const isSelected = selectedRows.includes(txn.id);

                return (
                  <tr
                    key={txn.id}
                    style={{
                      borderBottom: idx < paginatedTransactions.length - 1 ? "1px solid #F3F4F6" : "none",
                      backgroundColor: isSelected ? "#F0FDF4" : "transparent",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#F9FAFB";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td style={{ padding: "16px 24px" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(txn.id)}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          accentColor: "#2F6F63",
                        }}
                      />
                    </td>
                    <td style={{
                      padding: "16px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#111827",
                    }}>
                      {txn.date}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}>
                        <div style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          backgroundColor: categoryColors.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <Icon size={18} color={categoryColors.text} />
                        </div>
                        <div>
                          <p style={{
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#111827",
                            marginBottom: "2px",
                          }}>
                            {txn.description}
                          </p>
                          <p style={{
                            fontSize: "13px",
                            color: "#6B7280",
                          }}>
                            {txn.details}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "9999px",
                        fontSize: "13px",
                        fontWeight: 600,
                        backgroundColor: categoryColors.bg,
                        color: categoryColors.text,
                      }}>
                        {txn.category}
                      </span>
                    </td>
                    <td style={{
                      padding: "16px",
                      fontSize: "14px",
                      color: "#374151",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Building2 size={14} color="#9CA3AF" />
                        {txn.account}
                      </div>
                    </td>
                    <td style={{
                      padding: "16px",
                      fontSize: "15px",
                      fontWeight: 700,
                      textAlign: "right",
                      color: isIncome ? "#059669" : "#DC2626",
                    }}>
                      {isIncome ? "+" : "-"}
                      {formatIndianCurrency(Math.abs(txn.amount))}
                    </td>
                    <td style={{
                      padding: "16px 24px",
                      textAlign: "center",
                      position: "relative",
                    }}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === txn.id ? null : txn.id)}
                        style={{
                          padding: "6px",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "6px",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <MoreVertical size={18} color="#6B7280" />
                      </button>

                      {openMenuId === txn.id && (
                        <div style={{
                          position: "absolute",
                          right: "48px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "#ffffff",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          zIndex: 10,
                          minWidth: "140px",
                        }}>
                          <button style={{
                            width: "100%",
                            padding: "10px 16px",
                            fontSize: "14px",
                            color: "#374151",
                            backgroundColor: "transparent",
                            border: "none",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button style={{
                            width: "100%",
                            padding: "10px 16px",
                            fontSize: "14px",
                            color: "#DC2626",
                            backgroundColor: "transparent",
                            border: "none",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FEF2F2"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: "#6B7280" }}>
              Showing <strong>{startIdx + 1}</strong> to <strong>{Math.min(endIdx, filteredTransactions.length)}</strong> of <strong>{filteredTransactions.length}</strong> entries
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", color: "#6B7280" }}>Show:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: "6px 10px",
                  fontSize: "14px",
                  color: "#374151",
                  backgroundColor: "#ffffff",
                  border: "1px solid #D1D5DB",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                <option value="10">10 rows</option>
                <option value="25">25 rows</option>
                <option value="50">50 rows</option>
                <option value="100">100 rows</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                color: currentPage === 1 ? "#9CA3AF" : "#374151",
                backgroundColor: "transparent",
                border: "none",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: currentPage === pageNum ? "#ffffff" : "#374151",
                    backgroundColor: currentPage === pageNum ? "#2F6F63" : "transparent",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    minWidth: "40px",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span style={{ padding: "8px 4px", color: "#9CA3AF" }}>...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    color: "#374151",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                color: currentPage === totalPages ? "#9CA3AF" : "#374151",
                backgroundColor: "transparent",
                border: "none",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
