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

  const colorConfig = {
    teal: {
      iconBg: '#f0fdf9',
      icon: '#2F6F63',
    },
    green: {
      iconBg: '#dcfce7',
      icon: '#16a34a',
    },
    red: {
      iconBg: '#fee2e2',
      icon: '#dc2626',
    },
  };

  const colors = colorConfig[color] || colorConfig.teal;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top row: Label and Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '14px',
          color: '#6b7280',
          fontWeight: '500',
        }}>{label}</span>
        <div style={{
          backgroundColor: colors.iconBg,
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={18} color={colors.icon} />
        </div>
      </div>

      {/* Amount - Large and Bold */}
      <div style={{
        marginBottom: '12px',
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: 0,
        }}>
          {formatIndianCurrency(amount)}
        </h3>
      </div>

      {/* Change percentage with arrow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        fontWeight: '600',
        color: isPositive ? '#16a34a' : '#dc2626',
      }}>
        {isPositive ? (
          <ArrowUp size={14} />
        ) : (
          <ArrowDown size={14} />
        )}
        <span>{formatPercentage(change)} vs last month</span>
      </div>
    </div>
  );
};
