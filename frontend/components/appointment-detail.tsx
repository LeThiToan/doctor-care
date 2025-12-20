"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, User, Phone, MapPin, FileText, CreditCard, Star } from "lucide-react"

interface Appointment {
  id: string
  doctor_id?: number
  doctorName: string
  doctorTitle: string
  doctor_avatar?: string
  specialty: string
  date: string
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  location: string
  price: string
  patientName: string
  phone: string
  symptoms?: string
  bookingCode: string
  rating?: number
}

interface AppointmentDetailProps {
  appointment: Appointment
  open: boolean
  onClose: () => void
}

const statusConfig = {
  pending: { label: "Chờ xác nhận", variant: "secondary" as const },
  confirmed: { label: "Đã xác nhận", variant: "default" as const },
  completed: { label: "Đã hoàn thành", variant: "secondary" as const },
  cancelled: { label: "Đã hủy", variant: "destructive" as const },
}

export default function AppointmentDetail({ appointment, open, onClose }: AppointmentDetailProps) {
  const config = statusConfig[appointment.status]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Chi tiết lịch hẹn
            <Badge variant={config.variant}>{config.label}</Badge>
          </DialogTitle>
          <DialogDescription>Mã đặt lịch: #{appointment.bookingCode}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div>
            <h3 className="font-semibold mb-3">Thông tin bác sĩ</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start gap-4">
                {appointment.doctor_avatar && (
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage
                      src={`/images/doctors/${appointment.doctor_avatar}`}
                      alt={appointment.doctorName}
                    />
                    <AvatarFallback className="text-lg">
                      {appointment.doctorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-lg mb-1">{appointment.doctorName}</h4>
                  <p className="text-muted-foreground mb-2">{appointment.doctorTitle}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {appointment.specialty}
                    </Badge>
                    {appointment.rating && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{appointment.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Info */}
          <div>
            <h3 className="font-semibold mb-3">Thông tin lịch hẹn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Ngày khám</p>
                  <p className="text-muted-foreground">
                    {new Date(appointment.date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Giờ khám</p>
                  <p className="text-muted-foreground">{appointment.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Địa điểm</p>
                  <p className="text-muted-foreground">{appointment.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phí khám</p>
                  <p className="text-primary font-semibold">{appointment.price}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Patient Info */}
          <div>
            <h3 className="font-semibold mb-3">Thông tin bệnh nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Họ và tên</p>
                  <p className="text-muted-foreground">{appointment.patientName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Số điện thoại</p>
                  <p className="text-muted-foreground">{appointment.phone}</p>
                </div>
              </div>
            </div>

            {appointment.symptoms && (
              <div className="mt-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">Triệu chứng / Lý do khám</p>
                    <p className="text-muted-foreground bg-muted p-3 rounded-lg">{appointment.symptoms}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {appointment.status === "confirmed" && (
            <>
              <Separator />
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Lưu ý quan trọng</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vui lòng có mặt trước giờ hẹn 15 phút</li>
                  <li>• Mang theo CMND/CCCD và các giấy tờ y tế liên quan</li>
                  <li>• Liên hệ hotline 1900 1234 nếu cần thay đổi lịch hẹn</li>
                  <li>• Có thể hủy lịch hẹn trước 24 giờ mà không mất phí</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
