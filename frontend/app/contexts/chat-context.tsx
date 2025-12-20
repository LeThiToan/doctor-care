"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface ChatContextType {
    isAIChatboxOpen: boolean
    setIsAIChatboxOpen: (open: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isAIChatboxOpen, setIsAIChatboxOpen] = useState(false)

    return (
        <ChatContext.Provider value={{ isAIChatboxOpen, setIsAIChatboxOpen }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChatContext() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider')
    }
    return context
}

