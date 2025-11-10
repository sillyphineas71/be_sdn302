const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BE_SDN API Documentation",
      version: "1.0.0",
      description: "API documentation for Restaurant Food Ordering System",
      contact: {
        name: "SDN Team",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:9999",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
            },
            email: {
              type: "string",
              format: "email",
            },
          },
        },
        Food: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            price: {
              type: "number",
            },
            salePrice: {
              type: "number",
              nullable: true,
            },
            image: {
              type: "string",
              nullable: true,
            },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Cart item ID",
            },
            foodId: {
              type: "string",
              description: "Food ID",
            },
            name: {
              type: "string",
              description: "Food name",
            },
            unitPrice: {
              type: "number",
              description: "Price per unit",
            },
            quantity: {
              type: "integer",
              description: "Quantity",
            },
            lineTotal: {
              type: "number",
              description: "Total price for this item",
            },
            food: {
              $ref: "#/components/schemas/Food",
            },
          },
        },
        Cart: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            userId: {
              type: "string",
            },
            status: {
              type: "string",
              enum: ["active", "converted", "abandoned"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Amounts: {
          type: "object",
          properties: {
            currency: {
              type: "string",
              example: "VND",
            },
            subtotal: {
              type: "number",
              description: "Sum of all items",
            },
            shipping: {
              type: "number",
              description: "Shipping fee",
            },
            discount: {
              type: "number",
              description: "Discount amount",
            },
            tax: {
              type: "number",
              description: "Tax amount",
            },
            grandTotal: {
              type: "number",
              description: "Final total",
            },
          },
        },
        OrderDetail: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            foodId: {
              type: "string",
            },
            name: {
              type: "string",
            },
            unitPrice: {
              type: "number",
            },
            quantity: {
              type: "integer",
            },
            lineTotal: {
              type: "number",
            },
            food: {
              $ref: "#/components/schemas/Food",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            code: {
              type: "string",
              description: "Order code (e.g., ORD-20250125-123045)",
            },
            userId: {
              type: "string",
            },
            status: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "preparing",
                "shipping",
                "delivered",
                "cancelled",
              ],
            },
            amounts: {
              $ref: "#/components/schemas/Amounts",
            },
            notes: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Payment: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            amount: {
              type: "number",
            },
            currency: {
              type: "string",
            },
            status: {
              type: "string",
              enum: ["pending", "completed", "failed"],
            },
            method: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controller/*.js"],
};

module.exports = swaggerJsdoc(options);
