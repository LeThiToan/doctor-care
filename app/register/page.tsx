import Header from "@/components/header"
import Footer from "@/components/footer"
import RegisterForm from "@/components/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16 px-4">
        <div className="container mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
              <CardDescription>Tạo tài khoản mới để bắt đầu đặt lịch khám bệnh</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Đăng nhập
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
