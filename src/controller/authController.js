const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const Role = require("../model/role.model");

module.exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const customerRole = await Role.findOne({
      name: "customer",
    }).lean();
    if (!customerRole) {
      return res
        .status(500)
        .json({ message: "Customer role not found. Please seed roles." });
    }
    const passHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passHash,
      roleId: customerRole._id,
      isDisabled: false,
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Registration failed" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.passHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const payload = {
      userId: user._id,
      roleId: user.roleId,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Login failed" });
  }
};
