import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const doctorId = searchParams.get("doctor_id")
        const date = searchParams.get("date")

        if (!doctorId || !date) {
            return NextResponse.json({ error: "Thiếu thông tin bác sĩ hoặc ngày" }, { status: 400 })
        }

        // 🟢 Dùng DATE() để so khớp chính xác dù appointment_date là DATETIME
        const bookedSlots = await query(
            `SELECT appointment_time 
       FROM appointments 
       WHERE doctor_id = ? 
       AND DATE(appointment_date) = ? 
       AND status IN ('pending', 'confirmed')`,
            [doctorId, date]
        )

        // Ép kiểu mảng chắc chắn
        const bookedTimes = Array.isArray(bookedSlots)
            ? bookedSlots.map((row: any) => row.appointment_time)
            : []

        return NextResponse.json({ bookedTimes })
    } catch (error) {
        console.error("Lỗi khi kiểm tra giờ trống:", error)
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
    }
}
