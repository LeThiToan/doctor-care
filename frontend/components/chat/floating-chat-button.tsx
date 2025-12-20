"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import ChatList from './chat-list'
import { useAuth } from '@/app/hooks/useAuth'
import { useDoctorAuth } from '@/app/hooks/useDoctorAuth'
import { useChatContext } from '@/app/contexts/chat-context'

export default function FloatingChatButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const { isLoggedIn } = useAuth()
    const { isLoggedIn: isDoctorLoggedIn } = useDoctorAuth()
    const { isAIChatboxOpen } = useChatContext()

    // Chỉ hiển thị nếu user hoặc doctor đã đăng nhập
    if (!isLoggedIn && !isDoctorLoggedIn) {
        return null
    }

    // Ẩn button khi AI chatbox đang mở
    if (isAIChatboxOpen) {
        return null
    }

    if (!isOpen) {
        return (
            <div className="fixed bottom-24 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            </div>
        )
    }

    return (
        <Card
            className={cn(
                "fixed bottom-24 right-6 z-50 flex flex-col border-slate-800 bg-slate-900/95 backdrop-blur-lg shadow-2xl transition-all duration-300 overflow-hidden",
                isMinimized ? "h-16 w-80" : "h-[600px] w-96"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-3 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                        <MessageCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">Tin nhắn</h3>
                        <p className="text-xs text-slate-400">Chat với bác sĩ</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => {
                            setIsOpen(false)
                            setIsMinimized(false)
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
                <div className="flex-1 min-h-0 bg-slate-950">
                    <ChatList 
                        hideHeader={true}
                        onClose={() => {
                            setIsOpen(false)
                            setIsMinimized(false)
                        }} 
                    />
                </div>
            )}
        </Card>
    )
}

