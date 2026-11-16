const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const authenticateToken = async (req, res, next) => {
  // Allow health check without authentication
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.warn(`[AUTH] Missing token for ${req.method} ${req.path}`);
    return res.status(401).json({
      error: 'Authorization token is missing',
      code: 'MISSING_TOKEN',
      status: 401
    });
  }

  try {
    // Use Supabase SDK to verify the token — correct way to validate Supabase JWTs
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn(`[AUTH] Invalid token for ${req.method} ${req.path}`, error?.message);
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
        status: 401
      });
    }

    // Attach user info to request
    req.user = {
      id:    user.id,
      email: user.email,
    };

    console.log(`[AUTH] ✓ Authenticated as ${user.email} (${user.id.substring(0, 8)}...) for ${req.method} ${req.path}`);
    next();
  } catch (err) {
    console.error(`[AUTH] Token verification failed:`, err.message);
    return res.status(401).json({
      error: 'Token verification failed',
      code: 'INVALID_TOKEN',
      status: 401
    });
  }
};

module.exports = authenticateToken;
