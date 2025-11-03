-- Tạo bảng doctor_account cho tài khoản đăng nhập của bác sĩ
USE medbooking;

-- Tạo bảng doctor_account
CREATE TABLE IF NOT EXISTS doctor_account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    doctor_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Thêm dữ liệu mẫu cho tài khoản bác sĩ
-- Map với các bác sĩ đã có trong bảng doctors (id: 1, 2, 3)
INSERT INTO doctor_account (name, email, password, doctor_id, is_active) VALUES
('BS. Nguyễn Văn An', 'bs.nguyenvanan@medbooking.com', 'password', 1, TRUE),
('BS. Trần Thị Bình', 'bs.tranthibinh@medbooking.com', 'password', 2, TRUE),
('PGS.TS. Lê Minh Cường', 'pgs.leminhcuong@medbooking.com', 'password', 3, TRUE);

