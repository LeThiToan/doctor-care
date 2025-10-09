import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {
            specialty,
            doctorId,
            doctorName,
            doctorTitle,
            appointmentDate,
            appointmentTime,
            price,
            patientInfo,
        } = body

        const result = await query(
            `INSERT INTO appointments 
      (specialty, doctor_id, doctor_name, doctor_title, appointment_date, appointment_time, price,
       patient_name, patient_phone, patient_email, patient_dob, patient_gender, patient_symptoms, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                specialty,
                doctorId,
                doctorName,
                doctorTitle,
                appointmentDate,
                appointmentTime,
                price,
                patientInfo.fullName,
                patientInfo.phone,
                patientInfo.email,
                patientInfo.dateOfBirth,
                patientInfo.gender,
                patientInfo.symptoms || null,
            ]
        )

        return NextResponse.json({ success: true, id: (result as any).insertId })
    } catch (error) {
        console.error("API appointments error:", error)
        return NextResponse.json({ error: "Không thể lưu lịch hẹn" }, { status: 500 })
    }
}
