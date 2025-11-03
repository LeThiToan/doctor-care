-- ============================================
-- File SQL đầy đủ cho database medbooking
-- Bao gồm tất cả các bảng và dữ liệu mẫu
-- ============================================

-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS medbooking;
USE medbooking;

-- ============================================
-- 1. BẢNG USERS (Người dùng/Bệnh nhân)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. BẢNG SPECIALTIES (Chuyên khoa)
-- ============================================
CREATE TABLE IF NOT EXISTS specialties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50)
);

-- ============================================
-- 3. BẢNG DOCTORS (Bác sĩ)
-- ============================================
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    specialty VARCHAR(255),
    experience VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    reviews INT DEFAULT 0,
    price VARCHAR(100),
    avatar VARCHAR(255),
    education JSON,
    languages JSON,
    description TEXT,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 4. BẢNG DOCTOR_ACCOUNT (Tài khoản Bác sĩ)
-- ============================================
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

-- ============================================
-- 5. BẢNG APPOINTMENTS (Lịch hẹn)
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20),
    patient_email VARCHAR(255),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    symptoms TEXT,
    doctor_id INT,
    specialty VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    rating INT,
    cancel_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- ============================================
-- DỮ LIỆU MẪU
-- ============================================

-- Thêm dữ liệu mẫu cho specialties
INSERT INTO specialties (name, description, icon, color) VALUES
('Tim mạch', 'Chuyên khoa tim mạch và huyết áp', 'Heart', 'text-red-500'),
('Nhi khoa', 'Chuyên khoa trẻ em', 'Baby', 'text-blue-500'),
('Sản phụ khoa', 'Chuyên khoa phụ nữ', 'Users', 'text-pink-500'),
('Thần kinh', 'Chuyên khoa thần kinh', 'Brain', 'text-purple-500'),
('Tiêu hóa', 'Chuyên khoa tiêu hóa', 'Stomach', 'text-green-500')
ON DUPLICATE KEY UPDATE name=name;

-- Thêm dữ liệu mẫu cho doctors
INSERT INTO doctors (
    name, 
    title, 
    specialty, 
    experience, 
    rating, 
    reviews, 
    price, 
    avatar, 
    education, 
    languages, 
    description,
    email,
    password_hash,
    is_active
) VALUES 
(
    'BS. Nguyễn Văn An', 
    'Bác sĩ chuyên khoa I', 
    'Tim mạch', 
    '15 năm kinh nghiệm', 
    4.8, 
    120, 
    '300.000đ', 
    'bs1.jpg', 
    '["Đại học Y Hà Nội", "Thạc sĩ Tim mạch"]', 
    '["Tiếng Việt", "Tiếng Anh"]', 
    'Chuyên gia tim mạch với hơn 15 năm kinh nghiệm',
    'bs.nguyenvanan@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    TRUE
),
(
    'BS. Trần Thị Bình', 
    'Bác sĩ chuyên khoa II', 
    'Nhi khoa', 
    '12 năm kinh nghiệm', 
    4.9, 
    95, 
    '250.000đ', 
    'bs2.jpg', 
    '["Đại học Y TP.HCM", "Chứng chỉ Nhi khoa"]', 
    '["Tiếng Việt", "Tiếng Anh"]', 
    'Bác sĩ nhi khoa tận tâm với trẻ em',
    'bs.tranthibinh@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    TRUE
),
(
    'PGS.TS. Lê Minh Cường', 
    'Phó Giáo sư, Tiến sĩ', 
    'Thần kinh', 
    '20 năm kinh nghiệm', 
    4.7, 
    150, 
    '500.000đ', 
    'bs3.jpg', 
    '["Đại học Y Hà Nội", "Tiến sĩ Thần kinh", "Học bổng Harvard"]', 
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"]', 
    'Chuyên gia thần kinh hàng đầu Việt Nam',
    'pgs.leminhcuong@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    TRUE
)
ON DUPLICATE KEY UPDATE name=name;

-- Thêm dữ liệu mẫu cho doctor_account
-- Map với các bác sĩ đã có trong bảng doctors (id: 1, 2, 3)
INSERT INTO doctor_account (name, email, password, doctor_id, is_active) VALUES
('BS. Nguyễn Văn An', 'bs.nguyenvanan@medbooking.com', 'password', 1, TRUE),
('BS. Trần Thị Bình', 'bs.tranthibinh@medbooking.com', 'password', 2, TRUE),
('PGS.TS. Lê Minh Cường', 'pgs.leminhcuong@medbooking.com', 'password', 3, TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- KẾT THÚC
-- ============================================

