const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const connectDB = require("./config/db.js");
const cors = require("cors");
const app = express();

app.use(express.json());
connectDB();

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.get("/", async (req, res) => {
  try {
    res.send({ message: "Welcome to BE_SDN API. View docs at /api-docs" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/order", require("./src/routes/orderRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/food", require("./src/routes/foodRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
