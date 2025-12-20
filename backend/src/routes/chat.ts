import { Router, Request, Response, NextFunction } from 'express'
import { query } from '../config/database'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

// Interface để mở rộng Request
interface AuthenticatedRequest extends Request {
    user: {
        id: number
        email: string
        role?: string
    }
}

// Middleware để verify JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization
    
    if (!token) {
        return res.status(401).json({ error: "Token không được cung cấp" })
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role?: string }
        ;(req as AuthenticatedRequest).user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: "Token không hợp lệ" })
    }
}

// Tạo hoặc lấy chat room giữa user và doctor
router.post('/rooms', verifyToken, async (req: Request, res: Response) => {
    try {
        const { doctor_id } = req.body
        const authReq = req as AuthenticatedRequest
        if (!authReq.user) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const user_id = authReq.user.id
        
        if (!doctor_id) {
            return res.status(400).json({ error: "doctor_id là bắt buộc" })
        }
        
        // Kiểm tra xem chat room đã tồn tại chưa
        const existingRoom = await query(
            `SELECT id FROM chat_rooms WHERE user_id = ? AND doctor_id = ?`,
            [user_id, doctor_id]
        ) as any[]
        
        if (existingRoom.length > 0) {
            return res.json({ room_id: existingRoom[0].id })
        }
        
        // Tạo chat room mới
        const result = await query(
            `INSERT INTO chat_rooms (user_id, doctor_id) VALUES (?, ?)`,
            [user_id, doctor_id]
        ) as any
        
        res.json({ room_id: result.insertId })
    } catch (error: any) {
        console.error("Error creating chat room:", error)
        res.status(500).json({ error: "Lỗi server" })
    }
})

// Lấy danh sách chat rooms của user
router.get('/rooms', verifyToken, async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthenticatedRequest
        if (!authReq.user) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const account_id = authReq.user.id
        const user_type = authReq.user.role || 'user' // 'user' hoặc 'doctor'
        
        let rooms
        if (user_type === 'user') {
            rooms = await query(
                `SELECT 
                    cr.id,
                    cr.user_id,
                    cr.doctor_id,
                    cr.last_message,
                    cr.last_message_at,
                    cr.created_at,
                    d.name as doctor_name,
                    d.avatar as doctor_avatar,
                    d.title as doctor_title,
                    (SELECT COUNT(*) FROM messages m WHERE m.chat_room_id = cr.id AND m.sender_type = 'doctor' AND m.is_read = FALSE) as unread_count
                FROM chat_rooms cr
                JOIN doctors d ON cr.doctor_id = d.id
                WHERE cr.user_id = ?
                ORDER BY cr.last_message_at DESC, cr.created_at DESC`,
                [account_id]
            ) as any[]
        } else {
            // Doctor view - cần lấy doctor_id từ doctor_account
            const doctorAccountRows = await query(
                `SELECT doctor_id FROM doctor_account WHERE id = ?`,
                [account_id]
            ) as any[]
            
            if (doctorAccountRows.length === 0 || !doctorAccountRows[0].doctor_id) {
                return res.status(404).json({ error: "Bác sĩ chưa được liên kết với bảng doctors" })
            }
            
            const doctor_id = doctorAccountRows[0].doctor_id
            
            rooms = await query(
                `SELECT 
                    cr.id,
                    cr.user_id,
                    cr.doctor_id,
                    cr.last_message,
                    cr.last_message_at,
                    cr.created_at,
                    u.name as user_name,
                    u.email as user_email,
                    (SELECT COUNT(*) FROM messages m WHERE m.chat_room_id = cr.id AND m.sender_type = 'user' AND m.is_read = FALSE) as unread_count
                FROM chat_rooms cr
                JOIN users u ON cr.user_id = u.id
                WHERE cr.doctor_id = ?
                ORDER BY cr.last_message_at DESC, cr.created_at DESC`,
                [doctor_id]
            ) as any[]
        }
        
        res.json(rooms)
    } catch (error: any) {
        console.error("Error fetching chat rooms:", error)
        res.status(500).json({ error: "Lỗi server" })
    }
})

// Lấy tin nhắn trong một chat room
router.get('/rooms/:roomId/messages', verifyToken, async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params
        const authReq = req as AuthenticatedRequest
        if (!authReq.user) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const user_id = authReq.user.id
        const user_type = authReq.user.role || 'user'
        
        // Kiểm tra quyền truy cập chat room
        let room
        if (user_type === 'user') {
            room = await query(
                `SELECT id FROM chat_rooms WHERE id = ? AND user_id = ?`,
                [roomId, user_id]
            ) as any[]
        } else {
            // Doctor - cần lấy doctor_id từ doctor_account
            const doctorAccountRows = await query(
                `SELECT doctor_id FROM doctor_account WHERE id = ?`,
                [user_id]
            ) as any[]
            
            if (doctorAccountRows.length === 0 || !doctorAccountRows[0].doctor_id) {
                return res.status(403).json({ error: "Không có quyền truy cập chat room này" })
            }
            
            const doctor_id = doctorAccountRows[0].doctor_id
            
            room = await query(
                `SELECT id FROM chat_rooms WHERE id = ? AND doctor_id = ?`,
                [roomId, doctor_id]
            ) as any[]
        }
        
        if (room.length === 0) {
            return res.status(403).json({ error: "Không có quyền truy cập chat room này" })
        }
        
        // Lấy tin nhắn
        const messages = await query(
            `SELECT 
                id,
                sender_id,
                sender_type,
                message,
                is_read,
                created_at
            FROM messages
            WHERE chat_room_id = ?
            ORDER BY created_at ASC`,
            [roomId]
        ) as any[]
        
        // Đánh dấu tin nhắn là đã đọc
        const oppositeType = user_type === 'user' ? 'doctor' : 'user'
        await query(
            `UPDATE messages 
             SET is_read = TRUE 
             WHERE chat_room_id = ? AND sender_type = ? AND is_read = FALSE`,
            [roomId, oppositeType]
        )
        
        res.json(messages)
    } catch (error: any) {
        console.error("Error fetching messages:", error)
        res.status(500).json({ error: "Lỗi server" })
    }
})

// Lấy thông tin chat room
router.get('/rooms/:roomId', verifyToken, async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params
        const authReq = req as AuthenticatedRequest
        if (!authReq.user) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const user_id = authReq.user.id
        const user_type = authReq.user.role || 'user'
        
        let room
        if (user_type === 'user') {
            room = await query(
                `SELECT 
                    cr.*,
                    d.name as doctor_name,
                    d.avatar as doctor_avatar,
                    d.title as doctor_title,
                    d.specialty as doctor_specialty
                FROM chat_rooms cr
                JOIN doctors d ON cr.doctor_id = d.id
                WHERE cr.id = ? AND cr.user_id = ?`,
                [roomId, user_id]
            ) as any[]
        } else {
            // Doctor - cần lấy doctor_id từ doctor_account
            const doctorAccountRows = await query(
                `SELECT doctor_id FROM doctor_account WHERE id = ?`,
                [user_id]
            ) as any[]
            
            if (doctorAccountRows.length === 0 || !doctorAccountRows[0].doctor_id) {
                return res.status(404).json({ error: "Bác sĩ chưa được liên kết với bảng doctors" })
            }
            
            const doctor_id = doctorAccountRows[0].doctor_id
            
            room = await query(
                `SELECT 
                    cr.*,
                    u.name as user_name,
                    u.email as user_email
                FROM chat_rooms cr
                JOIN users u ON cr.user_id = u.id
                WHERE cr.id = ? AND cr.doctor_id = ?`,
                [roomId, doctor_id]
            ) as any[]
        }
        
        if (room.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy chat room" })
        }
        
        res.json(room[0])
    } catch (error: any) {
        console.error("Error fetching chat room:", error)
        res.status(500).json({ error: "Lỗi server" })
    }
})

export default router

