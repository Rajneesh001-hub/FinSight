const supabase = require('../utils/supabaseClient');

// Get all transactions with optional filtering and pagination
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, type, startDate, endDate, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({
        error: 'Failed to fetch transactions',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    console.log(`[GET TX] Fetched ${data.length} transactions, first ID:`, data[0]?.id);
    res.status(200).json({
      data,
      count: data.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
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

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { amount, category, date, type, description } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!amount || !category || !date || !type) {
      return res.status(400).json({
        error: 'Missing required fields: amount, category, date, type',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        error: 'Type must be either "income" or "expense"',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be a positive number',
        code: 'VALIDATION_ERROR',
        status: 400
      });
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          amount: parseFloat(amount),
          category,
          date,
          type,
          description: description || null
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        error: 'Failed to create transaction',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    res.status(201).json({
      data: data[0],
      message: 'Transaction created successfully'
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

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, type, description } = req.body;
    const userId = req.user.id;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('transactions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({
        error: 'Transaction not found',
        code: 'NOT_FOUND',
        status: 404
      });
    }

    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = date;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      return res.status(500).json({
        error: 'Failed to update transaction',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    res.status(200).json({
      data: data[0],
      message: 'Transaction updated successfully'
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

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`[DELETE TX] Deleting transaction ${id} for user ${userId}`);

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error(`[DELETE TX ERROR] ${error.message}`, error);
      return res.status(500).json({
        error: 'Failed to delete transaction',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    console.log(`[DELETE TX SUCCESS] Transaction ${id} deleted`);
    res.status(200).json({
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error(`[DELETE TX CATCH] ${error.message}`, error.stack);
    res.status(500).json({
      error: 'Server error',
      code: 'SERVER_ERROR',
      status: 500,
      details: error.message
    });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
