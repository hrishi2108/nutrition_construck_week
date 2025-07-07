const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { 
      userId: decoded.userId, 
      role: decoded.role 
    };
    next();
  } catch (err) {
    console.error("Token Verification Error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};