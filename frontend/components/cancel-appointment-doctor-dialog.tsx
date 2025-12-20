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
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CancelAppointmentDoctorDialogProps {
  appointmentId: string
  patientName: string
  open: boolean
  onClose: () => void
  onConfirm: (cancelReason: string) => void
}

export default function CancelAppointmentDoctorDialog({
  appointmentId,
  patientName,
  open,
  onClose,
  onConfirm,
}: CancelAppointmentDoctorDialogProps) {
  const [cancelReason, setCancelReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!cancelReason.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onConfirm(cancelReason.trim())
      setCancelReason("")
      onClose()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setCancelReason("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Xác nhận hủy lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy lịch hẹn với bệnh nhân <strong>{patientName}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Hành động này không thể hoàn tác. Bệnh nhân sẽ nhận được email thông báo về việc hủy lịch hẹn.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="cancel-reason">
              Lý do hủy lịch <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="Vui lòng nhập lý do hủy lịch hẹn (ví dụ: Bác sĩ có việc đột xuất, Lịch trùng với ca khẩn cấp, ...)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Lý do này sẽ được gửi đến bệnh nhân qua email.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting || !cancelReason.trim()}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

