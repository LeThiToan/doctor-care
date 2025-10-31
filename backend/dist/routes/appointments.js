"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
// Tạo lịch hẹn
router.post('/', async (req, res) => {
    try {
        const { user_id, patient_name, patient_phone, patient_email, date_of_birth, gender, symptoms, doctor_id, specialty, appointment_date, appointment_time, } = req.body;
        if (!patient_name ||
            !patient_phone ||
            !patient_email ||
            !doctor_id ||
            !specialty ||
            !appointment_date ||
            !appointment_time) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }
        await (0, database_1.query)(`INSERT INTO appointments (
        user_id,
        patient_name,
        patient_phone,
        patient_email,
        date_of_birth,
        gender,
        symptoms,
        doctor_id,
        specialty,
        appointment_date,
        appointment_time,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`, [
            user_id || null,
            patient_name,
            patient_phone,
            patient_email,
            date_of_birth || null,
            gender || null,
            symptoms || null,
            doctor_id,
            specialty,
            appointment_date,
            appointment_time,
        ]);
        // Lấy thông tin bác sĩ để gửi email
        const doctorInfo = await (0, database_1.query)('SELECT name, title FROM doctors WHERE id = ?', [doctor_id]);
        // Gửi email xác nhận cho bệnh nhân (bất đồng bộ, không chờ)
        if (doctorInfo.length > 0 && patient_email) {
            const doctor = doctorInfo[0];
            (0, email_1.sendAppointmentConfirmationEmail)(patient_email, patient_name, doctor.name, doctor.title || '', specialty, appointment_date, appointment_time).catch(err => {
                console.error('❌ Failed to send confirmation email:', err);
                // Không làm lỗi request nếu email fail
            });
        }
        res.status(201).json({ message: "Đặt lịch thành công" });
    }
    catch (error) {
        console.error("Lỗi khi đặt lịch:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});
// Kiểm tra giờ trống
router.get('/available', async (req, res) => {
    try {
        const { doctor_id, date } = req.query;
        if (!doctor_id || !date) {
            return res.status(400).json({ error: "Thiếu thông tin bác sĩ hoặc ngày" });
        }
        // Dùng DATE() để so khớp chính xác dù appointment_date là DATETIME
        const bookedSlots = await (0, database_1.query)(`SELECT appointment_time 
       FROM appointments 
       WHERE doctor_id = ? 
       AND DATE(appointment_date) = ? 
       AND status IN ('pending', 'confirmed')`, [doctor_id, date]);
        // Ép kiểu mảng chắc chắn
        const bookedTimes = Array.isArray(bookedSlots)
            ? bookedSlots.map((row) => row.appointment_time)
            : [];
        res.json({ bookedTimes });
    }
    catch (error) {
        console.error("Lỗi khi kiểm tra giờ trống:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
// Lấy danh sách lịch hẹn của user
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: "Thiếu user_id" });
        }
        const appointments = await (0, database_1.query)(`
            SELECT 
                a.*,
                d.name as doctor_name,
                d.title as doctor_title,
                d.price,
                d.avatar as doctor_avatar
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.user_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [user_id]);
        res.json(appointments);
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
// Cập nhật trạng thái lịch hẹn (hủy lịch)
router.put('/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;
        await (0, database_1.query)("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [id]);
        res.json({ message: "Hủy lịch hẹn thành công" });
    }
    catch (error) {
        console.error("Lỗi khi hủy lịch hẹn:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
// Đánh giá bác sĩ
router.put('/:id/rating', async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating phải từ 1-5" });
        }
        // Cập nhật rating cho appointment
        await (0, database_1.query)("UPDATE appointments SET rating = ? WHERE id = ?", [rating, id]);
        // Cập nhật rating trung bình cho bác sĩ
        const doctorResult = await (0, database_1.query)("SELECT doctor_id FROM appointments WHERE id = ?", [id]);
        if (doctorResult && doctorResult.length > 0) {
            const doctorId = doctorResult[0].doctor_id;
            // Tính rating trung bình
            const ratingResult = await (0, database_1.query)(`
                SELECT AVG(rating) as avg_rating, COUNT(rating) as total_ratings
                FROM appointments 
                WHERE doctor_id = ? AND rating IS NOT NULL
            `, [doctorId]);
            const avgRating = ratingResult[0].avg_rating;
            const totalRatings = ratingResult[0].total_ratings;
            // Cập nhật rating cho bác sĩ
            await (0, database_1.query)("UPDATE doctors SET rating = ?, reviews = ? WHERE id = ?", [avgRating, totalRatings, doctorId]);
        }
        res.json({ message: "Đánh giá thành công" });
    }
    catch (error) {
        console.error("Lỗi khi đánh giá:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=appointments.js.map