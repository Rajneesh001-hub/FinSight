const supabase = require('../utils/supabaseClient');

// Get all goals with progress
const getGoals = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('deadline', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Failed to fetch goals',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    // Calculate progress for each goal
    const enrichedGoals = await Promise.all(
      goals.map(async (goal) => {
        let current_amount = 0;

        if (goal.category) {
          const { data: transactions } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('category', goal.category)
            .eq('type', 'income');

          current_amount = transactions ? transactions.reduce((sum, t) => sum + t.amount, 0) : 0;
        }

        const progress = Math.round((current_amount / goal.target_amount) * 100);
        const isCompleted = current_amount >= goal.target_amount;

        return {
          ...goal,
          current_amount: Math.round(current_amount * 100) / 100,
          progress: Math.min(progress, 100),
          is_completed: isCompleted
        };
      })
    );

    res.status(200).json({
      data: enrichedGoals,
      count: enrichedGoals.length
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

// Create new goal
const createGoal = async (req, res) => {
  try {
    const { name, target_amount, deadline, category } = req.body;
    const userId = req.user.id;

    console.log('[CREATE GOAL] Body received:', req.body);

    // Validate required fields
    if (!name || !target_amount || !deadline) {
      return res.status(400).json({
        error: 'Missing required fields: name, target_amount, deadline',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    if (isNaN(target_amount) || target_amount <= 0) {
      return res.status(400).json({
        error: 'target_amount must be a positive number',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    const { data, error } = await supabase
      .from('goals')
      .insert([
        {
          user_id: userId,
          name,
          target_amount: parseFloat(target_amount),
          deadline,
          category: category || null
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        error: 'Failed to create goal',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    res.status(201).json({
      data: data[0],
      message: 'Goal created successfully'
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

// Update goal
const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, target_amount, deadline, category } = req.body;
    const userId = req.user.id;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({
        error: 'Goal not found',
        code: 'NOT_FOUND',
        status: 404
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (target_amount !== undefined) updateData.target_amount = parseFloat(target_amount);
    if (deadline !== undefined) updateData.deadline = deadline;
    if (category !== undefined) updateData.category = category;

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      return res.status(500).json({
        error: 'Failed to update goal',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    res.status(200).json({
      data: data[0],
      message: 'Goal updated successfully'
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

// Delete goal
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`[DELETE GOAL] Attempting to delete goal ${id} for user ${userId}`);

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error(`[DELETE GOAL ERROR] ${error.message}`);
      return res.status(500).json({
        error: 'Failed to delete goal',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    console.log(`[DELETE GOAL SUCCESS] Goal ${id} deleted`);
    res.status(200).json({
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error(`[DELETE GOAL CATCH] ${error.message}`, error);
    res.status(500).json({
      error: 'Server error',
      code: 'SERVER_ERROR',
      status: 500,
      details: error.message
    });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
};
