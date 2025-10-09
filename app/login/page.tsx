import Header from "@/components/header"
import Footer from "@/components/footer"
import LoginForm from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16 px-4">
        <div className="container mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Đăng nhập</CardTitle>
              <CardDescription>Đăng nhập vào tài khoản của bạn để đặt lịch khám</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link href="/register" className="text-primary hover:underline">
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
