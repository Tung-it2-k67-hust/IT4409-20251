# HƯỚNG DẪN NỘP BÀI

## 📦 Nội dung nộp bài

### 1. File mã nguồn ✅
- **File:** `submission.js`
- **Nội dung:** Toàn bộ mã nguồn kết nối MongoDB Atlas và xử lý CRUD APIs
- **Đã bao gồm:**
  - ✓ Kết nối MongoDB Atlas
  - ✓ Định nghĩa Schema & Model
  - ✓ 5 CRUD Controllers (Create, Read All, Read By ID, Update, Delete)
  - ✓ Error handling
  - ✓ Routes setup
  - ✓ Server configuration

### 2. Bốn ảnh Postman 📷

#### Ảnh 1: CREATE USER (POST)
```
Method: POST
URL: http://localhost:5000/api/users
Headers: Content-Type: application/json
Body (raw JSON):
{
  "name": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "age": 22,
  "role": "user"
}
```
**Chụp màn hình:** Response status 201, hiển thị user mới được tạo với `_id`

---

#### Ảnh 2: READ ALL USERS (GET)
```
Method: GET
URL: http://localhost:5000/api/users
```
**Chụp màn hình:** Response status 200, hiển thị danh sách users với count

---

#### Ảnh 3: UPDATE USER (PUT)
```
Method: PUT
URL: http://localhost:5000/api/users/{id}
Headers: Content-Type: application/json
Body (raw JSON):
{
  "name": "Nguyen Van A Updated",
  "age": 23
}
```
**Chụp màn hình:** Response status 200, hiển thị user đã được cập nhật

---

#### Ảnh 4: DELETE USER (DELETE)
```
Method: DELETE
URL: http://localhost:5000/api/users/{id}
```
**Chụp màn hình:** Response status 200, hiển thị message xóa thành công

---

## ⚙️ Cấu hình MongoDB Atlas

### Yêu cầu:
1. **Username:** Sử dụng MSSV của bạn (ví dụ: `20225425`)
2. **Collection name:** Sử dụng email của bạn (ví dụ: `tung.ds225425`)

### File .env cần tạo:
```env
MONGODB_URI=mongodb+srv://[MSSV]:[PASSWORD]@[CLUSTER].mongodb.net/[DATABASE]?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### Ví dụ cụ thể:
```env
MONGODB_URI=mongodb+srv://20225425:mypassword123@cluster0.xxxxx.mongodb.net/userdb?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Lưu ý:** 
- Collection sẽ được tự động tạo với tên `users` (số nhiều của model `User`)
- Nếu yêu cầu collection name là email, cần thay đổi model name trong code

---

## 🚀 Hướng dẫn chạy

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Tạo file .env
Tạo file `.env` trong thư mục gốc với nội dung như trên

### Bước 3: Chạy server
```bash
node submission.js
```

Hoặc để auto-reload:
```bash
npm run dev
```

### Bước 4: Kiểm tra
Server sẽ chạy tại: `http://localhost:5000`

Truy cập để xem thông tin API:
```
GET http://localhost:5000
```

---

## 📝 Checklist trước khi nộp

- [ ] File `submission.js` chứa đầy đủ mã nguồn
- [ ] Ảnh 1: CREATE USER - Status 201 ✓
- [ ] Ảnh 2: GET ALL USERS - Status 200 ✓
- [ ] Ảnh 3: UPDATE USER - Status 200 ✓
- [ ] Ảnh 4: DELETE USER - Status 200 ✓
- [ ] MongoDB username = MSSV
- [ ] MongoDB collection name phù hợp với yêu cầu

---

## 💡 Tips chụp ảnh Postman

1. **Hiển thị đầy đủ:**
   - Method và URL phía trên
   - Body/Params nếu có
   - Response Status Code (201, 200, etc.)
   - Response Body đầy đủ

2. **Thứ tự logic:**
   - CREATE trước (để có ID)
   - GET ALL để xem danh sách
   - UPDATE một user cụ thể
   - DELETE user đó

3. **Đảm bảo:**
   - Tất cả requests đều thành công (status 200/201)
   - Có thể thấy rõ data trong response
   - URL và method đúng

---

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB:
```
Error: Could not connect to MongoDB
```
**Giải pháp:**
- Kiểm tra MONGODB_URI trong `.env`
- Đảm bảo IP address được whitelist trong MongoDB Atlas
- Kiểm tra username/password đúng

### Lỗi "User with this email already exists":
**Giải pháp:**
- Đổi email khác trong request body
- Hoặc xóa user cũ trước khi tạo mới

### Port đã được sử dụng:
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Giải pháp:**
- Đổi PORT trong `.env` (ví dụ: 3000, 8080)
- Hoặc tắt process đang chạy port 5000

---

## 📚 Tài liệu tham khảo

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)
- [Postman Documentation](https://learning.postman.com/)

---

## ✉️ Câu hỏi thường gặp

**Q: Collection name phải đặt theo email hay tự động?**
A: Theo yêu cầu, collection name là email của bạn. Mongoose mặc định tạo collection name là số nhiều của model (`User` → `users`). Nếu cần đổi, thêm option trong schema:
```javascript
const User = mongoose.model('User', userSchema, 'your.email@example.com');
```

**Q: Username MongoDB phải là MSSV chính xác?**
A: Đúng, theo yêu cầu đề bài, username MongoDB Atlas phải là MSSV của bạn.

**Q: Có cần file .env khi nộp không?**
A: Không, chỉ nộp file `.js`. File `.env` chứa thông tin nhạy cảm không nên public.

---

**Good luck! 🎉**
