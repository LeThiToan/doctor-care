"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)
  const [isResetLoading, setIsResetLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const { login, forgotPassword } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(formData.email, formData.password)
      console.log('Login result:', result)
      
      if (result.success) {
        console.log('Redirecting to:', redirectTo)
        // Trigger storage event để cập nhật UI (Header chẳng hạn)
        window.dispatchEvent(new Event("storage"))
        // Chuyển hướng đến trang được yêu cầu hoặc trang chủ
        window.location.href = redirectTo
        console.log('Redirect called')
      } else {
        setError(result.error || "Đăng nhập thất bại")
      }
    } catch (err) {
      console.error('Login error:', err)
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

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsResetLoading(true)
    setResetError(null)
    setResetMessage(null)

    try {
      const result = await forgotPassword(resetEmail)
      if (result.success) {
        setResetMessage("Chúng tôi đã gửi mật khẩu mới tới email của bạn. Vui lòng kiểm tra hộp thư đến.")
        toast({
          title: "Đã gửi yêu cầu",
          description: "Mật khẩu mới đã được gửi tới hộp thư của bạn.",
        })
      } else {
        setResetError(result.error || "Không thể gửi yêu cầu đặt lại mật khẩu")
        toast({
          title: "Gửi yêu cầu thất bại",
          description: result.error || "Không thể gửi yêu cầu đặt lại mật khẩu",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      setResetError("Lỗi kết nối server")
      toast({
        title: "Lỗi kết nối",
        description: "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsResetLoading(false)
    }
  }

  const handleOpenResetDialog = (open: boolean) => {
    setIsResetDialogOpen(open)
    if (open) {
      setResetEmail(formData.email)
      setResetMessage(null)
      setResetError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" className="rounded border-border" />
          <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
        </label>
        <Dialog open={isResetDialogOpen} onOpenChange={handleOpenResetDialog}>
          <DialogTrigger asChild>
            <Button variant="link" type="button" className="p-0 h-auto text-sm">
              Quên mật khẩu?
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Quên mật khẩu</DialogTitle>
              <DialogDescription>
                Nhập email đã đăng ký. Nếu email tồn tại, hệ thống sẽ gửi mật khẩu mới tới hộp thư của bạn.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              {resetMessage && <p className="text-sm text-green-600">{resetMessage}</p>}
              {resetError && <p className="text-sm text-red-500">{resetError}</p>}
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => handleOpenResetDialog(false)}>
                  Đóng
                </Button>
                <Button type="submit" disabled={isResetLoading}>
                  {isResetLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  )
}
