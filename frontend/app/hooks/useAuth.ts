
"use client"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")
        
        if (token && userData) {
            setIsLoggedIn(true)
            setUser(JSON.parse(userData))
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await api.login(email, password)
            if (response.token) {
                localStorage.setItem("token", response.token)
                localStorage.setItem("user", JSON.stringify(response.user))
                setIsLoggedIn(true)
                setUser(response.user)
                return { success: true }
            } else {
                return { success: false, error: response.error }
            }
        } catch (error) {
            return { success: false, error: "Đăng nhập thất bại" }
        }
    }

    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await api.register(email, password, name)
            if (response.message) {
                return { success: true }
            } else {
                return { success: false, error: response.error }
            }
        } catch (error) {
            return { success: false, error: "Đăng ký thất bại" }
        }
    }

    const logout = async () => {
        try {
            await api.logout()
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            setIsLoggedIn(false)
            setUser(null)
        }
    }

    return { 
        isLoggedIn, 
        user, 
        loading, 
        login, 
        register, 
        logout 
    }
}
