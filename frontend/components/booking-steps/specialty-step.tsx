"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import * as Icons from "lucide-react" // import toàn bộ icon để map động
import type { BookingData, Doctor } from "@/components/booking-wizard"
import { api } from "@/lib/api"

interface Specialty {
  id: number
  name: string
  description: string
  icon: string
  color: string
}

interface SpecialtyStepProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function SpecialtyStep({ bookingData, updateBookingData, onNext, isFirstStep }: SpecialtyStepProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await api.getSpecialties()
        setSpecialties(data)
      } catch (err) {
        console.error("Lỗi khi tải chuyên khoa:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  const handleSpecialtySelect = async (specialty: string) => {
    try {
      const doctors: Doctor[] = await api.getDoctors(specialty)

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Đang tải chuyên khoa...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((specialty) => {
          const Icon = (Icons as any)[specialty.icon] || Icons.Stethoscope
          const isSelected = bookingData.specialty === specialty.name

          return (
            <Card
              key={specialty.id}
              className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
              onClick={() => handleSpecialtySelect(specialty.name)}
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
