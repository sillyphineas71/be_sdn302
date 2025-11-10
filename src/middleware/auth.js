const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const Role = require("../model/role.model");
module.exports.isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.userId = decoded.userId;
    req.roleId = decoded.roleId;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  try {
    //  Lấy user và populate role
    const user = await User.findById(req.userId).populate("roleId", "name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Nếu user không có role hoặc role khác admin → chặn
    if (!user.roleId || user.roleId.name !== "admin") {
      console.log(" Not admin, role =", user.roleId?.name);
      return res.status(403).json({ message: "Not authorized (admin only)" });
    }

    console.log(" Admin verified:", user.email);
    next(); // 👈 Cho phép qua tiếp controller
  } catch (err) {
    console.error(" isAdmin error:", err);
    res
      .status(500)
      .json({ message: err.message || "Authorization check failed" });
  }
};