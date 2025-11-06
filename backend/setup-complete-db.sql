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
('Tiêu hóa', 'Chuyên khoa tiêu hóa', 'Stomach', 'text-green-500'),
('Da liễu', 'Chuyên khoa da liễu và thẩm mỹ', 'Sparkles', 'text-yellow-500'),
('Tai mũi họng', 'Chuyên khoa tai mũi họng', 'Ear', 'text-orange-500'),
('Mắt', 'Chuyên khoa mắt', 'Eye', 'text-indigo-500'),
('Xương khớp', 'Chuyên khoa xương khớp', 'Bone', 'text-gray-500'),
('Ung bướu', 'Chuyên khoa ung bướu', 'Activity', 'text-red-600'),
('Nội tiết', 'Chuyên khoa nội tiết', 'Droplet', 'text-blue-600'),
('Tâm thần', 'Chuyên khoa tâm thần', 'Brain', 'text-purple-600'),
('Răng hàm mặt', 'Chuyên khoa răng hàm mặt', 'Smile', 'text-teal-500'),
('Y học cổ truyền', 'Y học cổ truyền', 'Leaf', 'text-green-600'),
('Vật lý trị liệu', 'Vật lý trị liệu và phục hồi chức năng', 'Activity', 'text-cyan-500')
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
),
(
    'TS.BS. Phạm Thị Dung',
    'Tiến sĩ, Bác sĩ chuyên khoa II',
    'Sản phụ khoa',
    '18 năm kinh nghiệm',
    4.9,
    180,
    '350.000đ',
    'bs6.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Sản phụ khoa", "Chứng chỉ siêu âm"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Bác sĩ sản phụ khoa giàu kinh nghiệm, chuyên về sinh sản và điều trị vô sinh',
    'ts.phamthidung@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Hoàng Văn Đức',
    'Bác sĩ chuyên khoa I',
    'Tiêu hóa',
    '14 năm kinh nghiệm',
    4.8,
    135,
    '320.000đ',
    'bs7.jpg',
    '["Đại học Y TP.HCM", "Thạc sĩ Tiêu hóa", "Chứng chỉ nội soi"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên gia về bệnh lý đường tiêu hóa và gan mật',
    'bs.hoangvanduc@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Nguyễn Thị Hoa',
    'Bác sĩ chuyên khoa II',
    'Da liễu',
    '10 năm kinh nghiệm',
    4.9,
    165,
    '280.000đ',
    'bs8.jpg',
    '["Đại học Y Hà Nội", "Chứng chỉ Da liễu", "Chứng chỉ Thẩm mỹ"]',
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Hàn"]',
    'Bác sĩ da liễu chuyên về điều trị mụn và da liễu thẩm mỹ',
    'bs.nguyenthihoa@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'PGS.TS. Trần Văn Hùng',
    'Phó Giáo sư, Tiến sĩ',
    'Tai mũi họng',
    '22 năm kinh nghiệm',
    4.8,
    200,
    '450.000đ',
    'bs9.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Tai mũi họng", "Học bổng Singapore"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên gia phẫu thuật tai mũi họng và chỉnh hình',
    'pgs.tranvanhung@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Lê Thị Lan',
    'Bác sĩ chuyên khoa I',
    'Mắt',
    '12 năm kinh nghiệm',
    4.7,
    110,
    '300.000đ',
    'bs10.jpg',
    '["Đại học Y TP.HCM", "Thạc sĩ Nhãn khoa", "Chứng chỉ phẫu thuật mắt"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Bác sĩ mắt chuyên về phẫu thuật đục thủy tinh thể và khúc xạ',
    'bs.lethilan@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'TS.BS. Phạm Văn Long',
    'Tiến sĩ, Bác sĩ chuyên khoa II',
    'Xương khớp',
    '16 năm kinh nghiệm',
    4.8,
    145,
    '380.000đ',
    'bs11.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Xương khớp", "Chứng chỉ phẫu thuật"]',
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"]',
    'Chuyên gia về bệnh lý xương khớp và phẫu thuật chỉnh hình',
    'ts.phamvanlong@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'GS.TS. Nguyễn Thị Mai',
    'Giáo sư, Tiến sĩ',
    'Ung bướu',
    '25 năm kinh nghiệm',
    4.9,
    220,
    '600.000đ',
    'bs12.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Ung bướu", "Học bổng Mỹ", "Chứng chỉ hóa trị"]',
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"]',
    'Chuyên gia hàng đầu về điều trị ung thư và hóa trị',
    'gs.nguyenthimai@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Trần Văn Nam',
    'Bác sĩ chuyên khoa I',
    'Nội tiết',
    '11 năm kinh nghiệm',
    4.6,
    95,
    '270.000đ',
    'bs13.jpg',
    '["Đại học Y TP.HCM", "Thạc sĩ Nội tiết", "Chứng chỉ đái tháo đường"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên điều trị bệnh đái tháo đường và rối loạn nội tiết',
    'bs.tranvannam@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'TS.BS. Lê Thị Oanh',
    'Tiến sĩ, Bác sĩ chuyên khoa II',
    'Tâm thần',
    '15 năm kinh nghiệm',
    4.7,
    125,
    '330.000đ',
    'bs14.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Tâm thần", "Chứng chỉ tâm lý trị liệu"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên gia về tâm thần học và tâm lý trị liệu',
    'ts.lethioanh@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Phạm Văn Phong',
    'Bác sĩ chuyên khoa I',
    'Răng hàm mặt',
    '9 năm kinh nghiệm',
    4.8,
    140,
    '290.000đ',
    'bs15.jpg',
    '["Đại học Y Hà Nội", "Thạc sĩ Răng hàm mặt", "Chứng chỉ implant"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên về phẫu thuật răng hàm mặt và cấy ghép implant',
    'bs.phamvanphong@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Nguyễn Thị Quỳnh',
    'Bác sĩ chuyên khoa II',
    'Y học cổ truyền',
    '13 năm kinh nghiệm',
    4.8,
    115,
    '250.000đ',
    'bon.jpg',
    '["Đại học Y Hà Nội", "Chứng chỉ Y học cổ truyền", "Châm cứu"]',
    '["Tiếng Việt", "Tiếng Trung"]',
    'Bác sĩ y học cổ truyền chuyên về châm cứu và bấm huyệt',
    'bs.nguyenthiquynh@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Trần Văn Sơn',
    'Bác sĩ chuyên khoa I',
    'Vật lý trị liệu',
    '8 năm kinh nghiệm',
    4.6,
    88,
    '240.000đ',
    'default.png',
    '["Đại học Y TP.HCM", "Thạc sĩ Vật lý trị liệu", "Chứng chỉ phục hồi chức năng"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên về phục hồi chức năng và vật lý trị liệu',
    'bs.tranvanson@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'TS.BS. Lê Văn Tài',
    'Tiến sĩ, Bác sĩ chuyên khoa II',
    'Tim mạch',
    '19 năm kinh nghiệm',
    4.9,
    195,
    '420.000đ',
    'bs6.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Tim mạch", "Chứng chỉ can thiệp tim mạch"]',
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Đức"]',
    'Chuyên gia can thiệp tim mạch và điều trị nhồi máu cơ tim',
    'ts.levantai@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Phạm Thị Uyên',
    'Bác sĩ chuyên khoa I',
    'Nhi khoa',
    '10 năm kinh nghiệm',
    4.9,
    175,
    '260.000đ',
    'bs7.jpg',
    '["Đại học Y TP.HCM", "Thạc sĩ Nhi khoa", "Chứng chỉ sơ sinh"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên về nhi khoa sơ sinh và trẻ sơ sinh non tháng',
    'bs.phamthiuyen@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'PGS.TS. Nguyễn Văn Vinh',
    'Phó Giáo sư, Tiến sĩ',
    'Thần kinh',
    '21 năm kinh nghiệm',
    4.8,
    185,
    '480.000đ',
    'bs8.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Thần kinh", "Học bổng Nhật Bản", "Chứng chỉ phẫu thuật thần kinh"]',
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Nhật"]',
    'Chuyên gia phẫu thuật thần kinh và điều trị đột quỵ',
    'pgs.nguyenvanvinh@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Trần Thị Xuân',
    'Bác sĩ chuyên khoa II',
    'Sản phụ khoa',
    '14 năm kinh nghiệm',
    4.8,
    160,
    '340.000đ',
    'bs9.jpg',
    '["Đại học Y TP.HCM", "Chứng chỉ Sản phụ khoa", "Chứng chỉ siêu âm 4D"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên về siêu âm thai và điều trị hiếm muộn',
    'bs.tranthixuan@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Lê Văn Yên',
    'Bác sĩ chuyên khoa I',
    'Tiêu hóa',
    '11 năm kinh nghiệm',
    4.7,
    105,
    '310.000đ',
    'bs10.jpg',
    '["Đại học Y Hà Nội", "Thạc sĩ Tiêu hóa", "Chứng chỉ nội soi can thiệp"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên về nội soi tiêu hóa và điều trị xuất huyết tiêu hóa',
    'bs.levanyen@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'TS.BS. Phạm Thị An',
    'Tiến sĩ, Bác sĩ chuyên khoa II',
    'Da liễu',
    '17 năm kinh nghiệm',
    4.9,
    190,
    '360.000đ',
    'bs11.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Da liễu", "Chứng chỉ laser", "Học bổng Hàn Quốc"]',
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Hàn"]',
    'Chuyên về điều trị bằng laser và da liễu thẩm mỹ cao cấp',
    'ts.phamthian@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Nguyễn Văn Bình',
    'Bác sĩ chuyên khoa I',
    'Tai mũi họng',
    '9 năm kinh nghiệm',
    4.6,
    92,
    '275.000đ',
    'bs12.jpg',
    '["Đại học Y TP.HCM", "Thạc sĩ Tai mũi họng", "Chứng chỉ nội soi"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên về nội soi tai mũi họng và điều trị viêm amidan',
    'bs.nguyenvanbinh@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'PGS.TS. Trần Thị Cẩm',
    'Phó Giáo sư, Tiến sĩ',
    'Mắt',
    '23 năm kinh nghiệm',
    4.9,
    210,
    '550.000đ',
    'bs13.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Nhãn khoa", "Học bổng Mỹ", "Chứng chỉ phẫu thuật Lasik"]',
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"]',
    'Chuyên gia hàng đầu về phẫu thuật Lasik và điều trị võng mạc',
    'pgs.tranthicam@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'BS. Lê Văn Dũng',
    'Bác sĩ chuyên khoa II',
    'Xương khớp',
    '12 năm kinh nghiệm',
    4.7,
    130,
    '370.000đ',
    'bs14.jpg',
    '["Đại học Y TP.HCM", "Chứng chỉ Xương khớp", "Chứng chỉ nội soi khớp"]',
    '["Tiếng Việt", "Tiếng Anh"]',
    'Chuyên về nội soi khớp và điều trị thoái hóa khớp',
    'bs.levandung@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
),
(
    'TS.BS. Phạm Thị Em',
    'Tiến sĩ, Bác sĩ chuyên khoa II',
    'Ung bướu',
    '18 năm kinh nghiệm',
    4.8,
    170,
    '580.000đ',
    'bs15.jpg',
    '["Đại học Y Hà Nội", "Tiến sĩ Ung bướu", "Chứng chỉ xạ trị", "Học bổng châu Âu"]',
    '["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"]',
    'Chuyên gia về xạ trị và điều trị ung thư vú',
    'ts.phamthiem@medbooking.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
)
ON DUPLICATE KEY UPDATE name=name;

-- Thêm dữ liệu mẫu cho doctor_account
-- Map với các bác sĩ đã có trong bảng doctors (id: 1-23)
INSERT INTO doctor_account (name, email, password, doctor_id, is_active) VALUES
('BS. Nguyễn Văn An', 'bs.nguyenvanan@medbooking.com', 'password', 1, TRUE),
('BS. Trần Thị Bình', 'bs.tranthibinh@medbooking.com', 'password', 2, TRUE),
('PGS.TS. Lê Minh Cường', 'pgs.leminhcuong@medbooking.com', 'password', 3, TRUE),
('TS.BS. Phạm Thị Dung', 'ts.phamthidung@medbooking.com', 'password', 4, TRUE),
('BS. Hoàng Văn Đức', 'bs.hoangvanduc@medbooking.com', 'password', 5, TRUE),
('BS. Nguyễn Thị Hoa', 'bs.nguyenthihoa@medbooking.com', 'password', 6, TRUE),
('PGS.TS. Trần Văn Hùng', 'pgs.tranvanhung@medbooking.com', 'password', 7, TRUE),
('BS. Lê Thị Lan', 'bs.lethilan@medbooking.com', 'password', 8, TRUE),
('TS.BS. Phạm Văn Long', 'ts.phamvanlong@medbooking.com', 'password', 9, TRUE),
('GS.TS. Nguyễn Thị Mai', 'gs.nguyenthimai@medbooking.com', 'password', 10, TRUE),
('BS. Trần Văn Nam', 'bs.tranvannam@medbooking.com', 'password', 11, TRUE),
('TS.BS. Lê Thị Oanh', 'ts.lethioanh@medbooking.com', 'password', 12, TRUE),
('BS. Phạm Văn Phong', 'bs.phamvanphong@medbooking.com', 'password', 13, TRUE),
('BS. Nguyễn Thị Quỳnh', 'bs.nguyenthiquynh@medbooking.com', 'password', 14, TRUE),
('BS. Trần Văn Sơn', 'bs.tranvanson@medbooking.com', 'password', 15, TRUE),
('TS.BS. Lê Văn Tài', 'ts.levantai@medbooking.com', 'password', 16, TRUE),
('BS. Phạm Thị Uyên', 'bs.phamthiuyen@medbooking.com', 'password', 17, TRUE),
('PGS.TS. Nguyễn Văn Vinh', 'pgs.nguyenvanvinh@medbooking.com', 'password', 18, TRUE),
('BS. Trần Thị Xuân', 'bs.tranthixuan@medbooking.com', 'password', 19, TRUE),
('BS. Lê Văn Yên', 'bs.levanyen@medbooking.com', 'password', 20, TRUE),
('TS.BS. Phạm Thị An', 'ts.phamthian@medbooking.com', 'password', 21, TRUE),
('BS. Nguyễn Văn Bình', 'bs.nguyenvanbinh@medbooking.com', 'password', 22, TRUE),
('PGS.TS. Trần Thị Cẩm', 'pgs.tranthicam@medbooking.com', 'password', 23, TRUE),
('BS. Lê Văn Dũng', 'bs.levandung@medbooking.com', 'password', 24, TRUE),
('TS.BS. Phạm Thị Em', 'ts.phamthiem@medbooking.com', 'password', 25, TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- KẾT THÚC
-- ============================================

