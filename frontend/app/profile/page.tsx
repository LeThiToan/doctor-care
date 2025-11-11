"use client"

import { FormEvent, useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/app/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { isLoggedIn, user, loading, changePassword } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login?redirect=/profile")
    }
  }, [loading, isLoggedIn, router])

  const displayName = user?.name || user?.email || "Người dùng"

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Vui lòng nhập đầy đủ thông tin.")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp.")
      return
    }

    try {
      setIsChangingPassword(true)
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword)

      if (result.success) {
        setPasswordSuccess(result.message || "Đổi mật khẩu thành công.")
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        toast({
          title: "Đổi mật khẩu thành công",
          description: "Bạn có thể sử dụng mật khẩu mới để đăng nhập lần sau.",
        })
      } else {
        setPasswordError(result.error || "Không thể đổi mật khẩu.")
        toast({
          title: "Đổi mật khẩu thất bại",
          description: result.error || "Không thể đổi mật khẩu.",
          variant: "destructive",
        })
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Hồ sơ cá nhân</h1>
            <p className="text-muted-foreground">
              Xem và quản lý thông tin tài khoản MedBooking của bạn.
            </p>
          </div>

          {!loading && isLoggedIn && (
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <User className="h-6 w-6 text-primary" />
                    {displayName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Mã người dùng: <span className="font-medium">{user?.id || "—"}</span>
                  </p>
                </div>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Thành viên MedBooking
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                <section>
                  <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                    Thông tin liên hệ
                  </h2>
                  <Separator className="my-3" />
                  <div className="flex items-center gap-3 text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                    Lịch hẹn của bạn
                  </h2>
                  <Separator className="my-3" />
                  <p className="text-muted-foreground mb-4">
                    Xem và quản lý các cuộc hẹn sắp tới của bạn.
                  </p>
                  <Button asChild>
                    <Link href="/appointments">Xem lịch hẹn</Link>
                  </Button>
                </section>

                <section>
                  <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                    Đổi mật khẩu
                  </h2>
                  <Separator className="my-3" />
                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Mật khẩu mới</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                        }
                        placeholder="Nhập mật khẩu mới"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                        }
                        placeholder="Nhập lại mật khẩu mới"
                        required
                      />
                    </div>

                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                    {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}

                    <div className="flex gap-3">
                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                          setPasswordError(null)
                          setPasswordSuccess(null)
                        }}
                      >
                        Làm mới
                      </Button>
                    </div>
                  </form>
                </section>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Đang tải thông tin...
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

