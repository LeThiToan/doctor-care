import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const {
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
        } = await req.json()

        if (
            !patient_name ||
            !patient_phone ||
            !patient_email ||
            !doctor_id ||
            !specialty ||
            !appointment_date ||
            !appointment_time
        ) {
            return NextResponse.json({ message: "Thiếu thông tin bắt buộc" }, { status: 400 })
        }

        await query(
            `INSERT INTO appointments (
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
            [
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
            ]
        )

        return NextResponse.json({ message: "Đặt lịch thành công" }, { status: 201 })
    } catch (error) {
        console.error("Lỗi khi đặt lịch:", error)
        return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 })
    }
}
