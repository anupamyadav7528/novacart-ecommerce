const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication is required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    req.userId = payload.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
};

module.exports = { requireAuth };
