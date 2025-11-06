# Postman Collection - BE_SDN API

## Thông tin chung

Collection này cung cấp các endpoint để test Cart và Order với xác thực JWT Bearer token.

## Cài đặt

1. Import file `BE_SDN_Cart_Checkout.postman_collection.json` vào Postman
2. Collection sẽ tự động sử dụng Bearer token authentication cho các endpoint Cart và Order

## Biến môi trường

Collection variables được sử dụng:

- `baseUrl`: http://localhost:9999 (mặc định)
- `token`: JWT token (tự động lưu sau khi login)
- `userId`: User ID (tự động lưu sau khi register)
- `foodId1`, `foodId2`: Food IDs để test
- `cartItemId`: Cart item ID (tự động lưu sau khi add item)
- `orderId`: Order ID (tự động lưu sau khi checkout)

## Hướng dẫn sử dụng

### 1. Authentication

#### Register (Optional)

- Endpoint: `POST /api/auth/register`
- Tạo tài khoản mới
- Token sẽ tự động được lưu vào collection variable `{{token}}`

#### Login (Required)

- Endpoint: `POST /api/auth/login`
- Đăng nhập để nhận JWT token
- Token sẽ tự động được lưu và sử dụng cho các request tiếp theo

### 2. Cart (Yêu cầu Authentication)

Tất cả các endpoint Cart đều yêu cầu Bearer token trong header:

```
Authorization: Bearer {{token}}
```

#### Get Cart

- Endpoint: `GET /api/cart`
- Lấy giỏ hàng của user hiện tại (từ token)

#### Add Item to Cart

- Endpoint: `POST /api/cart/items`
- Body:
  ```json
  {
    "foodId": "{{foodId1}}",
    "quantity": 2
  }
  ```
- **Lưu ý**: `userId` được lấy tự động từ JWT token, không cần gửi trong body

#### Update Cart Item

- Endpoint: `PUT /api/cart/items/{{cartItemId}}`
- Body:
  ```json
  {
    "quantity": 3
  }
  ```

#### Remove Cart Item

- Endpoint: `DELETE /api/cart/items/{{cartItemId}}`

#### Clear Cart

- Endpoint: `DELETE /api/cart`
- Xóa toàn bộ giỏ hàng của user hiện tại

### 3. Checkout (Yêu cầu Authentication)

#### Checkout from Cart

- Endpoint: `POST /api/cart/checkout`
- Body:
  ```json
  {
    "shipping": 15000,
    "discount": 0,
    "tax": 0,
    "notes": "Giao giữa 6-7 PM",
    "paymentMethodCode": "COD"
  }
  ```
- **Lưu ý**: `userId` được lấy tự động từ JWT token

### 4. Order

#### My Orders (Yêu cầu Authentication)

- Endpoint: `GET /api/order/my-orders`
- Lấy danh sách đơn hàng của user hiện tại (từ token)

#### Get Order by ID (Không yêu cầu Authentication)

- Endpoint: `GET /api/order/{{orderId}}`
- Dành cho admin/staff

#### Update Order Status (Không yêu cầu Authentication)

- Endpoint: `PUT /api/order/{{orderId}}/status`
- Dành cho admin/staff
- Body:
  ```json
  {
    "status": "confirmed"
  }
  ```

#### Add Order Direct - Legacy (Không yêu cầu Authentication)

- Endpoint: `POST /api/order/add`
- Endpoint cũ, vẫn giữ để tương thích
- Body:
  ```json
  {
    "userId": "{{userId}}",
    "items": [
      { "foodId": "{{foodId1}}", "quantity": 1 },
      { "foodId": "{{foodId2}}", "quantity": 2 }
    ],
    "shipping": 15000,
    "discount": 0,
    "tax": 0,
    "notes": "Direct order",
    "paymentMethodCode": "COD"
  }
  ```

## Flow test chuẩn

1. **Login** → Nhận token
2. **Get Cart** → Xem giỏ hàng hiện tại
3. **Add Item to Cart** (nhiều lần nếu muốn)
4. **Update Cart Item** (điều chỉnh số lượng)
5. **Checkout from Cart** → Tạo đơn hàng
6. **My Orders** → Xem danh sách đơn hàng

## Lưu ý bảo mật

- Token có thời hạn 1 giờ, sau đó cần login lại
- Tất cả endpoint Cart và Order "My Orders" đều yêu cầu token hợp lệ
- UserId được trích xuất từ token, không thể giả mạo
- Admin/Staff endpoints (Get Order by ID, Update Status) có thể cần role checking sau này

## Xem API Documentation

Swagger UI: http://localhost:9999/api-docs
