const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const cors = require("cors");
const connectDB = require("./config/db.js");
<<<<<<< HEAD

const app = express();

// Middleware
=======
const cors = require("cors");

const app = express();
app.use(cors());
>>>>>>> namnh
app.use(express.json());
app.use(cors());

// Kết nối database
connectDB();

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default route
app.get("/", async (req, res) => {
  try {
    res.send({ message: "Welcome to BE_SDN API. View docs at /api-docs" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

// API routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/order", require("./src/routes/orderRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/admin/foods", require("./src/routes/foodRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/feedbacks", require("./src/routes/feedbackRoutes"));
app.use("/api/blogs", require("./src/routes/blogRoutes"));
app.use("/api/blog-categories", require("./src/routes/blogCategoryRoutes"));
app.use("/api/admin/categories", require("./src/routes/categoryRoutes"));
app.use("/api/category", require("./src/routes/categoryRoutes"));
app.use("/api/food", require("./src/routes/foodRoutes"));
app.use('/categories', require("./src/routes/categoryRoutes.js"));
app.use("/api/blog", require("./src/routes/blogRoute.js"));
app.use("/api/blog-category", require("./src/routes/blogCategoryRoutes.js"));

// admin
app.use("/api/admin/dashboard", require("./src/routes/adminDashboardRoutes.js"));
app.use("/api/admin/users", require("./src/routes/adminUserRoutes.js"));
app.use("/api/admin/orders", require("./src/routes/adminOrderRoutes.js"));

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
