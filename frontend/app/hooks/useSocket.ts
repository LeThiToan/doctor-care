"use client"

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const tokenRef = useRef<string | null>(null)

    useEffect(() => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('doctor_token')
        tokenRef.current = token

        if (!token) {
            return
        }

        // Tạo socket connection
        const newSocket = io(SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        })

        newSocket.on('connect', () => {
            console.log('Socket connected')
            setIsConnected(true)
        })

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected')
            setIsConnected(false)
        })

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error)
            setIsConnected(false)
            // Nếu lỗi authentication, xóa token không hợp lệ
            if (error.message?.includes('Authentication') || error.message?.includes('Token')) {
                localStorage.removeItem('token')
                localStorage.removeItem('doctor_token')
            }
        })

        setSocket(newSocket)

        return () => {
            newSocket.close()
        }
    }, [])

    return { socket, isConnected }
}

