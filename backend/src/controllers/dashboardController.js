const supabase = require('../utils/supabaseClient');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

    // Get all transactions for balance calculation
    const { data: allTransactions, error: allError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (allError) {
      return res.status(500).json({
        error: 'Failed to fetch transactions',
        code: 'DB_ERROR',
        status: 500,
        details: allError.message
      });
    }

    // Calculate total balance
    const totalBalance = allTransactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);

    // Get current month income
    const { data: currentIncome, error: incomeError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'income')
      .gte('date', currentMonthStart)
      .lte('date', currentMonthEnd);

    if (incomeError) {
      return res.status(500).json({
        error: 'Failed to fetch income data',
        code: 'DB_ERROR',
        status: 500
      });
    }

    const currentIncomeTotal = currentIncome.reduce((sum, t) => sum + t.amount, 0);

    // Get current month expenses
    const { data: currentExpenses, error: expenseError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', currentMonthStart)
      .lte('date', currentMonthEnd);

    if (expenseError) {
      return res.status(500).json({
        error: 'Failed to fetch expense data',
        code: 'DB_ERROR',
        status: 500
      });
    }

    const currentExpenseTotal = currentExpenses.reduce((sum, t) => sum + t.amount, 0);

    // Get trends for last 6 months
    const trends = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const monthYear = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const monthStart = new Date(monthYear, month, 1).toISOString().split('T')[0];
      const monthEnd = new Date(monthYear, month + 1, 0).toISOString().split('T')[0];

      const { data: monthIncome } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'income')
        .gte('date', monthStart)
        .lte('date', monthEnd);

      const { data: monthExpense } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'expense')
        .gte('date', monthStart)
        .lte('date', monthEnd);

      const income = monthIncome ? monthIncome.reduce((sum, t) => sum + t.amount, 0) : 0;
      const expense = monthExpense ? monthExpense.reduce((sum, t) => sum + t.amount, 0) : 0;

      trends.push({
        month: monthDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
        income,
        expense
      });
    }

    // Get recent transactions (last 5)
    const { data: recentTransactions, error: recentError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5);

    if (recentError) {
      return res.status(500).json({
        error: 'Failed to fetch recent transactions',
        code: 'DB_ERROR',
        status: 500
      });
    }

    res.status(200).json({
      data: {
        total_balance: Math.round(totalBalance * 100) / 100,
        current_income: Math.round(currentIncomeTotal * 100) / 100,
        current_expense: Math.round(currentExpenseTotal * 100) / 100,
        trends,
        recent_transactions: recentTransactions
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      code: 'SERVER_ERROR',
      status: 500,
      details: error.message
    });
  }
};

module.exports = {
  getDashboard
};
