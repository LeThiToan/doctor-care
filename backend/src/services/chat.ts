import { query } from '../config/database'

export interface Message {
    id: number
    chat_room_id: number
    sender_id: number
    sender_type: 'user' | 'doctor'
    message: string
    is_read: boolean
    created_at: Date
}

// Lưu tin nhắn vào database
export async function saveMessage(
    chatRoomId: number,
    senderId: number,
    senderType: 'user' | 'doctor',
    message: string
): Promise<number> {
    try {
        const result = await query(
            `INSERT INTO messages (chat_room_id, sender_id, sender_type, message) 
             VALUES (?, ?, ?, ?)`,
            [chatRoomId, senderId, senderType, message]
        ) as any
        
        // Cập nhật last_message và last_message_at trong chat_rooms
        await query(
            `UPDATE chat_rooms 
             SET last_message = ?, last_message_at = NOW() 
             WHERE id = ?`,
            [message.substring(0, 255), chatRoomId] // Giới hạn 255 ký tự cho last_message
        )
        
        return result.insertId
    } catch (error) {
        console.error("Error saving message:", error)
        throw error
    }
}

// Lấy tin nhắn mới nhất của một chat room
export async function getLatestMessage(chatRoomId: number): Promise<Message | null> {
    try {
        const messages = await query(
            `SELECT * FROM messages 
             WHERE chat_room_id = ? 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [chatRoomId]
        ) as Message[]
        
        return messages.length > 0 ? messages[0] : null
    } catch (error) {
        console.error("Error getting latest message:", error)
        return null
    }
}

