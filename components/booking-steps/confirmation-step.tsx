"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, User, Phone, Mail, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import type { BookingData } from "@/components/booking-wizard"

interface ConfirmationStepProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function ConfirmationStep({ bookingData, onPrevious }: ConfirmationStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleConfirm = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push("/appointments")
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">Đặt lịch thành công!</h3>
        <p className="text-muted-foreground mb-4">
          Lịch khám của bạn đã được xác nhận. Chúng tôi sẽ gửi thông tin chi tiết qua email và SMS.
        </p>
        <Badge variant="secondary" className="mb-4">
          Mã lịch hẹn: #BK{Date.now().toString().slice(-6)}
        </Badge>
        <p className="text-sm text-muted-foreground">Đang chuyển hướng đến trang quản lý lịch hẹn...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Xác nhận thông tin đặt lịch</h3>
        <p className="text-muted-foreground">Vui lòng kiểm tra lại thông tin trước khi xác nhận</p>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Thông tin lịch khám
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Chuyên khoa:</span>
            <Badge variant="secondary">{bookingData.specialty}</Badge>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Bác sĩ:</span>
            <div className="text-right">
              <div className="font-medium">{bookingData.doctor?.name}</div>
              <div className="text-sm text-muted-foreground">{bookingData.doctor?.title}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ngày khám:</span>
            <span className="font-medium">
              {new Date(bookingData.date).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Giờ khám:</span>
            <span className="font-medium">{bookingData.time}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Phí khám:</span>
            <span className="text-primary">{bookingData.doctor?.price}</span>
          </div>
        </CardContent>
      </Card>

      {/* Patient Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin bệnh nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{bookingData.patientInfo.fullName}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{bookingData.patientInfo.phone}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{bookingData.patientInfo.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(bookingData.patientInfo.dateOfBirth).toLocaleDateString("vi-VN")} -
              {bookingData.patientInfo.gender === "male"
                ? " Nam"
                : bookingData.patientInfo.gender === "female"
                  ? " Nữ"
                  : " Khác"}
            </span>
          </div>

          {bookingData.patientInfo.symptoms && (
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium mb-1">Triệu chứng:</div>
                <p className="text-muted-foreground">{bookingData.patientInfo.symptoms}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" required />
            <p className="text-sm text-muted-foreground">
              Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý với{" "}
              <Button variant="link" className="p-0 h-auto text-sm">
                điều khoản sử dụng
              </Button>{" "}
              và{" "}
              <Button variant="link" className="p-0 h-auto text-sm">
                chính sách bảo mật
              </Button>{" "}
              của MedBooking.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </Button>
      </div>
    </div>
  )
}
