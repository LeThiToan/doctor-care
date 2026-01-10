const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface ChatRoom {
    id: number
    user_id: number
    doctor_id: number
    last_message?: string
    last_message_at?: string
    created_at: string
    doctor_name?: string
    doctor_avatar?: string
    doctor_title?: string
    doctor_specialty?: string
    user_name?: string
    user_email?: string
    unread_count?: number
}

export interface Message {
    id: number
    chat_room_id: number
    sender_id: number
    sender_type: 'user' | 'doctor'
    message: string
    is_read: boolean
    created_at: string
}

class ChatAPI {
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('token') || localStorage.getItem('doctor_token')
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const token = this.getAuthToken()
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        }

        if (!token) {
            console.error('Chat API: No token found in localStorage')
            // Xóa token cũ nếu có
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token')
                localStorage.removeItem('doctor_token')
            }
            throw new Error('Token không được cung cấp. Vui lòng đăng nhập lại.')
        }

        headers['Authorization'] = `Bearer ${token}`

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        })

        if (!response.ok) {
            if (response.status === 401) {
                // Token không hợp lệ hoặc đã hết hạn
                const error = await response.json().catch(() => ({ error: 'Token không hợp lệ' }))

                // Xóa token không hợp lệ
                if (typeof window !== 'undefined') {
                    console.error('Chat API: Token expired or invalid, clearing storage')
                    localStorage.removeItem('token')
                    localStorage.removeItem('doctor_token')
                    localStorage.removeItem('user')
                    localStorage.removeItem('doctor')

                    // Redirect to login nếu đang ở client side
                    if (error.error?.includes('hết hạn') || error.error?.includes('expired')) {
                        window.location.href = '/login?expired=true'
                    }
                }

                throw new Error(error.error || 'Token không hợp lệ. Vui lòng đăng nhập lại.')
            }
            const error = await response.json().catch(() => ({ error: 'Lỗi server' }))
            throw new Error(error.error || 'Lỗi server')
        }

        return response.json()
    }

    // Tạo hoặc lấy chat room
    async createOrGetRoom(doctorId: number): Promise<{ room_id: number }> {
        return this.request('/chat/rooms', {
            method: 'POST',
            body: JSON.stringify({ doctor_id: doctorId }),
        })
    }

    // Lấy danh sách chat rooms
    async getRooms(): Promise<ChatRoom[]> {
        return this.request('/chat/rooms')
    }

    // Lấy tin nhắn trong một room
    async getMessages(roomId: number): Promise<Message[]> {
        return this.request(`/chat/rooms/${roomId}/messages`)
    }

    // Lấy thông tin chat room
    async getRoom(roomId: number): Promise<ChatRoom> {
        return this.request(`/chat/rooms/${roomId}`)
    }
}

export const chatApi = new ChatAPI()

