"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const { specialty } = req.query;
        let sql = `
      SELECT id, name, title, specialty, experience, rating, reviews, price, avatar, education, languages, description
      FROM doctors
    `;
        let params = [];
        if (specialty) {
            sql += " WHERE specialty = ?";
            params.push(specialty);
        }
        const rows = await (0, database_1.query)(sql, params);
        const doctors = rows.map((doc) => ({
            ...doc,
            education: doc.education ? JSON.parse(doc.education) : [],
            languages: doc.languages ? JSON.parse(doc.languages) : [],
            rating: doc.rating ? Number(doc.rating) : 0,
            reviews: doc.reviews ? Number(doc.reviews) : 0,
        }));
        res.json(doctors);
    }
    catch (error) {
        console.error("API doctors error:", error);
        res.status(500).json({
            error: "Không thể lấy danh sách bác sĩ"
        });
    }
});
// Get unavailable times for a doctor on a specific date
router.get('/:id/unavailable-times', async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: "Ngày không được để trống" });
        }
        // Lấy tất cả appointments đã được đặt cho bác sĩ này trong ngày
        const rows = await (0, database_1.query)(`SELECT appointment_time, status 
             FROM appointments 
             WHERE doctor_id = ? AND appointment_date = ? 
             AND status IN ('pending', 'confirmed', 'completed')
             ORDER BY appointment_time`, [id, date]);
        // Trả về danh sách thời gian đã hết
        const unavailableTimes = rows.map(row => row.appointment_time);
        res.json({
            doctor_id: id,
            date,
            unavailable_times: unavailableTimes,
            total_booked: rows.length
        });
    }
    catch (err) {
        console.error("Get unavailable times error:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.default = router;
//# sourceMappingURL=doctors.js.map