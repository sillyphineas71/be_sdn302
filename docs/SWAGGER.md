# API Documentation - Swagger

## 🚀 Truy cập Swagger UI

Sau khi start server, truy cập:

```
http://localhost:9999/api-docs
```

## 📚 API Endpoints Overview

### Auth (2 endpoints)

- `POST /api/auth/register` - Đăng ký user mới (role: customer)
- `POST /api/auth/login` - Đăng nhập

### Cart (6 endpoints)

- `GET /api/cart/{userId}` - Xem giỏ hàng
- `POST /api/cart/items` - Thêm món vào giỏ
- `PUT /api/cart/items/{itemId}` - Cập nhật số lượng
- `DELETE /api/cart/items/{itemId}` - Xóa món khỏi giỏ
- `DELETE /api/cart/{userId}` - Xóa toàn bộ giỏ
- `POST /api/cart/checkout` - Thanh toán (tạo order, xóa cart items)

### Order (4 endpoints)

- `POST /api/order/add` - Tạo order trực tiếp (legacy, không qua cart)
- `GET /api/order/{orderId}` - Xem chi tiết order
- `GET /api/order/user/{userId}` - Danh sách orders của user
- `PUT /api/order/{orderId}/status` - Cập nhật trạng thái order

## 🎯 Flow sử dụng chuẩn

### 1. Authentication

```
POST /api/auth/register
→ Nhận userId

POST /api/auth/login
→ Nhận token (cho future authentication)
```

### 2. Shopping Flow (Cart → Order)

```
POST /api/cart/items (nhiều lần)
→ Thêm các món vào giỏ

GET /api/cart/{userId}
→ Xem giỏ hàng hiện tại

PUT /api/cart/items/{itemId} (optional)
→ Sửa số lượng

POST /api/cart/checkout
→ Tạo order + xóa cart items
```

### 3. Order Management

```
GET /api/order/user/{userId}
→ Xem danh sách orders

GET /api/order/{orderId}
→ Chi tiết 1 order

PUT /api/order/{orderId}/status
→ Cập nhật trạng thái (staff/admin)
```

## 📝 Sample Requests

### Register User

```json
POST /api/auth/register
{
  "email": "customer@example.com",
  "password": "Pass123"
}
```

### Add Item to Cart

```json
POST /api/cart/items
{
  "userId": "673abc123def456789012345",
  "foodId": "673def456abc789012345678",
  "quantity": 2
}
```

### Checkout

```json
POST /api/cart/checkout
{
  "userId": "673abc123def456789012345",
  "shipping": 15000,
  "discount": 0,
  "tax": 0,
  "notes": "Giao giữa 6-7 PM",
  "paymentMethodCode": "COD"
}
```

### Update Order Status

```json
PUT /api/order/{orderId}/status
{
  "status": "confirmed"
}
```

**Valid order statuses:**

- `pending` - Đang chờ xác nhận
- `confirmed` - Đã xác nhận
- `preparing` - Đang chuẩn bị
- `shipping` - Đang giao hàng
- `delivered` - Đã giao
- `cancelled` - Đã hủy

## 🔍 Response Formats

### Success Response - Cart

```json
{
  "message": "Cart retrieved",
  "cart": {
    "id": "...",
    "userId": "...",
    "status": "active"
  },
  "items": [
    {
      "id": "...",
      "foodId": "...",
      "name": "Phở Bò",
      "unitPrice": 45000,
      "quantity": 2,
      "lineTotal": 90000,
      "food": { ... }
    }
  ],
  "total": 90000
}
```

### Success Response - Order

```json
{
  "message": "Order created from cart",
  "order": {
    "id": "...",
    "code": "ORD-20250125-143025",
    "status": "pending",
    "amounts": {
      "currency": "VND",
      "subtotal": 90000,
      "shipping": 15000,
      "discount": 0,
      "tax": 0,
      "grandTotal": 105000
    },
    "items": 2,
    "paymentId": "..."
  },
  "cartItemsProcessed": 2
}
```

### Error Response

```json
{
  "message": "Error description"
}
```

## 💡 Tips cho FE Team

1. **Try it out trực tiếp trên Swagger UI**

   - Click "Try it out" → Nhập data → "Execute"
   - Xem response ngay lập tức

2. **Copy curl command**

   - Sau khi execute, scroll xuống xem curl command
   - Copy để test với Postman hoặc fetch/axios

3. **Schemas**

   - Xem "Schemas" ở cuối page để biết cấu trúc data models
   - CartItem, Order, OrderDetail, Amounts, Payment...

4. **Auto-generated code**
   - Swagger UI có thể generate code cho nhiều languages
   - Hữu ích cho việc viết API calls

## 🛠️ Development

Để cập nhật Swagger docs:

1. Edit JSDoc comments trong `src/routes/*.js`
2. Server tự động restart (nodemon)
3. Refresh `/api-docs` để thấy changes

## 📦 Dependencies

- `swagger-jsdoc` - Parse JSDoc comments thành OpenAPI spec
- `swagger-ui-express` - Render Swagger UI

Config file: `config/swagger.js`
