"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"
import SpecialtyStep from "@/components/booking-steps/specialty-step"
import DoctorStep from "@/components/booking-steps/doctor-step"
import TimeStep from "@/components/booking-steps/time-step"
import PatientInfoStep from "@/components/booking-steps/patient-info-step"
import ConfirmationStep from "@/components/booking-steps/confirmation-step"

const steps = [
  { id: 1, title: "Chọn chuyên khoa", component: SpecialtyStep },
  { id: 2, title: "Chọn bác sĩ", component: DoctorStep },
  { id: 3, title: "Chọn thời gian", component: TimeStep },
  { id: 4, title: "Thông tin bệnh nhân", component: PatientInfoStep },
  { id: 5, title: "Xác nhận", component: ConfirmationStep },
]

export interface Doctor {
  id: string
  name: string
  title: string
  experience: string
  rating: number
  reviews: number
  price: string
  avatar: string
  specialty: string
}

export interface BookingData {
  user_id?: number   // nếu có đăng nhập người dùng, còn không có thể bỏ
  specialty: string
  doctors: Doctor[]
  doctor: Doctor | null
  date: string
  time: string
  patientInfo: {
    fullName: string
    phone: string
    email: string
    dateOfBirth: string
    gender: string
    symptoms: string
  }
}

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    specialty: "",
    doctors: [],
    doctor: null,
    date: "",
    time: "",
    patientInfo: {
      fullName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      symptoms: "",
    },
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">
              Bước {currentStep} / {steps.length}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% hoàn thành
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${step.id < currentStep
              ? "bg-primary text-primary-foreground"
              : step.id === currentStep
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground"
              }`}
          >
            {step.id < currentStep ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-current opacity-50 text-xs flex items-center justify-center">
                {step.id}
              </span>
            )}
            <span className="hidden sm:inline">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
          />
        </CardContent>
      </Card>
    </div>
  )
}
