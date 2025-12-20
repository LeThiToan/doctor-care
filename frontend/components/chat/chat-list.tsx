"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, X } from 'lucide-react'
import { chatApi, ChatRoom } from '@/lib/chat-api'
import { useSocket } from '@/app/hooks/useSocket'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import ChatWindow from './chat-window'

interface ChatListProps {
    onClose?: () => void
    hideHeader?: boolean
}

export default function ChatList({ onClose, hideHeader = false }: ChatListProps) {
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
    const [selectedRoomInfo, setSelectedRoomInfo] = useState<ChatRoom | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { socket, isConnected } = useSocket()

    useEffect(() => {
        // Kiểm tra token trước khi load rooms
        const token = localStorage.getItem('token') || localStorage.getItem('doctor_token')
        if (!token) {
            setError('Vui lòng đăng nhập để sử dụng tính năng chat')
            setIsLoading(false)
            return
        }

        loadRooms()
        
        // Refresh rooms when new message arrives
        if (socket && isConnected) {
            socket.on('new_message', () => {
                loadRooms()
            })
        }

        return () => {
            if (socket) {
                socket.off('new_message')
            }
        }
    }, [socket, isConnected])

    const loadRooms = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const data = await chatApi.getRooms()
            setRooms(data)
        } catch (error: any) {
            console.error('Error loading chat rooms:', error)
            if (error.message?.includes('Token') || error.message?.includes('401')) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
                // Xóa token không hợp lệ
                localStorage.removeItem('token')
                localStorage.removeItem('doctor_token')
            } else {
                setError('Không thể tải danh sách chat. Vui lòng thử lại sau.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectRoom = async (roomId: number) => {
        setSelectedRoomId(roomId)
        try {
            const roomInfo = await chatApi.getRoom(roomId)
            setSelectedRoomInfo(roomInfo)
            // Reload rooms to update unread count
            loadRooms()
        } catch (error) {
            console.error('Error loading room info:', error)
        }
    }

    const formatLastMessageTime = (dateString?: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days === 0) {
            return format(date, 'HH:mm', { locale: vi })
        } else if (days === 1) {
            return 'Hôm qua'
        } else if (days < 7) {
            return format(date, 'EEEE', { locale: vi })
        } else {
            return format(date, 'dd/MM/yyyy', { locale: vi })
        }
    }

    if (selectedRoomId) {
        return (
            <div className="h-full flex flex-col overflow-hidden">
                <ChatWindow
                    roomId={selectedRoomId}
                    roomInfo={selectedRoomInfo || undefined}
                    onClose={() => {
                        setSelectedRoomId(null)
                        setSelectedRoomInfo(null)
                        loadRooms()
                    }}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header - chỉ hiển thị nếu không ẩn */}
            {!hideHeader && (
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Tin nhắn
                    </h2>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )}

            {/* Chat Rooms List */}
            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="p-4 text-center text-slate-400">Đang tải...</div>
                ) : error ? (
                    <div className="p-4 text-center">
                        <p className="text-sm text-red-400 mb-2">{error}</p>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = '/login'}
                        >
                            Đăng nhập
                        </Button>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                        Chưa có cuộc trò chuyện nào
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {rooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => handleSelectRoom(room.id)}
                                className="w-full p-4 hover:bg-slate-800/50 transition-colors text-left"
                            >
                                <div className="flex items-start gap-3">
                                    <Avatar>
                                        <AvatarImage
                                            src={room.doctor_avatar ? `/images/doctors/${room.doctor_avatar}` : undefined}
                                        />
                                        <AvatarFallback>
                                            {(room.doctor_name || room.user_name || 'U').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-white truncate">
                                                {room.doctor_name || room.user_name || 'Người dùng'}
                                            </h3>
                                            {room.last_message_at && (
                                                <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">
                                                    {formatLastMessageTime(room.last_message_at)}
                                                </span>
                                            )}
                                        </div>
                                        {room.doctor_title && (
                                            <p className="text-sm text-slate-400 mb-1">
                                                {room.doctor_title}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm text-slate-300 truncate">
                                                {room.last_message || 'Chưa có tin nhắn'}
                                            </p>
                                            {room.unread_count && room.unread_count > 0 && (
                                                <Badge variant="destructive" className="ml-2 shrink-0">
                                                    {room.unread_count}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

