import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "@/lib/db"
import { RowDataPacket } from "mysql2"

interface UserRow extends RowDataPacket {
    id: number
    email: string
    password_hash: string
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        const rows = await query(
            "SELECT id, email, password_hash FROM users WHERE email = ?",
            [email]
        ) as UserRow[]

        const user = rows[0]

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // 👉 Tạo JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        )

        return NextResponse.json({
            message: "Login successful",
            user: { id: user.id, email: user.email },
            token, // gửi về FE
        })
    } catch (err: any) {
        console.error("Login error:", err)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
