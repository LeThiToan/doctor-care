"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { isLoggedIn, loading, error, login } = useAdminAuth()
  const [email, setEmail] = useState("admin@medbooking.com")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!loading && isLoggedIn) {
      // Sử dụng window.location.href để force reload
      window.location.href = "/admin"
    }
  }, [isLoggedIn, loading])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    const result = await login(email, password)
    setIsSubmitting(false)

    if (result.success) {
      // Sử dụng window.location.href để force reload và tránh vấn đề với state
      window.location.href = "/admin"
    } else {
      setFormError(result.error || "Đăng nhập thất bại")
    }
  }

  // Chỉ hiển thị loading nếu thực sự đang loading và chưa có timeout
  const [showLoading, setShowLoading] = useState(true)
  
  useEffect(() => {
    if (!loading) {
      setShowLoading(false)
    }
    // Force hide loading sau 300ms
    const timeout = setTimeout(() => {
      setShowLoading(false)
    }, 300)
    return () => clearTimeout(timeout)
  }, [loading])

  if (loading && showLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.14),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-12 md:flex-row md:items-center md:px-8 lg:px-12">
        <div className="mb-12 text-white md:mb-0 md:w-1/2 md:pr-10">
          <Badge variant="outline" className="mb-4 border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
            Bảng điều khiển quản trị
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Quản lý MedBooking chỉ trong vài cú nhấp
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Theo dõi bác sĩ, lịch hẹn và doanh thu với số liệu cập nhật liên tục. Thiết kế dành riêng cho đội vận hành phòng khám.
          </p>
          <div className="mt-8 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur">
              <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />
              <div>
                <p className="font-semibold text-white">Giám sát thời gian thực</p>
                <p className="text-slate-400">Nhận thông báo tức thì khi có lịch hẹn mới hoặc thay đổi.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur">
              <Sparkles className="mt-1 h-5 w-5 text-sky-400" />
              <div>
                <p className="font-semibold text-white">Tối ưu vận hành</p>
                <p className="text-slate-400">Giao diện trực quan giúp thao tác nhanh, giảm sai sót.</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 text-white shadow-2xl backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-semibold">Đăng nhập quản trị</CardTitle>
            <p className="text-sm text-slate-400">
              Vui lòng sử dụng tài khoản admin của bạn để truy cập bảng điều khiển MedBooking.
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {(formError || error) && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/40 text-red-200">
                  <AlertTitle>Đăng nhập thất bại</AlertTitle>
                  <AlertDescription>{formError || error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium text-slate-200">
                  Email quản trị
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@medbooking.com"
                    required
                    className="bg-slate-950 border-slate-700 pl-9 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium text-slate-200">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    className="bg-slate-950 border-slate-700 pl-9 pr-10 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 rounded-md p-1 text-slate-500 transition hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Gợi ý: sử dụng mật khẩu tối thiểu 8 ký tự bao gồm chữ hoa, chữ thường và số.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 hover:shadow-emerald-500/30"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Quay lại trang chủ
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}


