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

    // Calculate current spending for each budget
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const enrichedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        let spending = 0;

        if (budget.period === 'monthly') {
          const monthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
          const monthEnd = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

          const { data: transactions } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('category', budget.category)
            .eq('type', 'expense')
            .gte('date', monthStart)
            .lte('date', monthEnd);

          spending = transactions ? transactions.reduce((sum, t) => sum + t.amount, 0) : 0;
        } else if (budget.period === 'yearly') {
          const yearStart = new Date(currentYear, 0, 1).toISOString().split('T')[0];
          const yearEnd = new Date(currentYear, 11, 31).toISOString().split('T')[0];

          const { data: transactions } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('category', budget.category)
            .eq('type', 'expense')
            .gte('date', yearStart)
            .lte('date', yearEnd);

          spending = transactions ? transactions.reduce((sum, t) => sum + t.amount, 0) : 0;
        }

        return {
          ...budget,
          current_spending: Math.round(spending * 100) / 100,
          remaining: Math.round((budget.limit_amount - spending) * 100) / 100,
          percentage_used: Math.round((spending / budget.limit_amount) * 100)
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

    // Validate required fields
    if (!category || !limit_amount || !period) {
      return res.status(400).json({
        error: 'Missing required fields: category, limit_amount, period',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    if (!['monthly', 'yearly'].includes(period)) {
      return res.status(400).json({
        error: 'Period must be either "monthly" or "yearly"',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    if (isNaN(limit_amount) || limit_amount <= 0) {
      return res.status(400).json({
        error: 'limit_amount must be a positive number',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: userId,
          category,
          limit_amount: parseFloat(limit_amount),
          period
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        error: 'Failed to create budget',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    res.status(201).json({
      data: data[0],
      message: 'Budget created successfully'
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
    if (limit_amount !== undefined) updateData.limit_amount = parseFloat(limit_amount);
    if (period !== undefined) updateData.period = period;

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

    res.status(200).json({
      data: data[0],
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
