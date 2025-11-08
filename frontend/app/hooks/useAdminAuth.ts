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
    try {
      const token = localStorage.getItem("admin_token")
      const adminData = localStorage.getItem("admin_user")

      if (token && adminData) {
        setIsLoggedIn(true)
        setAdmin(JSON.parse(adminData))
      }
    } catch (err) {
      console.error("Failed to read admin auth from storage:", err)
      clearStorage()
    } finally {
      setLoading(false)
    }
  }, [])

  const clearStorage = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
  }

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const response = await adminApi.login(email, password)
      if (response.token) {
        localStorage.setItem("admin_token", response.token)
        localStorage.setItem("admin_user", JSON.stringify(response.admin))
        setIsLoggedIn(true)
        setAdmin(response.admin)
        return { success: true }
      }
      return { success: false, error: response.error || "Đăng nhập thất bại" }
    } catch (err: any) {
      const message = err?.message || "Đăng nhập thất bại"
      setError(message)
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


