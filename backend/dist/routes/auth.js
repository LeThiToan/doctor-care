"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const rows = await (0, database_1.query)("SELECT id, email, password_hash, full_name FROM users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Tạo JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
            message: "Login successful",
            user: { id: user.id, email: user.email, name: user.full_name },
            token,
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone, dateOfBirth, gender } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        }
        // Kiểm tra email đã tồn tại
        const existingUser = await (0, database_1.query)("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email đã được sử dụng" });
        }
        // Hash password
        const saltRounds = 10;
        const password_hash = await bcryptjs_1.default.hash(password, saltRounds);
        // Tạo user mới với cấu trúc database hiện có
        await (0, database_1.query)("INSERT INTO users (email, password_hash, full_name, phone, date_of_birth, gender, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())", [email, password_hash, name, phone || '', dateOfBirth || '1990-01-01', gender || 'other']);
        res.status(201).json({ message: "Đăng ký thành công" });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Logout
router.post('/logout', (req, res) => {
    res.json({ message: "Logout successful" });
});
exports.default = router;
//# sourceMappingURL=auth.js.map