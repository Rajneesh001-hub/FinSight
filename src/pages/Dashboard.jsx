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
  const [monthFilter, setMonthFilter] = useState("this-month");

  return (
    <div className="w-full">
      {/* Page Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DonutChart data={spendingByCategory.categories} />
            <BarChart
              data={incomeVsExpenses.months}
              title={incomeVsExpenses.title}
              subtitle={incomeVsExpenses.subtitle}
            />
          </div>

          {/* Row 3: Budgets and Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BudgetSection budgets={monthlyBudgets} />
            <GoalsSection goals={financialGoals} />
          </div>

          {/* Row 4: Recent Transactions */}
          <TransactionsTable
            transactions={recentTransactions}
            categories={filterCategories}
          />
        </div>
      </div>
    </div>
  );
};
