"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message, supportType } = req.body;
        if (!name || !email || !message || !supportType) {
            return res.status(400).json({ success: false, error: "Thiếu thông tin bắt buộc" });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: "cudecpro@gmail.com",
            subject: `Liên hệ mới (${supportType}): ${subject || "Không có tiêu đề"}`,
            text: `
Loại hỗ trợ: ${supportType}
Họ tên: ${name}
Email: ${email}
Số điện thoại: ${phone || "(Không có)"}

Nội dung:
${message}
      `,
        };
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: "Gửi mail thất bại" });
    }
});
exports.default = router;
//# sourceMappingURL=contact.js.map