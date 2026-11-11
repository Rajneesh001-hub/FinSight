import React, { useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { SummaryCard } from "../components/SummaryCard";
import { DonutChart, BarChart } from "../components/ChartComponents";
import { BudgetSection } from "../components/BudgetSection";
import { GoalsSection } from "../components/GoalsSection";
import { TransactionsTable } from "../components/TransactionsTable";
import {
  summaryCards,
  spendingByCategory,
  incomeVsExpenses,
  monthlyBudgets,
  financialGoals,
  recentTransactions,
  filterCategories,
} from "../data/mockData";

export const Dashboard = () => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Page Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#F6F7F9', paddingTop: '24px', paddingBottom: '24px' }}>
        <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px' }}>
          
          {/* Row 1: Summary Cards (4 columns) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <SummaryCard
              label={summaryCards.totalBalance.label}
              amount={summaryCards.totalBalance.amount}
              change={summaryCards.totalBalance.change}
              icon="wallet"
              color="teal"
            />
            <SummaryCard
              label={summaryCards.income.label}
              amount={summaryCards.income.amount}
              change={summaryCards.income.change}
              icon="trending-up"
              color="green"
            />
            <SummaryCard
              label={summaryCards.expenses.label}
              amount={summaryCards.expenses.amount}
              change={summaryCards.expenses.change}
              icon="trending-down"
              color="red"
            />
            <SummaryCard
              label={summaryCards.savings.label}
              amount={summaryCards.savings.amount}
              change={summaryCards.savings.change}
              icon="piggy-bank"
              color="teal"
            />
          </div>

          {/* Row 2: Charts (2 columns - Donut and Bar) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <DonutChart data={spendingByCategory.categories} />
            <BarChart
              data={incomeVsExpenses.months}
              title={incomeVsExpenses.title}
              subtitle={incomeVsExpenses.subtitle}
            />
          </div>

          {/* Row 3: Budgets and Goals (2 columns) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <BudgetSection budgets={monthlyBudgets} />
            <GoalsSection goals={financialGoals} />
          </div>

          {/* Row 4: Recent Transactions (Full Width) */}
          <TransactionsTable
            transactions={recentTransactions}
            categories={filterCategories}
          />
        </div>
      </div>
    </div>
  );
};
