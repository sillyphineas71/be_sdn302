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

// Factory middleware: check if current user's role is in allowed list
// Usage: router.get('/admin', isAuth, checkRole(['admin']), handler)
module.exports.checkRole = (allowedRoles) => {
  // Normalize input to an array of lowercase strings
  const allowed = (
    Array.isArray(allowedRoles)
      ? allowedRoles
      : typeof allowedRoles === "string"
      ? [allowedRoles]
      : []
  )
    .filter(Boolean)
    .map((r) => String(r).toLowerCase());

  return async (req, res, next) => {
    try {
      if (!req.userId || !req.roleId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // If no roles specified, deny by default
      if (!allowed.length) {
        return res
          .status(403)
          .json({ message: "Not authorized (no role permitted)" });
      }

      // Load role information
      let roleDoc = null;
      try {
        roleDoc = await Role.findById(req.roleId).lean();
      } catch (e) {
        // Ignore cast errors; treat as not found
      }

      // Fallback: populate from user document if needed
      if (!roleDoc) {
        const user = await User.findById(req.userId).populate("roleId", "name");
        roleDoc =
          user && user.roleId
            ? { _id: user.roleId._id, name: user.roleId.name }
            : null;
      }

      if (!roleDoc) {
        return res.status(403).json({ message: "Role not found" });
      }

      const userRoleName = String(roleDoc.name || "").toLowerCase();
      const userRoleId = String(roleDoc._id || "");

      const isAllowed =
        allowed.includes(userRoleName) || allowed.includes(userRoleId);

      if (!isAllowed) {
        return res.status(403).json({
          message: "Not authorized",
          detail: `Required roles: [${allowed.join(", ")}] | Current role: ${
            roleDoc.name || userRoleId
          }`,
        });
      }

      return next();
    } catch (err) {
      console.error("checkRole error:", err);
      return res
        .status(500)
        .json({ message: err.message || "Authorization check failed" });
    }
  };
};
