import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message, supportType } = req.body

        if (!name || !email || !message || !supportType) {
            return res.status(400).json({ success: false, error: "Thiếu thông tin bắt buộc" })
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

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
        }

        await transporter.sendMail(mailOptions)

        res.json({ success: true })
    } catch (error) {
        console.error("Error sending email:", error)
        res.status(500).json({ success: false, error: "Gửi mail thất bại" })
    }
})

export default router
