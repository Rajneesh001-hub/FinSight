const supabase = require('../utils/supabaseClient');

// Get all budgets with spending totals
const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: budgets, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('category', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Failed to fetch budgets',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    // Calculate current monthly spending for each budget
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
    const monthEnd = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

    const enrichedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', userId)
          .eq('category', budget.category)
          .eq('type', 'expense')
          .gte('date', monthStart)
          .lte('date', monthEnd);

        const spending = transactions
          ? transactions.reduce((sum, t) => sum + Number(t.amount), 0)
          : 0;

        // DB column is "budget_limit"; expose as limit_amount for frontend compatibility
        const limitAmount = Number(budget.budget_limit ?? 0);

        return {
          ...budget,
          limit_amount: limitAmount,
          spent_amount: Math.round(spending * 100) / 100,
          current_spending: Math.round(spending * 100) / 100,
          remaining: Math.round((limitAmount - spending) * 100) / 100,
          percentage_used: limitAmount > 0
            ? Math.round((spending / limitAmount) * 100)
            : 0,
          period: budget.period ?? 'monthly',
        };
      })
    );

    res.status(200).json({
      data: enrichedBudgets,
      count: enrichedBudgets.length
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

// Create new budget
const createBudget = async (req, res) => {
  try {
    const { category, limit_amount, period } = req.body;
    const userId = req.user.id;
    console.log('[CREATE BUDGET] Body:', req.body, 'userId:', userId);

    if (!category || !limit_amount) {
      return res.status(400).json({
        error: 'Missing required fields: category, limit_amount',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    const limitVal = parseFloat(limit_amount);
    if (isNaN(limitVal) || limitVal <= 0) {
      return res.status(400).json({
        error: 'limit_amount must be a positive number',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    // Insert using the actual DB column names (no period column in this table)
    const insertRow = {
      user_id: userId,
      category,
      budget_limit: limitVal,
    };

    const { data, error } = await supabase
      .from('budgets')
      .insert([insertRow])
      .select();

    if (error) {
      console.error('[CREATE BUDGET] DB error:', error);
      return res.status(500).json({
        error: 'Failed to create budget',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }
    console.log('[CREATE BUDGET] Success, row:', data[0]);

    const row = data[0];
    res.status(201).json({
      data: {
        ...row,
        limit_amount: Number(row.budget_limit ?? 0),
        period: row.period ?? 'monthly',
      },
      message: 'Budget created successfully'
    });
  } catch (error) {
    console.error('[CREATE BUDGET] Caught exception:', error.message, error.stack);
    res.status(500).json({
      error: 'Server error',
      code: 'SERVER_ERROR',
      status: 500,
      details: error.message
    });
  }
};

// Update budget
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, limit_amount, period } = req.body;
    const userId = req.user.id;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('budgets')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({
        error: 'Budget not found',
        code: 'NOT_FOUND',
        status: 404
      });
    }

    const updateData = {};
    if (category !== undefined) updateData.category = category;
    if (limit_amount !== undefined) updateData.budget_limit = parseFloat(limit_amount);
    // period column does not exist in the budgets table — do not include it

    const { data, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      return res.status(500).json({
        error: 'Failed to update budget',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    const row = data[0];
    res.status(200).json({
      data: {
        ...row,
        limit_amount: Number(row.budget_limit ?? 0),
        period: row.period ?? 'monthly',
      },
      message: 'Budget updated successfully'
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

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`[DELETE BUDGET] Attempting to delete budget ${id} for user ${userId}`);

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error(`[DELETE BUDGET ERROR] ${error.message}`);
      return res.status(500).json({
        error: 'Failed to delete budget',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    console.log(`[DELETE BUDGET SUCCESS] Budget ${id} deleted`);
    res.status(200).json({
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    console.error(`[DELETE BUDGET CATCH] ${error.message}`, error);
    res.status(500).json({
      error: 'Server error',
      code: 'SERVER_ERROR',
      status: 500,
      details: error.message
    });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};
