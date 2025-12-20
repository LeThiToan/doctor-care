import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

// Load environment variables FIRST before importing routes
dotenv.config()

import specialtiesRoutes from './routes/specialties'
import doctorsRoutes from './routes/doctors'
import appointmentsRoutes from './routes/appointments'
import authRoutes from './routes/auth'
import doctorsAuthRoutes from './routes/doctors-auth'
import contactRoutes from './routes/contact'
import adminRoutes from './routes/admin'
import aiRoutes from './routes/ai'
import chatRoutes from './routes/chat'
import { saveMessage } from './services/chat'
import { query } from './config/database'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }
})

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
// Tăng limit để hỗ trợ upload avatar (base64 có thể rất lớn)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/specialties', specialtiesRoutes)
app.use('/api/doctors', doctorsRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api', authRoutes)
app.use('/api/doctors-auth', doctorsAuthRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/chat', chatRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend API is running', status: 'OK' })
})

// Socket.io authentication middleware
io.use((socket: any, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]
    
    if (!token) {
        return next(new Error('Authentication error: Token không được cung cấp'))
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        socket.userId = decoded.id
        socket.userRole = decoded.role || 'user'
        next()
    } catch (error) {
        next(new Error('Authentication error: Token không hợp lệ'))
    }
})

// Socket.io connection handling
io.on('connection', (socket: any) => {
    console.log(`User connected: ${socket.userId} (${socket.userRole})`)
    
    // Join room based on user type
    if (socket.userRole === 'user') {
        socket.join(`user:${socket.userId}`)
    } else if (socket.userRole === 'doctor') {
        socket.join(`doctor:${socket.userId}`)
    }
    
    // Join a specific chat room
    socket.on('join_room', (roomId: number) => {
        socket.join(`room:${roomId}`)
        console.log(`User ${socket.userId} joined room ${roomId}`)
    })
    
    // Leave a chat room
    socket.on('leave_room', (roomId: number) => {
        socket.leave(`room:${roomId}`)
        console.log(`User ${socket.userId} left room ${roomId}`)
    })
    
    // Handle sending messages
    socket.on('send_message', async (data: { roomId: number, message: string }) => {
        try {
            const { roomId, message } = data
            
            // Lưu tin nhắn vào database
            const messageId = await saveMessage(
                roomId,
                socket.userId,
                socket.userRole === 'doctor' ? 'doctor' : 'user',
                message
            )
            
            // Gửi tin nhắn đến tất cả clients trong room
            const messageData = {
                id: messageId,
                chat_room_id: roomId,
                sender_id: socket.userId,
                sender_type: socket.userRole === 'doctor' ? 'doctor' : 'user',
                message: message,
                is_read: false,
                created_at: new Date()
            }
            
            io.to(`room:${roomId}`).emit('new_message', messageData)
            
            // Gửi thông báo đến user/doctor nếu họ không online trong room
            // Lấy thông tin room để biết user_id và doctor_id
            const roomInfo = await query(
                `SELECT user_id, doctor_id FROM chat_rooms WHERE id = ?`,
                [roomId]
            ) as any[]
            
            if (roomInfo.length > 0) {
                const room = roomInfo[0]
                if (socket.userRole === 'user') {
                    // Gửi đến doctor - cần tìm doctor_account_id từ doctor_id
                    const doctorAccounts = await query(
                        `SELECT id FROM doctor_account WHERE doctor_id = ?`,
                        [room.doctor_id]
                    ) as any[]
                    if (doctorAccounts.length > 0) {
                        io.to(`doctor:${doctorAccounts[0].id}`).emit('new_message_notification', {
                            roomId,
                            message: message.substring(0, 50) + '...'
                        })
                    }
                } else {
                    // Gửi đến user
                    io.to(`user:${room.user_id}`).emit('new_message_notification', {
                        roomId,
                        message: message.substring(0, 50) + '...'
                    })
                }
            }
        } catch (error) {
            console.error("Error sending message:", error)
            socket.emit('error', { message: 'Lỗi khi gửi tin nhắn' })
        }
    })
    
    // Handle typing indicator
    socket.on('typing', (data: { roomId: number, isTyping: boolean }) => {
        socket.to(`room:${data.roomId}`).emit('user_typing', {
            userId: socket.userId,
            isTyping: data.isTyping
        })
    })
    
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`)
    })
})

httpServer.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`)
    console.log(`Socket.io server is ready`)
})
