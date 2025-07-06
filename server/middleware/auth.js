const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../config/keys"); // No longer needed from here
const userModel = require("../models/users");

exports.loginCheck = (req, res, next) => {
  try {
    let token = req.headers.token;
    if (!token) {
      return res.status(401).json({ error: "Authorization token not provided." });
    }
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use process.env
    req.userDetails = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    res.json({
      error: "You must be logged in",
    });
  }
};

exports.isAuth = async (req, res, next) => {
  // This middleware now checks if the user from the token still exists and is valid.
  // It's a general "authenticated user is valid" check.
  // Specific resource ownership checks (e.g. user can only edit their own profile)
  // would need to compare req.params.userId with req.userDetails._id in the route controller or a more specific middleware.

  if (!req.userDetails || !req.userDetails._id) {
    // This case should ideally be caught by loginCheck first
    return res.status(401).json({ error: "Authentication token not found or invalid." });
  }

  try {
    const user = await userModel.findById(req.userDetails._id);
    if (!user) {
      return res.status(403).json({ error: "Authenticated user not found in database." });
    }
    // Optionally, could check for user.verified or other status flags here if needed.
    // req.user = user; // Optionally attach full user object to request
    next();
  } catch (error) {
    console.error("Error in isAuth middleware:", error);
    return res.status(500).json({ error: "Internal server error during authentication." });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (!req.userDetails || !req.userDetails._id) {
    return res.status(403).json({ error: "Authentication required for admin access." });
  }
  try {
    let user = await userModel.findById(req.userDetails._id);
    if (user && user.userRole === 1) { // Assuming role 1 is Admin
      next();
    } else {
      res.status(403).json({ error: "Access denied. Admin permission required." });
    }
  } catch (err) {
    console.error("Error in isAdmin middleware:", err);
    res.status(500).json({ error: "Internal server error during authorization check." });
  }
};
