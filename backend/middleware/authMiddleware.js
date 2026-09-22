const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - must be logged in
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route, token missing",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "collegefinder_super_secret_jwt_key_2025_xyz"
    );
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No user found with this token ID",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed verification",
      error: err.message,
    });
  }
};

// Optional protect - if token exists, attach user, but don't reject if not
exports.optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "collegefinder_super_secret_jwt_key_2025_xyz"
      );
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      req.user = null;
    }
  }

  next();
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : "guest"}' is not authorized to access this route`,
      });
    }
    next();
  };
};
