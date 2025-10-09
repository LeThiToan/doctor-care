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
import { Star } from "lucide-react"

interface Appointment {
  id: string
  doctorName: string
  date: string
  time: string
}

interface RatingDialogProps {
  appointment: Appointment
  open: boolean
  onClose: () => void
}

export default function RatingDialog({ appointment, open, onClose }: RatingDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Close dialog and show success message
    onClose()
    setIsSubmitting(false)

    // In a real app, you would save the rating
    alert("Cảm ơn bạn đã đánh giá!")
  }

  const handleStarClick = (value: number) => {
    setRating(value)
  }

  const handleStarHover = (value: number) => {
    setHoveredRating(value)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const displayRating = hoveredRating || rating

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đánh giá cuộc hẹn</DialogTitle>
          <DialogDescription>
            Hãy chia sẻ trải nghiệm của bạn với {appointment.doctorName} vào ngày{" "}
            {new Date(appointment.date).toLocaleDateString("vi-VN")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <Label className="text-base font-medium">Đánh giá của bạn</Label>
            <div className="flex justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => handleStarHover(value)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= displayRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {rating === 0
                ? "Chọn số sao để đánh giá"
                : rating === 1
                  ? "Rất không hài lòng"
                  : rating === 2
                    ? "Không hài lòng"
                    : rating === 3
                      ? "Bình thường"
                      : rating === 4
                        ? "Hài lòng"
                        : "Rất hài lòng"}
            </p>
          </div>

          <div>
            <Label htmlFor="comment">Nhận xét (tùy chọn)</Label>
            <Textarea
              id="comment"
              placeholder="Chia sẻ trải nghiệm của bạn về cuộc hẹn này..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Đánh giá của bạn sẽ giúp cải thiện chất lượng dịch vụ và hỗ trợ bệnh nhân khác trong việc lựa chọn bác sĩ
              phù hợp.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Bỏ qua
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
