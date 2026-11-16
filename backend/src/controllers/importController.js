const supabase = require('../utils/supabaseClient');
const csv = require('fast-csv');
const stream = require('stream');

// Import transactions from CSV
const importTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        code: 'MISSING_FILE',
        status: 400
      });
    }

    const transactions = [];
    const errors = [];
    let rowNumber = 0;

    const parseStream = csv.parse({ headers: true })
      .on('error', (error) => {
        errors.push(`CSV parsing error: ${error.message}`);
      })
      .on('data', (row) => {
        rowNumber++;
        const { date, category, type, amount, description } = row;

        // Validate row
        if (!date || !category || !type || !amount) {
          errors.push(`Row ${rowNumber}: Missing required fields (date, category, type, amount)`);
          return;
        }

        if (!['income', 'expense'].includes(type.toLowerCase())) {
          errors.push(`Row ${rowNumber}: Type must be "income" or "expense"`);
          return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
          errors.push(`Row ${rowNumber}: Amount must be a positive number`);
          return;
        }

        transactions.push({
          user_id: userId,
          date,
          category,
          type: type.toLowerCase(),
          amount: parseFloat(amount),
          description: description || null
        });
      })
      .on('end', async () => {
        if (transactions.length === 0 && errors.length > 0) {
          return res.status(400).json({
            error: 'No valid transactions to import',
            code: 'VALIDATION_ERROR',
            status: 400,
            errors
          });
        }

        // Bulk insert transactions
        if (transactions.length > 0) {
          const { error: insertError } = await supabase
            .from('transactions')
            .insert(transactions);

          if (insertError) {
            return res.status(500).json({
              error: 'Failed to insert transactions',
              code: 'DB_ERROR',
              status: 500,
              details: insertError.message
            });
          }
        }

        res.status(200).json({
          message: 'Import completed successfully',
          summary: {
            total_rows: rowNumber,
            imported: transactions.length,
            failed: errors.length,
            errors: errors.length > 0 ? errors : null
          }
        });
      });

    // Pipe the file buffer to the parser
    stream.Readable.from([req.file.buffer.toString()]).pipe(parseStream);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      code: 'SERVER_ERROR',
      status: 500,
      details: error.message
    });
  }
};

// Export transactions as CSV
const exportTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[EXPORT] Starting export for user ${userId.substring(0, 8)}...`);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error(`[EXPORT ERROR] ${error.message}`);
      return res.status(500).json({
        error: 'Failed to fetch transactions',
        code: 'DB_ERROR',
        status: 500,
        details: error.message
      });
    }

    console.log(`[EXPORT] Found ${data.length} transactions`);

    if (data.length === 0) {
      console.log(`[EXPORT] No data, returning empty`);
      return res.status(200).json({
        message: 'No transactions to export',
        data: []
      });
    }

    // Convert to CSV format
    const csvHeaders = ['Date', 'Category', 'Type', 'Amount', 'Description'];
    const csvData = data.map((t) => [
      t.date,
      t.category,
      t.type,
      t.amount,
      t.description || ''
    ]);

    const csvStream = csv.format({ headers: csvHeaders });

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');

    console.log(`[EXPORT] Sending CSV with ${data.length} rows`);

    // Pipe CSV data to response
    csvStream.pipe(res);

    // Write header
    csvStream.write(csvHeaders);

    // Write data
    csvData.forEach((row) => {
      csvStream.write(row);
    });

    csvStream.end();
  } catch (error) {
    console.error(`[EXPORT CATCH] ${error.message}`, error.stack);
    res.status(500).json({
      error: 'Server error',
      code: 'SERVER_ERROR',
      status: 500,
      details: error.message
    });
  }
};

module.exports = {
  importTransactions,
  exportTransactions
};
