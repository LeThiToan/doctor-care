"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle } from "lucide-react"

interface Appointment {
  id: string
  doctorName: string
  date: string
  time: string
  bookingCode: string
}

interface CancelAppointmentDialogProps {
  appointment: Appointment
  open: boolean
  onClose: () => void
}

const cancelReasons = [
  "Có việc đột xuất không thể sắp xếp",
  "Tình trạng sức khỏe đã cải thiện",
  "Muốn đổi sang bác sĩ khác",
  "Muốn đổi thời gian khác",
  "Lý do khác",
]

export default function CancelAppointmentDialog({ appointment, open, onClose }: CancelAppointmentDialogProps) {
  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCancel = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Close dialog and show success message
    onClose()
    setIsSubmitting(false)

    // In a real app, you would update the appointment status
    alert("Lịch hẹn đã được hủy thành công!")
  }

  const canSubmit = reason !== "" && (reason !== "Lý do khác" || customReason.trim() !== "")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Hủy lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy lịch hẹn với {appointment.doctorName} vào{" "}
            {new Date(appointment.date).toLocaleDateString("vi-VN")} lúc {appointment.time}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Lý do hủy lịch hẹn</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
              {cancelReasons.map((cancelReason) => (
                <div key={cancelReason} className="flex items-center space-x-2">
                  <RadioGroupItem value={cancelReason} id={cancelReason} />
                  <Label htmlFor={cancelReason} className="text-sm font-normal">
                    {cancelReason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {reason === "Lý do khác" && (
            <div>
              <Label htmlFor="customReason">Chi tiết lý do</Label>
              <Textarea
                id="customReason"
                placeholder="Vui lòng mô tả lý do hủy lịch hẹn..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Lưu ý:</strong> Việc hủy lịch hẹn trong vòng 24 giờ trước giờ khám có thể phát sinh phí hủy. Vui
              lòng liên hệ hotline 1900 1234 để biết thêm chi tiết.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Giữ lại lịch hẹn
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Đang hủy..." : "Xác nhận hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
