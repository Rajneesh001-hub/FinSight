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
  ShoppingCart,
  Home,
  Cloud,
} from "lucide-react";
import { formatIndianCurrency, formatDate } from "../utils/formatting";

const iconMap = {
  briefcase: Briefcase,
  building: Building2,
  "shopping-bag": ShoppingBag,
  server: Server,
  "trending-up": TrendingUp,
  shopping: ShoppingCart,
  home: Home,
  cloud: Cloud,
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
      Income: { bg: '#D1FAE5', text: '#059669' },
      Food: { bg: '#FED7AA', text: '#C2410C' },
      Rent: { bg: '#DBEAFE', text: '#1D4ED8' },
      Shopping: { bg: '#E9D5FF', text: '#7C3AED' },
      Bills: { bg: '#FEE2E2', text: '#DC2626' },
      Transport: { bg: '#FEF3C7', text: '#D97706' },
      "Rent & Housing": { bg: '#DBEAFE', text: '#1D4ED8' },
      "Food & Dining": { bg: '#FED7AA', text: '#C2410C' },
      "Bills & Utilities": { bg: '#FEE2E2', text: '#DC2626' },
    };
    return colors[category] || { bg: '#F3F4F6', text: '#374151' };
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #F3F4F6'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '4px'
            }}>
              Recent transactions
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              (Showing 6 of 84 entries for October 2026)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Search box */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              minWidth: '240px'
            }}>
              <Search size={16} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Search payee, notes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  outline: 'none',
                  border: 'none',
                  flex: 1,
                  fontSize: '14px',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>

            {/* Filter button */}
            <button style={{
              padding: '8px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Inter, sans-serif',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <Filter size={16} />
              Filter
            </button>

            {/* CSV button */}
            <button style={{
              padding: '8px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Inter, sans-serif',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <Download size={16} />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div style={{
        padding: '16px 32px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto'
      }}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                backgroundColor: isSelected ? '#2F6F63' : '#F3F4F6',
                color: isSelected ? '#ffffff' : '#374151',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = '#E5E7EB';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = '#F3F4F6';
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'Inter, sans-serif'
        }}>
          <thead style={{
            backgroundColor: '#F9FAFB',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <tr>
              <th style={{
                padding: '12px 32px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Date
              </th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Description
              </th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Category
              </th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Account
              </th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Amount (₹)
              </th>
              <th style={{
                padding: '12px 32px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn, idx) => {
                const Icon = getTransactionIcon(txn);
                const isIncome = txn.amount > 0;
                const categoryColors = getCategoryColor(txn.category);

                return (
                  <tr
                    key={txn.id}
                    style={{
                      borderBottom: idx < filteredTransactions.length - 1 ? '1px solid #F3F4F6' : 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{
                      padding: '16px 32px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#111827'
                    }}>
                      {formatDate(txn.date)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}>
                        <div style={{
                          backgroundColor: '#F3F4F6',
                          padding: '8px',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}>
                          <Icon size={18} color="#6B7280" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            fontWeight: 600,
                            color: '#111827',
                            fontSize: '14px',
                            marginBottom: '2px'
                          }}>
                            {txn.description}
                          </p>
                          <p style={{
                            fontSize: '13px',
                            color: '#6B7280'
                          }}>
                            {txn.details}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: categoryColors.bg,
                        color: categoryColors.text
                      }}>
                        {txn.category}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      fontSize: '14px',
                      color: '#111827'
                    }}>
                      {txn.account}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isIncome ? '#059669' : '#111827'
                    }}>
                      {isIncome ? "+" : "-"}
                      {formatIndianCurrency(Math.abs(txn.amount))}
                    </td>
                    <td style={{
                      padding: '16px 32px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}>
                        <CheckCircle size={18} color="#10B981" />
                        <span style={{
                          fontSize: '13px',
                          color: '#059669',
                          fontWeight: 500
                        }}>
                          Completed
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{
                  padding: '48px 32px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    color: '#6B7280',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    No transactions found matching your criteria.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{
        padding: '16px 32px',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          fontFamily: 'Inter, sans-serif'
        }}>
          Showing <strong>1 to 6</strong> of <strong>84</strong> entries
        </p>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <button style={{
            padding: '6px 12px',
            fontSize: '14px',
            color: '#9CA3AF',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'not-allowed',
            fontFamily: 'Inter, sans-serif'
          }}>
            Previous
          </button>
          {[1, 2, 3, '...', 14].map((page, idx) => (
            <button
              key={idx}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: 500,
                color: page === 1 ? '#ffffff' : '#374151',
                backgroundColor: page === 1 ? '#2F6F63' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: page === '...' ? 'default' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                minWidth: '36px'
              }}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          <button style={{
            padding: '6px 12px',
            fontSize: '14px',
            color: '#374151',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
