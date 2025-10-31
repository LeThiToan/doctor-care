import { Router } from 'express'
import { query } from '../config/database'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const specialties = await query("SELECT * FROM specialties")
        res.json(specialties)
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chuyên khoa:", error)
        res.status(500).json({ message: "Lỗi server" })
    }
})

export default router
