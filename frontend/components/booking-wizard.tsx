"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"
import SpecialtyStep from "@/components/booking-steps/specialty-step"
import DoctorStep from "@/components/booking-steps/doctor-step"
import TimeStep from "@/components/booking-steps/time-step"
import PatientInfoStep from "@/components/booking-steps/patient-info-step"
import ConfirmationStep from "@/components/booking-steps/confirmation-step"
import { api } from "@/lib/api"

interface BookingWizardProps {
  doctorId?: string | null
}

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

export default function BookingWizard({ doctorId: doctorIdParam }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
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

  // Auto-select doctor if doctor_id is in URL and skip to time selection
  useEffect(() => {
    const fetchDoctor = async () => {
      if (doctorIdParam) {
        try {
          setLoading(true)
          const doctors = await api.getDoctors()
          // Try both string and number comparison to handle different ID formats
          const selectedDoctor = doctors.find((d: any) => 
            String(d.id) === String(doctorIdParam) || Number(d.id) === Number(doctorIdParam)
          )
          
          if (selectedDoctor) {
            // Convert doctor to match BookingData format
            const doctor: Doctor = {
              id: String(selectedDoctor.id),
              name: selectedDoctor.name,
              title: selectedDoctor.title,
              experience: selectedDoctor.experience,
              rating: selectedDoctor.rating || 0,
              reviews: selectedDoctor.reviews || 0,
              price: selectedDoctor.price,
              avatar: selectedDoctor.avatar || "",
              specialty: selectedDoctor.specialty,
            }
            
            setBookingData((prev) => ({
              ...prev,
              specialty: selectedDoctor.specialty,
              doctor: doctor,
              doctors: [doctor],
            }))
            
            // Skip first 2 steps (chọn chuyên khoa, chọn bác sĩ) and start at time selection (step 3)
            setCurrentStep(3)
          } else {
            console.warn("Doctor not found with id:", doctorIdParam)
          }
        } catch (error) {
          console.error("Error fetching doctor:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchDoctor()
  }, [doctorIdParam])

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      // If doctor was pre-selected, don't allow going back to step 1-2
      if (doctorIdParam && currentStep === 3) {
        // Stay at step 3 if trying to go back from time selection
        return
      }
      setCurrentStep(currentStep - 1)
    }
  }

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  // Adjust progress calculation to account for skipped steps
  const adjustedProgress = doctorIdParam 
    ? ((currentStep - 2) / (steps.length - 2)) * 100
    : (currentStep / steps.length) * 100

  const CurrentStepComponent = steps[currentStep - 1].component

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Đang tải thông tin bác sĩ...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">
              {doctorIdParam 
                ? `Bước ${currentStep - 2} / ${steps.length - 2}`
                : `Bước ${currentStep} / ${steps.length}`}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {Math.round(adjustedProgress)}% hoàn thành
            </span>
          </div>
          <Progress value={adjustedProgress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {steps.map((step) => {
          // Hide skipped steps if doctor is pre-selected
          if (doctorIdParam && (step.id === 1 || step.id === 2)) {
            return null
          }
          
          // Adjust step display number if doctor is pre-selected
          const displayStepId = doctorIdParam ? step.id - 2 : step.id
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          
          return (
            <div
              key={step.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isCompleted
                ? "bg-primary text-primary-foreground"
                : isCurrent
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-current opacity-50 text-xs flex items-center justify-center">
                  {displayStepId}
                </span>
              )}
              <span className="hidden sm:inline">{step.title}</span>
            </div>
          )
        })}
      </div>
      
      {/* Show selected doctor info if pre-selected */}
      {doctorIdParam && bookingData.doctor && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {bookingData.doctor.avatar ? (
                  <img 
                    src={`/images/doctors/${bookingData.doctor.avatar}`}
                    alt={bookingData.doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary">
                    {bookingData.doctor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{bookingData.doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{bookingData.doctor.title}</p>
                <p className="text-sm text-muted-foreground">{bookingData.doctor.specialty}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
