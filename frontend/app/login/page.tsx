"use client"

import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LoginForm from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16 px-4">
        <div className="container mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Đăng nhập</CardTitle>
              <CardDescription>
                {redirectTo === '/booking' 
                  ? "Đăng nhập để tiếp tục đặt lịch khám bệnh"
                  : "Đăng nhập vào tài khoản của bạn để đặt lịch khám"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm redirectTo={redirectTo} />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link 
                    href={`/register${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`} 
                    className="text-primary hover:underline"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
