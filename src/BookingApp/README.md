Hệ thống đặt lịch hẹn dịch vụ - Bài tập lớn ReactJS

=== HƯỚNG DẪN SỬ DỤNG ===

1. CÁCH CHẠY TRONG DỰ ÁN REACT HIỆN CÓ:

   - Các file nằm trong thư mục src/BookingApp/
   - Import và sử dụng App component trong ứng dụng chính
   - Ví dụ: import BookingApp from './BookingApp/App'

2. CẤU TRÚC FILE:

   - data.js: Quản lý localStorage (lưu/đọc dữ liệu)
   - BookingForm.jsx: Form đặt lịch hẹn cho khách hàng
   - AdminPanel.jsx: Quản lý nhân viên, dịch vụ (thêm/sửa/xóa)
   - Dashboard.jsx: Hiển thị danh sách lịch hẹn, thống kê, đánh giá
   - App.jsx: Component chính tổ hợp toàn bộ
   - App.css: Style tối thiểu (flexbox, table)

3. CHỨC NĂNG CHÍNH:

   a) Đặt lịch hẹn:

   - Khách hàng nhập thông tin (tên, SĐT)
   - Chọn dịch vụ, nhân viên, ngày giờ
   - Hệ thống tự kiểm tra trùng lịch:
     - Kiểm tra nhân viên có làm việc vào ngày đó
     - Kiểm tra hết số khách trong ngày chưa
     - Kiểm tra trùng giờ với khách khác

   b) Quản lý nhân viên:

   - Thêm nhân viên: tên, chuyên môn, max khách/ngày, lịch trực
   - Sửa thông tin nhân viên
   - Xóa nhân viên khỏi hệ thống
   - Lịch trực: chọn các ngày trong tuần làm việc (CN=0 đến Th7=6)

   c) Quản lý dịch vụ:

   - Thêm dịch vụ: tên, thời lượng (phút), giá (VND)
   - Sửa thông tin dịch vụ
   - Xóa dịch vụ

   d) Quản lý lịch hẹn:

   - Xem danh sách lịch hẹn (lọc theo trạng thái)
   - Cập nhật trạng thái: pending → approved → completed → cancelled
   - Đánh giá/phản hồi cho lịch đã hoàn thành (1-5 sao)
   - Xóa lịch hẹn

   e) Thống kê:

   - Tổng số lịch hẹn
   - Số lịch hẹn đã hoàn thành
   - Tổng doanh thu (từ các lịch completed)
   - Đánh giá trung bình từ khách hàng

4. DỮ LIỆU MẶC ĐỊNH:

   Nhân viên mặc định:

   - Nguyễn Văn A (Dạy vẽ): 5 khách/ngày, làm Th2-Th6
   - Trần Thị B (Thiết kế): 4 khách/ngày, làm CN-Th6
   - Phạm Văn C (Lập trình): 3 khách/ngày, làm Th2-Th5

   Dịch vụ mặc định:

   - Dạy vẽ cơ bản: 60 phút, 200k
   - Thiết kế logo: 120 phút, 500k
   - Tư vấn lập trình: 45 phút, 300k
   - Lớp tiếng Anh: 90 phút, 250k

5. LƯU TRỮ DỮ LIỆU:

   - Tất cả dữ liệu lưu trong localStorage
   - Khi reload trang, dữ liệu vẫn giữ nguyên
   - Để reset, mở DevTools > Application > Storage > Clear All

6. PHONG CÁCH VIẾT CODE:

   - Không có comment
   - Chỉ dùng useState, useEffect (không useContext, useReducer)
   - Tên biến tiếng Việt, trực tiếp: dsNhanVien, lichHen, setLich...
   - Logic map/filter/find viết trong component
   - CSS tối thiểu, chỉ flexbox/grid/table, không UI library
   - Trông như sinh viên tự tay làm

7. LOGIC KIỂM TRA TRÙNG LỊCH (CẬP NHẬT CHẶT CHẼ):

   - Hàm checkAvailability trong data.js
   - Kiểm tra theo thứ tự:
     1. Nhân viên có làm việc vào ngày đó không?
     2. Nhân viên đã đủ số khách trong ngày chưa?
     3. Khung giờ có trùng với khách khác không?
   - Chỉ tính các lịch có status !== 'cancelled'

8. TRẠNG THÁI LỊCH HẸN:
   - pending: Chưa xác nhận
   - approved: Đã xác nhận
   - completed: Đã hoàn thành (có thể đánh giá)
   - cancelled: Đã hủy (không tính vào doanh thu/thống kê)

=== LƯU Ý ===

- Không dùng async/await, Promise (nếu không cần thiết)
- Không dùng third-party UI library (AntD, MUI, Bootstrap)
- Không dùng Tailwind CSS hoặc utility CSS
- Giữ code đơn giản, dễ hiểu
- File HTML standalone có thể tạo riêng nếu cần chạy độc lập

=== KIỂM TRA CHỨC NĂNG === Test case:

1. Tạo 1 nhân viên, 1 dịch vụ
2. Đặt lịch hẹn hợp lệ → thành công
3. Đặt lịch hẹn trùng giờ → báo lỗi
4. Đặt >5 lịch cùng ngày (max 5 khách/ngày) → báo lỗi lịch tới
5. Đặt lịch vào ngày không làm việc → báo lỗi
6. Cập nhật lịch → completed → đánh giá → kiểm tra average rating
7. Reload trang → dữ liệu vẫn còn
