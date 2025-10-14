import { NextResponse } from "next/server"
import { query } from "@/lib/db" // Đường dẫn đến file bạn vừa gửi (kết nối MySQL)

export async function GET() {
    try {
        const specialties = await query("SELECT * FROM specialties")
        return NextResponse.json(specialties)
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chuyên khoa:", error)
        return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
    }
}
