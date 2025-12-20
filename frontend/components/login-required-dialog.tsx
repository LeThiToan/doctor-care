"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface LoginRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string
}

export default function LoginRequiredDialog({ open, onOpenChange, redirectTo = "/appointments" }: LoginRequiredDialogProps) {
  const router = useRouter()

  const handleLogin = () => {
    onOpenChange(false)
    router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`)
  }

  // Xác định thông điệp dựa trên redirect path
  const isBooking = redirectTo.includes('/booking')
  const message = isBooking 
    ? "Bạn cần đăng nhập để có thể đặt lịch khám bệnh."
    : "Bạn cần đăng nhập để có thể xem lịch hẹn."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md bg-[#f0fdf4] dark:bg-green-950/20 rounded-xl border-0 p-8 shadow-xl" 
        showCloseButton={false}
      >
        <DialogHeader className="text-center space-y-0">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">
            Yêu cầu đăng nhập
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 dark:text-foreground/90 leading-relaxed px-2">
            {message}
            <br />
            Chúng tôi sẽ chuyển hướng bạn đến trang đăng nhập trong giây lát...
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8 space-y-5">
          <Button
            onClick={handleLogin}
            className="w-full bg-[#16a34a] hover:bg-[#15803d] active:bg-[#166534] text-white text-base font-medium py-6 h-auto rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Đăng nhập ngay
          </Button>

          <div className="text-center text-sm text-gray-600 dark:text-foreground/70">
            Chưa có tài khoản?{" "}
            <Link
              href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-[#16a34a] hover:text-[#15803d] dark:text-green-400 dark:hover:text-green-300 font-medium underline underline-offset-2"
              onClick={() => onOpenChange(false)}
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

