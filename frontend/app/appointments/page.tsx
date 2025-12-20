"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AppointmentsList from "@/components/appointments-list"
import { useAuth } from "@/app/hooks/useAuth"
import LoginRequiredDialog from "@/components/login-required-dialog"

export default function AppointmentsPage() {
  const router = useRouter()
  const { isLoggedIn, loading } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setShowLoginDialog(true)
    }
  }, [isLoggedIn, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginRequiredDialog
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
          redirectTo="/appointments"
        />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang chuyển hướng...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý lịch hẹn</h1>
            <p className="text-muted-foreground">Theo dõi và quản lý các cuộc hẹn khám bệnh của bạn</p>
          </div>

          <AppointmentsList />
        </div>
      </main>

      <Footer />
    </div>
  )
}
