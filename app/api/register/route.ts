import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const { fullName, email, phone, dateOfBirth, gender, password } = await req.json()

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insert vào bảng users
        await query(
            `INSERT INTO users (full_name, email, phone, date_of_birth, gender, password_hash, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [fullName, email, phone, dateOfBirth, gender, hashedPassword]
        )

        return NextResponse.json({ message: "Đăng ký thành công" }, { status: 201 })
    } catch (error: any) {
        console.error("Register error:", error)
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
    }
}
