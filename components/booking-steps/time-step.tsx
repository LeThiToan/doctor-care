"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import type { BookingData } from "@/components/booking-wizard"

interface TimeStepProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
]

export default function TimeStep({ bookingData, updateBookingData, onNext, onPrevious }: TimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.date ? new Date(bookingData.date) : undefined,
  )
  const [bookedTimes, setBookedTimes] = useState<string[]>([])

  // 🔹 Gọi API lấy giờ đã đặt khi chọn ngày
  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!selectedDate || !bookingData.doctor) return
      const formattedDate = selectedDate.toISOString().split("T")[0]

      try {
        const res = await fetch(`/api/appointments/available?doctor_id=${bookingData.doctor.id}&date=${formattedDate}`)

        const data = await res.json()
        setBookedTimes(data.bookedTimes || [])
      } catch (error) {
        console.error("Lỗi khi tải giờ đặt:", error)
      }
    }

    fetchBookedTimes()
  }, [selectedDate, bookingData.doctor])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      updateBookingData({ date: date.toISOString().split("T")[0], time: "" })
    }
  }

  const handleTimeSelect = (time: string) => {
    updateBookingData({ time })
  }

  const canProceed = bookingData.date !== "" && bookingData.time !== ""

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Chọn ngày khám
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < today}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Chọn giờ khám
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = bookingData.time === time
                  const isAvailable = !bookedTimes.includes(time)

                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={!isAvailable}
                      onClick={() => handleTimeSelect(time)}
                      className="relative"
                    >
                      {time}
                      {!isAvailable && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1">
                          Hết
                        </Badge>
                      )}
                    </Button>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Vui lòng chọn ngày khám trước</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Info */}
      {bookingData.date && bookingData.time && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Thời gian đã chọn:</h4>
                <p className="text-muted-foreground">
                  {new Date(bookingData.date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  lúc {bookingData.time}
                </p>
              </div>
              <Badge variant="secondary">Đã chọn</Badge>
            </div>
          </CardContent>
        </Card>
      )}

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
