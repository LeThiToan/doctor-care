"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Phone, Mail, Calendar } from "lucide-react"
import type { BookingData } from "@/components/booking-wizard"

interface PatientInfoStepProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function PatientInfoStep({ bookingData, updateBookingData, onNext, onPrevious }: PatientInfoStepProps) {
  const handleInputChange = (field: keyof BookingData["patientInfo"], value: string) => {
    updateBookingData({
      patientInfo: {
        ...bookingData.patientInfo,
        [field]: value,
      },
    })
  }

  const canProceed =
    bookingData.patientInfo.fullName !== "" &&
    bookingData.patientInfo.phone !== "" &&
    bookingData.patientInfo.email !== "" &&
    bookingData.patientInfo.dateOfBirth !== "" &&
    bookingData.patientInfo.gender !== ""

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              value={bookingData.patientInfo.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="0123456789"
              value={bookingData.patientInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={bookingData.patientInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="dateOfBirth"
              type="date"
              value={bookingData.patientInfo.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="gender">Giới tính *</Label>
          <Select
            value={bookingData.patientInfo.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Nam</SelectItem>
              <SelectItem value="female">Nữ</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms">Triệu chứng / Lý do khám</Label>
        <Textarea
          id="symptoms"
          placeholder="Mô tả triệu chứng hoặc lý do bạn muốn khám bệnh..."
          value={bookingData.patientInfo.symptoms}
          onChange={(e) => handleInputChange("symptoms", e.target.value)}
          rows={4}
        />
        <p className="text-sm text-muted-foreground">Thông tin này sẽ giúp bác sĩ chuẩn bị tốt hơn cho buổi khám</p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}
