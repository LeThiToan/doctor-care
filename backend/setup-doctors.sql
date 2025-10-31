-- Tạo bảng doctors với thông tin đăng nhập
USE medbooking;

-- Cập nhật bảng doctors để có thông tin đăng nhập
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Thêm dữ liệu mẫu cho bác sĩ với thông tin đăng nhập
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
);
