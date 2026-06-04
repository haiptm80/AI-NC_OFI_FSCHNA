# FPT Education QA/FQA Training Analytics

Đây là hệ thống báo cáo chỉ số và phân tích bằng AI (Gemini) dành cho FPT Education. Hệ thống giúp trực quan hóa dữ liệu từ Google Sheets, cung cấp các biểu đồ Pareto, xu hướng, phân tích phòng ban và trích xuất AI Insight.

## 1. Cách cấu hình nguồn dữ liệu Google Sheets
Trong ứng dụng, nhập ID của Google Sheets public để tải dữ liệu.
Ví dụ Sheet ID: `1kTNK1W1gCd2ZO8EQC-n_FR_zlJ2lLZ-U5E3sm34CtAQ`

Lưu ý: Sheet của bạn cần đảm bảo đã được **Publish to web** (Share > Publish to web > Toàn bộ tài liệu dưới dạng CSV) hoặc Share > "Anyone with the link can view". Ứng dụng đọc dữ liệu qua API mở gviz của Google Sheets. Hệ thống yêu cầu các sheet có tên: `Data`, `Summary`, `2023-2024`, `2024-2025`, `HKI 2025-2026`.

## 2. Cách cấu hình Gemini API Key
Để tính năng phân tích "AI Insight" hoạt động, ứng dụng cần một Gemini API Key hợp lệ.
Mẫu API Key: `AQ.Ab8RN6JN3khDd3iBL3kkaroS9hkxfbUl1ic-SVcpzsRolAr3Ng`
- Tạo file `.env` ở thư mục gốc của dự án nếu chạy local.
- Thêm biến môi trường: `VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE` (Trong ứng dụng thực tế trên môi trường Node.js server, hãy cấu hình `GEMINI_API_KEY`).
- Hiện tại hệ thống đang gọi Gemini qua proxy server backend để phân tích (hoặc trực tiếp qua SDK tuỳ kiến trúc). Bạn hãy vào cấu hình của ứng dụng để thiết lập.

## 3. Cách deploy lên Vercel
Dự án được xây dựng với Vite & React (Client-side tĩnh có thể dễ dàng deploy lên Vercel).

1. Đăng nhập vào tài khoản Vercel.
2. Tại dashboard, chọn **Add New...** > **Project**.
3. Kết nối với repository GitHub, GitLab hoặc Bitbucket chứa mã nguồn, hoặc sử dụng Vercel CLI ở thư mục code `npx vercel`.
4. Cấu hình dự án:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Trong mục **Environment Variables**, thêm biến môi trường nếu có.
6. Nhấn **Deploy**.

Sau khi deploy thành công, bạn sẽ được cấp một đường dẫn URL public để sử dụng và chia sẻ ứng dụng.
