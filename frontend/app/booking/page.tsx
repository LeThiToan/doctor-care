"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingWizard from "@/components/booking-wizard"
import { useAuth } from "@/app/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, LogIn } from "lucide-react"

export default function BookingPage() {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctorId = searchParams.get('doctor')

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      // Preserve doctor_id in redirect if exists
      const redirectUrl = doctorId 
        ? `/login?redirect=/booking?doctor=${doctorId}`
        : '/login?redirect=/booking'
      
      const timer = setTimeout(() => {
        router.push(redirectUrl)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, loading, router, doctorId])

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
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Đặt lịch khám bệnh</h1>
              <p className="text-muted-foreground">Hoàn thành các bước sau để đặt lịch khám với bác sĩ</p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Yêu cầu đăng nhập</h2>
                <p className="text-muted-foreground mb-6">
                  Bạn cần đăng nhập để có thể đặt lịch khám bệnh. 
                  Chúng tôi sẽ chuyển hướng bạn đến trang đăng nhập trong giây lát...
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push('/login?redirect=/booking')}
                    className="w-full"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Đăng nhập ngay
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/register?redirect=/booking')}
                    className="w-full"
                  >
                    Chưa có tài khoản? Đăng ký
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Tự động chuyển hướng trong 2 giây...
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
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
