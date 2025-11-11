
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

    const forgotPassword = async (email: string) => {
        try {
            const response = await api.forgotPassword(email)
            if (response.error) {
                return { success: false, error: response.error }
            }
            return { 
                success: true, 
                message: response.message || "Nếu email tồn tại, chúng tôi đã gửi mật khẩu mới tới hộp thư đăng ký" 
            }
        } catch (error) {
            return { success: false, error: "Không thể gửi yêu cầu đặt lại mật khẩu" }
        }
    }

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            if (!user?.email) {
                return { success: false, error: "Không tìm thấy email người dùng" }
            }

            const response = await api.changePassword(user.email, currentPassword, newPassword)

            if (response.error) {
                return { success: false, error: response.error }
            }

            return { success: true, message: response.message || "Đổi mật khẩu thành công" }
        } catch (error) {
            return { success: false, error: "Không thể đổi mật khẩu. Vui lòng thử lại." }
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
        forgotPassword,
        changePassword,
        logout 
    }
}
