const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'taskmaster-ejs-secret-key-13579';

// Middleware to protect routes that require authentication
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // Set locals to render in EJS templates automatically
    res.locals.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.redirect('/login');
  }
};

// Middleware to redirect logged-in users away from Auth pages (login/register)
const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return res.redirect('/');
    } catch (err) {
      res.clearCookie('token');
    }
  }
  next();
};

module.exports = {
  authenticateUser,
  redirectIfAuthenticated,
  JWT_SECRET
};
