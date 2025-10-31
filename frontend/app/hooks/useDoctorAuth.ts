"use client"

import { useState, useEffect } from "react"
import { doctorsApi } from "@/lib/doctors-api"

export function useDoctorAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("doctor_token")
    const doctorData = localStorage.getItem("doctor")

    if (token && doctorData) {
      setIsLoggedIn(true)
      setDoctor(JSON.parse(doctorData))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await doctorsApi.login(email, password)
      if (response.token) {
        localStorage.setItem("doctor_token", response.token)
        localStorage.setItem("doctor", JSON.stringify(response.doctor))
        setIsLoggedIn(true)
        setDoctor(response.doctor)
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Đăng nhập thất bại" }
    }
  }

  const logout = async () => {
    try {
      await doctorsApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("doctor_token")
      localStorage.removeItem("doctor")
      setIsLoggedIn(false)
      setDoctor(null)
    }
  }

  return {
    isLoggedIn,
    doctor,
    loading,
    login,
    logout
  }
}
