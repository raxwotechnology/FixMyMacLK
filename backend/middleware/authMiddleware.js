const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '12345';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const rawToken = authHeader?.replace(/^Bearer\s+/i, '')?.trim();
  const token = (rawToken && rawToken !== 'null' && rawToken !== 'undefined') ? rawToken : null;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

module.exports = authMiddleware;
