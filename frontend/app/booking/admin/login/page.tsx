"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BookingAdminLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/admin/login")
  }, [router])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <p>Đang chuyển hướng đến trang đăng nhập admin...</p>
      </div>
    </div>
  )
}

