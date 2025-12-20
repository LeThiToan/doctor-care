import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { query } from '../config/database'
import { sendPasswordResetEmail } from '../services/email'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const rows = await query(
            "SELECT id, email, password_hash, name FROM users WHERE email = ?",
            [email]
        ) as any[]

        // Ensure rows is always an array
        if (!rows || !Array.isArray(rows)) {
            console.error("Query returned non-array result:", rows)
            return res.status(500).json({ error: "Database error" })
        }

        const user = rows[0]

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.json({
            message: "Login successful",
            user: { id: user.id, email: user.email, name: user.name },
            token,
        })
    } catch (err: any) {
        console.error("Login error:", err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone, dateOfBirth, gender } = req.body

        if (!email || !password || !name) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" })
        }

        // Kiểm tra email đã tồn tại
        const existingUser = await query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        ) as any[]

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email đã được sử dụng" })
        }

        // Hash password
        const saltRounds = 10
        const password_hash = await bcrypt.hash(password, saltRounds)

        // Tạo user mới với cấu trúc database hiện có
        await query(
            "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
            [email, password_hash, name]
        )

        res.status(201).json({ message: "Đăng ký thành công" })
    } catch (err: any) {
        console.error("Register error:", err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// Logout
router.post('/logout', (req, res) => {
    res.json({ message: "Logout successful" })
})

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body as { email?: string }

        if (!email) {
            return res.status(400).json({ error: "Email là bắt buộc" })
        }

        const users = await query(
            "SELECT id, name FROM users WHERE email = ?",
            [email]
        ) as any[]

        if (users.length === 0) {
            return res.json({ message: "Nếu email tồn tại, chúng tôi đã gửi mật khẩu mới tới hộp thư đăng ký" })
        }

        const user = users[0]

        const newPassword = crypto.randomBytes(4).toString('hex')
        const newPasswordHash = await bcrypt.hash(newPassword, 10)

        await query(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [newPasswordHash, user.id]
        )

        const emailResult = await sendPasswordResetEmail(email, user.name || email, newPassword)

        if (!emailResult.success) {
            console.error('❌ Failed to send password reset email:', emailResult.error)
            // Vẫn trả về success để không tiết lộ thông tin về user tồn tại
            // Nhưng log lỗi để admin biết
            return res.status(500).json({ 
                error: emailResult.error || "Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra cấu hình email hoặc thử lại sau." 
            })
        }

        console.log(`✅ Password reset email sent successfully to ${email}`)

        res.json({ message: "Nếu email tồn tại, chúng tôi đã gửi mật khẩu mới tới hộp thư đăng ký" })
    } catch (err: any) {
        console.error("Forgot password error:", err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.post('/change-password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body as {
            email?: string
            currentPassword?: string
            newPassword?: string
        }

        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự" })
        }

        const users = await query(
            "SELECT id, password_hash FROM users WHERE email = ?",
            [email]
        ) as any[]

        if (users.length === 0) {
            return res.status(400).json({ error: "Email không hợp lệ" })
        }

        const user = users[0]
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash)

        if (!isMatch) {
            return res.status(401).json({ error: "Mật khẩu hiện tại không đúng" })
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10)

        await query(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [newPasswordHash, user.id]
        )

        res.json({ message: "Đổi mật khẩu thành công" })
    } catch (err: any) {
        console.error("Change password error:", err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

export default router
