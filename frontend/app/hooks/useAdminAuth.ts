"use client"

import { useEffect, useState } from "react"
import { adminApi } from "@/lib/admin-api"

interface AdminUser {
  id: number
  email: string
  name: string
}

export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Đảm bảo chỉ chạy trên client
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Đảm bảo loading luôn được set thành false sau một khoảng thời gian ngắn (fallback)
    const fallbackTimeout = setTimeout(() => {
      console.log('Fallback timeout: forcing loading to false')
      setLoading(false)
    }, 200)

    const checkAuth = () => {
      try {
        const token = localStorage.getItem("admin_token")
        const adminData = localStorage.getItem("admin_user")

        console.log('Checking auth - token exists:', !!token, 'adminData exists:', !!adminData)

        if (token && adminData) {
          try {
            const parsedAdmin = JSON.parse(adminData)
            console.log('Auth check: Setting logged in with admin:', parsedAdmin)
            setIsLoggedIn(true)
            setAdmin(parsedAdmin)
          } catch (parseError) {
            console.error("Lỗi parse admin data:", parseError)
            clearStorage()
            setIsLoggedIn(false)
            setAdmin(null)
          }
        } else {
          console.log('Auth check: No token or adminData, setting logged out')
          setIsLoggedIn(false)
          setAdmin(null)
        }
      } catch (err) {
        console.error("Failed to read admin auth from storage:", err)
        clearStorage()
        setIsLoggedIn(false)
        setAdmin(null)
      } finally {
        clearTimeout(fallbackTimeout)
        console.log('Auth check complete: Setting loading to false')
        setLoading(false)
      }
    }

    // Chạy checkAuth ngay lập tức
    checkAuth()

    // Lắng nghe event khi token expired từ admin-api
    const handleTokenExpired = () => {
      console.log('Token expired event received')
      clearStorage()
      setIsLoggedIn(false)
      setAdmin(null)
    }

    window.addEventListener('admin_token_expired', handleTokenExpired)

    return () => {
      clearTimeout(fallbackTimeout)
      window.removeEventListener('admin_token_expired', handleTokenExpired)
    }
  }, [])

  const clearStorage = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
  }

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      console.log('Attempting login with email:', email)
      const response = await adminApi.login(email, password)
      console.log('Login response:', response)
      
      if (response.token && response.admin) {
        localStorage.setItem("admin_token", response.token)
        localStorage.setItem("admin_user", JSON.stringify(response.admin))
        // Set state và đảm bảo loading = false
        setIsLoggedIn(true)
        setAdmin(response.admin)
        setLoading(false) // Đảm bảo loading được set thành false
        console.log('Login successful, token saved')
        return { success: true }
      }
      
      console.warn('Login response missing token or admin:', response)
      return { success: false, error: response.error || "Phản hồi từ server không hợp lệ" }
    } catch (err: any) {
      console.error('Login error:', err)
      const message = err?.message || "Đăng nhập thất bại"
      setError(message)
      setLoading(false) // Đảm bảo loading được set thành false ngay cả khi có lỗi
      return { success: false, error: message }
    }
  }

  const logout = () => {
    clearStorage()
    setIsLoggedIn(false)
    setAdmin(null)
  }

  return {
    isLoggedIn,
    admin,
    loading,
    error,
    login,
    logout,
  }
}


