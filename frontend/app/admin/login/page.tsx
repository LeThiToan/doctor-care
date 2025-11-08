"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { isLoggedIn, loading, error, login } = useAdminAuth()
  const [email, setEmail] = useState("admin@medbooking.com")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace("/admin")
    }
  }, [isLoggedIn, loading, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    const result = await login(email, password)
    setIsSubmitting(false)

    if (result.success) {
      router.replace("/admin")
    } else {
      setFormError(result.error || "Đăng nhập thất bại")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Đang kiểm tra phiên đăng nhập...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 text-white shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold">MedBooking Admin</CardTitle>
          <p className="text-sm text-slate-400">
            Đăng nhập bằng tài khoản quản trị để truy cập bảng điều khiển.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(formError || error) && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/40 text-red-200">
                <AlertTitle>Đăng nhập thất bại</AlertTitle>
                <AlertDescription>{formError || error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@medbooking.com"
                required
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-sm font-medium">
                Mật khẩu
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="text-xs text-slate-500">
              Tài khoản mẫu trong file SQL: <span className="text-emerald-400">admin@medbooking.com / password</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Quay lại trang chủ
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


