"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingWizard from "@/components/booking-wizard"
import { useAuth } from "@/app/hooks/useAuth"
import LoginRequiredDialog from "@/components/login-required-dialog"

export default function BookingPage() {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctorId = searchParams.get('doctor')
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setShowLoginDialog(true)
    }
  }, [isLoggedIn, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex justify-center items-center h-64">
              <div className="text-muted-foreground">Đang kiểm tra đăng nhập...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isLoggedIn) {
    const redirectPath = doctorId ? `/booking?doctor=${doctorId}` : '/booking'
    return (
      <>
        <LoginRequiredDialog
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
          redirectTo={redirectPath}
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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Đặt lịch khám bệnh</h1>
            <p className="text-muted-foreground">Hoàn thành các bước sau để đặt lịch khám với bác sĩ</p>
          </div>

          <BookingWizard doctorId={doctorId} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
