const jwt = require('jsonwebtoken');

/**
 * JWT Verification Middleware
 * Verifies the JWT token in the Authorization header
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided. Please include Authorization header with Bearer token',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired',
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }

    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
};

/**
 * Admin Only Middleware
 * Checks if user has admin privileges
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }

  next();
};

/**
 * Optional Token Verification
 * Verifies token if present, but doesn't require it
 */
const verifyTokenOptional = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Log error but continue - token verification is optional
    console.warn('Optional token verification failed:', error.message);
    next();
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  verifyTokenOptional,
};
