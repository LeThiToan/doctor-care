"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock } from "lucide-react"
import type { BookingData, Doctor } from "@/components/booking-wizard"

interface DoctorStepProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function DoctorStep({ bookingData, updateBookingData, onNext, onPrevious }: DoctorStepProps) {
  const [page, setPage] = useState(1)
  const limit = 3
  const totalPages = Math.ceil(bookingData.doctors.length / limit)

  const handleDoctorSelect = (doctor: Doctor) => {
    updateBookingData({ doctor })
  }

  const canProceed = bookingData.doctor !== null

  const startIndex = (page - 1) * limit
  const visibleDoctors = bookingData.doctors.slice(startIndex, startIndex + limit)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {visibleDoctors.length === 0 ? (
          <p className="text-muted-foreground">Không có bác sĩ nào cho chuyên khoa này.</p>
        ) : (
          visibleDoctors.map((doctor) => {
            const isSelected = bookingData.doctor?.id === doctor.id

            return (
              <Card
                key={doctor.id}
                className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleDoctorSelect(doctor)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={`/images/doctors/${doctor.avatar}`}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/images/doctors/default.png")}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{doctor.name}</h3>
                          <p className="text-muted-foreground">{doctor.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{doctor.experience}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{doctor.price}</div>
                          <div className="text-sm text-muted-foreground">/ lần khám</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-muted-foreground">
                            ({doctor.reviews} đánh giá)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary">{doctor.specialty}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Nút phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Trang trước
          </Button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Trang sau
          </Button>
        </div>
      )}

      <div className="flex justify-between mt-6">
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
