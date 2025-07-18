exports.requireRole = (roles) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied: insufficient privileges" 
      });
    }
    next();
  };
};