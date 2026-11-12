import React, { useState } from "react";
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  Tag,
  AlertCircle,
  Loader,
} from "lucide-react";
import { api } from "../utils/apiClient";

export const AddTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: "Expense",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "Food & Dining",
    account: "HDFC Business Bank •• 4092",
    description: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const categories = [
    "Food & Dining",
    "Office & Rent",
    "Shopping",
    "Transport",
    "Bills & Utilities",
    "Software & Tech",
    "Income",
    "Other",
  ];

  const accounts = [
    "HDFC Business Bank •• 4092",
    "ICICI Current",
    "Amex Card •• 4092",
  ];

  const validateAmount = (value) => {
    const num = parseFloat(value);
    if (!value || value.trim() === "") {
      return "Amount is required";
    }
    if (isNaN(num) || num <= 0) {
      return "Enter an amount greater than 0";
    }
    return null;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, amount: value });
    
    const error = validateAmount(value);
    setErrors({ ...errors, amount: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    
    // Validate all fields
    const amountError = validateAmount(formData.amount);
    
    if (amountError) {
      setErrors({ ...errors, amount: amountError });
      return;
    }

    if (!formData.description || formData.description.trim() === "") {
      setErrors({ ...errors, description: "Description is required" });
      return;
    }

    try {
      setLoading(true);
      // Create transaction object
      const transaction = {
        date: formData.date,
        description: formData.description,
        details: formData.notes || "",
        category: formData.category,
        account: formData.account,
        amount: formData.type === "Income" 
          ? parseFloat(formData.amount) 
          : -parseFloat(formData.amount),
      };

      const result = await api.transactions.create(transaction);
      
      onSave(result);
      onClose();
      
      // Reset form
      setFormData({
        type: "Expense",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "Food & Dining",
        account: "HDFC Business Bank •• 4092",
        description: "",
        notes: "",
      });
      setErrors({});
    } catch (err) {
      setApiError(err.message || "Failed to save transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setFormData({
      type: "Expense",
      amount: "",
      date: "Oct 26, 2026",
      category: "Food & Dining",
      account: "HDFC Business Bank •• 4092",
      description: "",
      notes: "",
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "560px",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#E6F4F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tag size={16} color="#2F6F63" />
              </div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Add transaction
              </h2>
            </div>
            <button
              onClick={handleCancel}
              style={{
                padding: "6px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <X size={20} color="#6B7280" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
            {/* Transaction Type */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "12px",
                }}
              >
                Transaction Type
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "Expense" })}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: formData.type === "Expense" ? "#DC2626" : "#6B7280",
                    backgroundColor: formData.type === "Expense" ? "#FEF2F2" : "#F9FAFB",
                    border: formData.type === "Expense" ? "2px solid #DC2626" : "1px solid #E5E7EB",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <ArrowUpRight size={16} />
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "Income" })}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: formData.type === "Income" ? "#059669" : "#6B7280",
                    backgroundColor: formData.type === "Income" ? "#D1FAE5" : "#F9FAFB",
                    border: formData.type === "Income" ? "2px solid #059669" : "1px solid #E5E7EB",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <ArrowDownRight size={16} />
                  Income
                </button>
              </div>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Amount (INR) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Required</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  backgroundColor: "#F9FAFB",
                  border: errors.amount ? "2px solid #DC2626" : "1px solid #E5E7EB",
                  borderRadius: "8px",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#6B7280" }}>₹</span>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  style={{
                    flex: 1,
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#111827",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                />
              </div>
              {errors.amount && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "#FEE2E2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "#DC2626", fontWeight: 700 }}>!</span>
                  </div>
                  <span style={{ fontSize: "13px", color: "#DC2626" }}>{errors.amount}</span>
                </div>
              )}
            </div>

            {/* Date and Category Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {/* Date */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                  }}
                >
                  Date
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <Calendar size={16} color="#6B7280" />
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      flex: 1,
                      fontSize: "14px",
                      color: "#111827",
                      backgroundColor: "transparent",
                      border: "none",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                  }}
                >
                  Category
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    gap: "8px",
                  }}
                >
                  <Tag size={16} color="#6B7280" />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      flex: 1,
                      fontSize: "14px",
                      color: "#111827",
                      backgroundColor: "transparent",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      appearance: "none",
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ pointerEvents: "none" }}>
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Account */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Account
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  gap: "8px",
                }}
              >
                <Building2 size={16} color="#6B7280" />
                <select
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  style={{
                    flex: 1,
                    fontSize: "14px",
                    color: "#111827",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                  }}
                >
                  {accounts.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ pointerEvents: "none" }}>
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Description / Payee
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Client Retainer, WeWork, Starbucks"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "#111827",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Notes */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Notes <span style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "lowercase" }}>(optional)</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add additional context, invoice #, or tax reference (optional)"
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "#111827",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {apiError && (
              <div style={{
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <AlertCircle size={16} />
                {apiError}
              </div>
            )}

            {errors.description && (
              <div style={{
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <AlertCircle size={16} />
                {errors.description}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                  backgroundColor: "#ffffff",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#ffffff",
                  backgroundColor: loading ? "#9BE7D3" : "#2F6F63",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#275750")}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#2F6F63")}
              >
                {loading && <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />}
                {loading ? "Saving..." : "Save transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
