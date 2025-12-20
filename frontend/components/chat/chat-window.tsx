"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, X } from 'lucide-react'
import { useSocket } from '@/app/hooks/useSocket'
import { chatApi, Message, ChatRoom } from '@/lib/chat-api'
import { useAuth } from '@/app/hooks/useAuth'
import { useDoctorAuth } from '@/app/hooks/useDoctorAuth'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface ChatWindowProps {
    roomId: number
    onClose: () => void
    roomInfo?: ChatRoom
}

export default function ChatWindow({ roomId, onClose, roomInfo }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isTyping, setIsTyping] = useState(false)
    const { socket, isConnected } = useSocket()
    const { user } = useAuth()
    const { doctor } = useDoctorAuth()
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout>()

    const currentUser = user || doctor
    const isDoctor = !!doctor

    useEffect(() => {
        if (!socket || !isConnected) return

        // Join room
        socket.emit('join_room', roomId)

        // Load messages
        loadMessages()

        // Listen for new messages
        socket.on('new_message', (message: Message) => {
            setMessages(prev => [...prev, message])
            scrollToBottom()
        })

        // Listen for typing indicator
        socket.on('user_typing', (data: { userId: number, isTyping: boolean }) => {
            if (data.userId !== currentUser?.id) {
                setIsTyping(data.isTyping)
            }
        })

        return () => {
            socket.emit('leave_room', roomId)
            socket.off('new_message')
            socket.off('user_typing')
        }
    }, [socket, isConnected, roomId])

    const loadMessages = async () => {
        try {
            setIsLoading(true)
            const data = await chatApi.getMessages(roomId)
            setMessages(data)
            scrollToBottom()
        } catch (error) {
            console.error('Error loading messages:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight
                }
            }
        }, 100)
    }

    const handleSendMessage = () => {
        if (!newMessage.trim() || !socket || !isConnected) return

        socket.emit('send_message', {
            roomId,
            message: newMessage.trim()
        })

        setNewMessage('')
        
        // Clear typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        socket.emit('typing', { roomId, isTyping: false })
    }

    const handleTyping = (value: string) => {
        setNewMessage(value)

        if (!socket || !isConnected) return

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Emit typing indicator
        socket.emit('typing', { roomId, isTyping: true })

        // Stop typing after 1 second of no input
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing', { roomId, isTyping: false })
        }, 1000)
    }

    const getDisplayName = () => {
        if (!roomInfo) return 'Chat'
        if (isDoctor) {
            return roomInfo.user_name || 'Bệnh nhân'
        } else {
            return roomInfo.doctor_name || 'Bác sĩ'
        }
    }

    const getAvatar = () => {
        if (!roomInfo) return null
        if (isDoctor) {
            return null // User avatar nếu có
        } else {
            return roomInfo.doctor_avatar
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={getAvatar() ? `/images/doctors/${getAvatar()}` : undefined} />
                        <AvatarFallback className="bg-blue-500/20 text-blue-400">
                            {getDisplayName().charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-white">{getDisplayName()}</h3>
                        {roomInfo?.doctor_title && (
                            <p className="text-sm text-slate-400">{roomInfo.doctor_title}</p>
                        )}
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0 p-4 bg-slate-950" ref={scrollAreaRef}>
                {isLoading ? (
                    <div className="text-center text-slate-400">Đang tải tin nhắn...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => {
                            const isOwnMessage = 
                                (isDoctor && message.sender_type === 'doctor') ||
                                (!isDoctor && message.sender_type === 'user')
                            
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${
                                            isOwnMessage
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-800 text-slate-200'
                                        }`}
                                    >
                                        <p className="text-sm">{message.message}</p>
                                        <p className={`text-xs mt-1 ${
                                            isOwnMessage ? 'text-blue-100/70' : 'text-slate-400'
                                        }`}>
                                            {format(new Date(message.created_at), 'HH:mm', { locale: vi })}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 rounded-lg p-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0">
                <div className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        placeholder="Nhập tin nhắn..."
                        disabled={!isConnected}
                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !isConnected}
                        size="icon"
                        className="bg-blue-500 text-white hover:bg-blue-600 shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                {!isConnected && (
                    <p className="text-xs text-slate-400 mt-2">Đang kết nối...</p>
                )}
            </div>
        </div>
    )
}

