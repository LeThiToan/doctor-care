import { Router } from 'express'
import { query } from '../config/database'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const { specialty } = req.query

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

        // Ensure rows is always an array
        if (!rows || !Array.isArray(rows)) {
            console.error("Query returned non-array result:", rows)
            return res.status(500).json({
                error: "Lỗi khi truy vấn database"
            })
        }

        const doctors = (rows as any[]).map((doc) => {
            // Parse JSON fields safely
            let education = []
            let languages = []
            
            try {
                if (doc.education) {
                    education = typeof doc.education === 'string' 
                        ? JSON.parse(doc.education) 
                        : doc.education
                }
            } catch (e) {
                console.error('Error parsing education for doctor:', doc.id, e)
                education = []
            }
            
            try {
                if (doc.languages) {
                    languages = typeof doc.languages === 'string' 
                        ? JSON.parse(doc.languages) 
                        : doc.languages
                }
            } catch (e) {
                console.error('Error parsing languages for doctor:', doc.id, e)
                languages = []
            }
            
            return {
                ...doc,
                education,
                languages,
                rating: doc.rating ? Number(doc.rating) : 0,
                reviews: doc.reviews ? Number(doc.reviews) : 0,
            }
        })

        res.json(doctors)
    } catch (error) {
        console.error("API doctors error:", error)
        res.status(500).json({
            error: "Không thể lấy danh sách bác sĩ"
        })
    }
})

// Get doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const rows = await query(
            `SELECT id, name, title, specialty, experience, rating, reviews, price, avatar, education, languages, description
             FROM doctors
             WHERE id = ?`,
            [id]
        ) as any[]

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Không tìm thấy bác sĩ"
            })
        }

        // Parse JSON fields safely
        let education = []
        let languages = []
        
        try {
            if (rows[0].education) {
                education = typeof rows[0].education === 'string' 
                    ? JSON.parse(rows[0].education) 
                    : rows[0].education
            }
        } catch (e) {
            console.error('Error parsing education for doctor:', id, e)
            education = []
        }
        
        try {
            if (rows[0].languages) {
                languages = typeof rows[0].languages === 'string' 
                    ? JSON.parse(rows[0].languages) 
                    : rows[0].languages
            }
        } catch (e) {
            console.error('Error parsing languages for doctor:', id, e)
            languages = []
        }

        const doctor = {
            ...rows[0],
            education,
            languages,
            rating: rows[0].rating ? Number(rows[0].rating) : 0,
            reviews: rows[0].reviews ? Number(rows[0].reviews) : 0,
        }

        res.json(doctor)
    } catch (error) {
        console.error("API get doctor by id error:", error)
        res.status(500).json({
            error: "Không thể lấy thông tin bác sĩ"
        })
    }
})

// Get unavailable times for a doctor on a specific date
router.get('/:id/unavailable-times', async (req, res) => {
    try {
        const { id } = req.params
        const { date } = req.query
        
        if (!date) {
            return res.status(400).json({ error: "Ngày không được để trống" })
        }
        
        // Lấy tất cả appointments đã được đặt cho bác sĩ này trong ngày
        const rows = await query(
            `SELECT TIME_FORMAT(appointment_time, '%H:%i') as appointment_time, status 
             FROM appointments 
             WHERE doctor_id = ? AND appointment_date = ? 
             AND status IN ('pending', 'confirmed', 'completed')
             ORDER BY appointment_time`,
            [id, date]
        ) as any[]
        
        // Trả về danh sách thời gian đã hết (format HH:MM)
        const unavailableTimes = rows.map(row => row.appointment_time)
        
        res.json({
            doctor_id: id,
            date,
            unavailable_times: unavailableTimes,
            total_booked: rows.length
        })
    } catch (err: any) {
        console.error("Get unavailable times error:", err)
        res.status(500).json({ error: "Lỗi server" })
    }
})

export default router
