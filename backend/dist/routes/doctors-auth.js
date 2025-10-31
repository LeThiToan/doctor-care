"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
// Doctor Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const rows = await (0, database_1.query)("SELECT id, name, email, password FROM doctor_account WHERE email = ?", [email]);
        const doctor = rows[0];
        if (!doctor) {
            return res.status(404).json({ error: "Bác sĩ không tồn tại" });
        }
        // So sánh mật khẩu (không hash trong database hiện tại)
        if (password !== doctor.password) {
            return res.status(401).json({ error: "Mật khẩu không đúng" });
        }
        // Tạo JWT token
        const token = jsonwebtoken_1.default.sign({
            id: doctor.id,
            email: doctor.email,
            role: 'doctor'
        }, JWT_SECRET, { expiresIn: "8h" });
        res.json({
            message: "Đăng nhập thành công",
            doctor: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email
            },
            token,
        });
    }
    catch (err) {
        console.error("Doctor login error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
// Doctor Logout
router.post('/logout', (req, res) => {
    res.json({ message: "Đăng xuất thành công" });
});
// Get Doctor Profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: "Token không được cung cấp" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role !== 'doctor') {
            return res.status(403).json({ error: "Không có quyền truy cập" });
        }
        const rows = await (0, database_1.query)("SELECT id, name, email FROM doctor_account WHERE id = ?", [decoded.id]);
        const doctor = rows[0];
        if (!doctor) {
            return res.status(404).json({ error: "Bác sĩ không tồn tại" });
        }
        res.json({ doctor });
    }
    catch (err) {
        console.error("Get doctor profile error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
// Get Doctor Appointments
router.get('/appointments', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: "Token không được cung cấp" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role !== 'doctor') {
            return res.status(403).json({ error: "Không có quyền truy cập" });
        }
        // Lấy doctor_id từ doctor_account
        const doctorAccountRows = await (0, database_1.query)("SELECT doctor_id FROM doctor_account WHERE id = ?", [decoded.id]);
        if (doctorAccountRows.length === 0 || !doctorAccountRows[0].doctor_id) {
            return res.status(404).json({ error: "Bác sĩ chưa được map với bảng doctors" });
        }
        const doctorId = doctorAccountRows[0].doctor_id;
        // Lấy appointments theo doctor_id
        const rows = await (0, database_1.query)(`SELECT
        a.id,
        a.patient_name,
        a.patient_phone,
        a.patient_email,
        a.date_of_birth,
        a.gender,
        a.symptoms,
        a.specialty,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.cancel_reason,
        a.created_at
      FROM appointments a
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
      LIMIT 50`, [doctorId]);
        res.json(rows);
    }
    catch (err) {
        console.error("Get doctor appointments error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
// Update Appointment Status
router.put('/appointments/:id/status', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: "Token không được cung cấp" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role !== 'doctor') {
            return res.status(403).json({ error: "Không có quyền truy cập" });
        }
        const { id } = req.params;
        const { status } = req.body;
        // Lấy doctor_id từ doctor_account
        const doctorAccountRows = await (0, database_1.query)("SELECT doctor_id FROM doctor_account WHERE id = ?", [decoded.id]);
        if (doctorAccountRows.length === 0 || !doctorAccountRows[0].doctor_id) {
            return res.status(404).json({ error: "Bác sĩ chưa được map với bảng doctors" });
        }
        const doctorId = doctorAccountRows[0].doctor_id;
        // Kiểm tra xem appointment có tồn tại và thuộc về bác sĩ này không
        const appointmentRows = await (0, database_1.query)(`SELECT a.id, a.doctor_id 
             FROM appointments a
             WHERE a.id = ? AND a.doctor_id = ?`, [id, doctorId]);
        if (appointmentRows.length === 0) {
            return res.status(404).json({ error: "Lịch hẹn không tồn tại hoặc không thuộc về bác sĩ này" });
        }
        // Cập nhật trạng thái
        await (0, database_1.query)(`UPDATE appointments 
             SET status = ? 
             WHERE id = ? AND doctor_id = ?`, [status, id, doctorId]);
        res.json({ message: "Cập nhật trạng thái thành công" });
    }
    catch (err) {
        console.error("Update appointment status error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=doctors-auth.js.map