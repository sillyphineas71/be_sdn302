const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.get("/", async (req, res) => {
  try {
    res.send({ message: "Welcome" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/order", require("./src/routes/orderRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/food", require("./src/routes/foodRoutes"));

// admin
app.use("/api/admin/dashboard", require("./src/routes/adminDashboardRoutes.js"));
app.use("/api/admin/users", require("./src/routes/adminUserRoutes.js"));
app.use("/api/admin/orders", require("./src/routes/adminOrderRoutes.js"));

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
