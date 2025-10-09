// app/api/doctors/route.ts
import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const specialty = searchParams.get("specialty")

        let sql = `
      SELECT id, name, title, specialty, experience, rating, reviews, price, avatar, education, languages, description
      FROM doctors
    `
        let params: any[] = []

        if (specialty) {
            sql += " WHERE specialty = ?"
            params.push(specialty)
        }

        const rows = await query(sql, params)

        const doctors = (rows as any[]).map((doc) => ({
            ...doc,
            education: doc.education ? JSON.parse(doc.education) : [],
            languages: doc.languages ? JSON.parse(doc.languages) : [],
            rating: doc.rating ? Number(doc.rating) : 0,
            reviews: doc.reviews ? Number(doc.reviews) : 0,
        }))

        return NextResponse.json(doctors)
    } catch (error) {
        console.error("API doctors error:", error)
        return NextResponse.json(
            { error: "Không thể lấy danh sách bác sĩ" },
            { status: 500 }
        )
    }
}
