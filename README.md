# Pickleball Club Management

Ứng dụng quản lý câu lạc bộ Pickleball với các tính năng:
- Quản lý thành viên và sự kiện
- Theo dõi tham gia và phạt thành viên
- Xử lý hình ảnh nhà tài trợ bằng OCR
- Xuất báo cáo thống kê

## Cài đặt

```bash
npm install
```

## Công nghệ sử dụng
- React
- Tesseract.js (OCR)
- LocalStorage để lưu trữ dữ liệu

## Tính năng
- Thêm và quản lý sự kiện
- Theo dõi tham gia của thành viên
- Tính toán tiền phạt tự động
- Nhận dạng văn bản từ hình ảnh nhà tài trợ
- Xuất báo cáo CSV

## Cấu trúc dự án
- `PickleballClub.js`: Component chính quản lý toàn bộ ứng dụng
- `package.json`: Quản lý dependencies
