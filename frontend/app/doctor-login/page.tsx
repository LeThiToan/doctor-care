"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Stethoscope, ArrowRight, Shield, Sparkles } from "lucide-react"
import { useDoctorAuth } from "@/app/hooks/useDoctorAuth"
import Link from "next/link"

export default function DoctorLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const { login } = useDoctorAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Trigger storage event để cập nhật UI
        window.dispatchEvent(new Event("storage"))
        // Chuyển hướng đến trang quản lý bác sĩ
        router.push("/doctor-dashboard")
      } else {
        setError(result.error || "Đăng nhập thất bại")
      }
    } catch (err) {
      setError("Lỗi kết nối server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <Header />

      <main className="py-12 px-4 lg:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding */}
            <div className="hidden lg:block space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                    <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 rounded-2xl shadow-2xl">
                      <Stethoscope className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-foreground">MedBooking</h1>
                    <p className="text-muted-foreground">Hệ thống quản lý bác sĩ</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg mt-1">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Bảo mật cao</h3>
                      <p className="text-muted-foreground text-sm">
                        Hệ thống mã hóa và bảo vệ thông tin bác sĩ theo tiêu chuẩn quốc tế
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg mt-1">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Quản lý dễ dàng</h3>
                      <p className="text-muted-foreground text-sm">
                        Theo dõi và quản lý lịch hẹn bệnh nhân một cách trực quan và hiệu quả
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:max-w-lg">
              <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                        <Stethoscope className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2">Đăng nhập Bác sĩ</CardTitle>
                    <CardDescription className="text-base">
                      Quản lý lịch hẹn và bệnh nhân của bạn
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email bác sĩ
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="bs.example@medi.vn"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold">
                        Mật khẩu
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-12 h-12 border-2 focus:border-primary transition-colors"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
                      </label>
                      <Button variant="link" className="p-0 h-auto text-sm" type="button">
                        Quên mật khẩu?
                      </Button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold group" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Đang đăng nhập...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Đăng nhập
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Hoặc</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Bạn là bệnh nhân?{" "}
                      <Link href="/login" className="text-primary hover:underline font-semibold">
                        Đăng nhập tại đây
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
