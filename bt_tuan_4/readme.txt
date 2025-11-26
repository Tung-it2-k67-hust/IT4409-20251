Ứng dụng Tra cứu kết quả học tập (React + Vite)
- Component quản lý state: `App` quản lý toàn bộ state chính: studentId, searchId, isLoading, results, student, error.
- Khi useEffect được kích hoạt: useEffect trong `App` được chạy khi `searchId` thay đổi 
(khi người dùng bấm "Tra cứu" và searchId được cập nhật), sẽ fetch 3 file JSON và cập nhật kết quả.
