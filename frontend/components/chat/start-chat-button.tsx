"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ChatWindow from './chat-window'
import { chatApi, ChatRoom } from '@/lib/chat-api'
import { useAuth } from '@/app/hooks/useAuth'
import LoginRequiredDialog from '@/components/login-required-dialog'

interface StartChatButtonProps {
    doctorId: number
    doctorName?: string
    className?: string
}

export default function StartChatButton({ doctorId, doctorName, className }: StartChatButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [roomId, setRoomId] = useState<number | null>(null)
    const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showLoginDialog, setShowLoginDialog] = useState(false)
    const { isLoggedIn } = useAuth()

    const handleStartChat = async () => {
        if (!isLoggedIn) {
            setShowLoginDialog(true)
            return
        }

        try {
            setIsLoading(true)
            // Tạo hoặc lấy chat room
            const { room_id } = await chatApi.createOrGetRoom(doctorId)
            setRoomId(room_id)
            
            // Lấy thông tin room
            const info = await chatApi.getRoom(room_id)
            setRoomInfo(info)
            
            setIsOpen(true)
        } catch (error) {
            console.error('Error starting chat:', error)
            alert('Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button
                onClick={handleStartChat}
                disabled={isLoading}
                className={className}
                variant="outline"
            >
                <MessageCircle className="h-4 w-4 mr-2" />
                {isLoading ? 'Đang tải...' : 'Nhắn tin với bác sĩ'}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl h-[80vh] p-0" showCloseButton={false}>
                    {roomId && (
                        <div className="h-full">
                            <ChatWindow
                                roomId={roomId}
                                roomInfo={roomInfo || undefined}
                                onClose={() => {
                                    setIsOpen(false)
                                    setRoomId(null)
                                    setRoomInfo(null)
                                }}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <LoginRequiredDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                redirectTo={`/doctors/${doctorId}`}
            />
        </>
    )
}

