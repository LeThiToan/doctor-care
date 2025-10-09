"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Brain, Bone, Eye, Baby, Stethoscope } from "lucide-react"
import type { BookingData, Doctor } from "@/components/booking-wizard"

interface SpecialtyStepProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const specialties = [
  { id: "Tim mạch", name: "Tim mạch", description: "Chuyên khoa tim mạch, huyết áp", icon: Heart, color: "text-red-500" },
  { id: "Thần kinh", name: "Thần kinh", description: "Chuyên khoa thần kinh, não bộ", icon: Brain, color: "text-purple-500" },
  { id: "Xương khớp", name: "Xương khớp", description: "Chuyên khoa xương khớp, cột sống", icon: Bone, color: "text-orange-500" },
  { id: "Mắt", name: "Mắt", description: "Chuyên khoa mắt, thị lực", icon: Eye, color: "text-blue-500" },
  { id: "Nhi khoa", name: "Nhi khoa", description: "Chuyên khoa trẻ em", icon: Baby, color: "text-pink-500" },
  { id: "Đa khoa", name: "Đa khoa", description: "Khám tổng quát, tư vấn sức khỏe", icon: Stethoscope, color: "text-green-500" },
]

export default function SpecialtyStep({ bookingData, updateBookingData, onNext, isFirstStep }: SpecialtyStepProps) {
  const handleSpecialtySelect = async (specialty: string) => {
    try {
      const res = await fetch(`/api/doctors?specialty=${encodeURIComponent(specialty)}`)
      const doctors: Doctor[] = await res.json()

      updateBookingData({
        specialty,
        doctors,
        doctor: null,
      })
    } catch (err) {
      console.error("Lỗi khi tải danh sách bác sĩ:", err)
    }
  }

  const canProceed = bookingData.specialty !== ""

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((specialty) => {
          const Icon = specialty.icon
          const isSelected = bookingData.specialty === specialty.id

          return (
            <Card
              key={specialty.id}
              className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
              onClick={() => handleSpecialtySelect(specialty.id)}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2">
                  <Icon className={`h-8 w-8 ${specialty.color}`} />
                </div>
                <CardTitle className="text-lg">{specialty.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm">
                  {specialty.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" disabled={isFirstStep}>
          Quay lại
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}
