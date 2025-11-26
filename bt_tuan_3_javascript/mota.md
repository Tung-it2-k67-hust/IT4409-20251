
## Cấu trúc thư mục
- index.html — giao diện + logic JS chính.
- style.css — style (hiện chưa link trong index.html, có style nội tuyến).
- sinhvien.json — danh sách sinh viên (mảng object: { sid, name, dob }).
- hocphan.json — danh sách học phần (mảng object: { cid, name, credits }).
- ketqua.json — kết quả (mảng object: { sid, cid, term, score }).


## Luồng xử lý (khi nhấn "Tra cứu")
1. Lấy mã sinh viên từ ô input.
2. Kiểm tra cache (localStorage với key = mã sinh viên). Nếu có thì dùng luôn.
3. Nếu không có, fetch song song 3 file JSON bằng Promise.all.
4. Tìm sinh viên trong danh sách, lọc kết quả theo sid, gộp với thông tin học phần.
5. Chuyển điểm số sang điểm chữ bằng hàm `convertScore(score)`.
6. Lưu dữ liệu đã gộp vào localStorage và render ra HTML.

## Xử lý bất đồng bộ
- Hàm `fetchWithDelay(url, delay)` dùng `fetch()` nhưng bọc trong Promise + setTimeout để mô phỏng độ trễ.
- Dùng `Promise.all([...])` để tải 3 file cùng lúc và chờ tất cả hoàn thành — nhanh hơn tải tuần tự.
- Nếu một trong các fetch lỗi thì sẽ vào catch chung, hiển thị lỗi.



