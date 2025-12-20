"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Phone, MapPin, Star, X, Eye } from "lucide-react"
import AppointmentDetail from "@/components/appointment-detail"
import CancelAppointmentDialog from "@/components/cancel-appointment-dialog"
import RatingDialog from "@/components/rating-dialog"
import { api } from "@/lib/api"
import { useAuth } from "@/app/hooks/useAuth"

interface Appointment {
  id: string
  doctor_id?: number
  doctor_name: string
  doctor_title: string
  doctor_avatar?: string
  specialty: string
  appointment_date: string
  appointment_time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  price: string
  patient_name: string
  patient_phone: string
  symptoms?: string
  rating?: number
  created_at: string
}

// Mock data removed - will use real API

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", variant: "secondary" as const },
  confirmed: { label: "Đã xác nhận", color: "bg-green-100 text-green-800", variant: "default" as const },
  completed: { label: "Đã hoàn thành", color: "bg-blue-100 text-blue-800", variant: "secondary" as const },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", variant: "destructive" as const },
}

export default function AppointmentsList() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null)
  const [ratingAppointment, setRatingAppointment] = useState<Appointment | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const data = await api.getAppointments(user.id.toString())
        setAppointments(data)
      } catch (error) {
        console.error("Lỗi khi tải lịch hẹn:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user?.id])

  const filterAppointments = (status?: string) => {
    if (status === "all") return appointments
    return appointments.filter((apt) => apt.status === status)
  }

  const getTabCounts = () => {
    return {
      all: appointments.length,
      pending: appointments.filter((apt) => apt.status === "pending").length,
      confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
      completed: appointments.filter((apt) => apt.status === "completed").length,
      cancelled: appointments.filter((apt) => apt.status === "cancelled").length,
    }
  }

  const counts = getTabCounts()

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const response = await api.cancelAppointment(appointmentId)
      
      // Check if response has error
      if (response.error) {
        alert(response.error)
        return
      }
      
      // Refresh appointments
      if (user?.id) {
        const data = await api.getAppointments(user.id.toString())
        setAppointments(data)
      }
      setCancellingAppointment(null)
    } catch (error: any) {
      console.error("Lỗi khi hủy lịch hẹn:", error)
      const errorMessage = error?.message || error?.error || "Không thể hủy lịch hẹn. Vui lòng thử lại."
      alert(errorMessage)
    }
  }

  const handleRateAppointment = async (appointmentId: string, rating: number) => {
    try {
      await api.rateAppointment(appointmentId, rating)
      // Refresh appointments
      if (user?.id) {
        const data = await api.getAppointments(user.id.toString())
        setAppointments(data)
      }
      setRatingAppointment(null)
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-muted-foreground">Đang tải lịch hẹn...</div>
      </div>
    )
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const config = statusConfig[appointment.status]

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{appointment.doctor_name}</h3>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>
              <p className="text-muted-foreground mb-1">{appointment.doctor_title}</p>
              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-primary">{appointment.price}</div>
              <div className="text-sm text-muted-foreground">#{appointment.id}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(appointment.appointment_date).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.appointment_time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.patient_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.patient_phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm mb-4">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Phòng khám {appointment.specialty}</span>
          </div>

          {appointment.symptoms && (
            <div className="bg-muted p-3 rounded-lg mb-4">
              <p className="text-sm">
                <span className="font-medium">Triệu chứng: </span>
                {appointment.symptoms}
              </p>
            </div>
          )}

          {appointment.status === "completed" && appointment.rating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Đánh giá của bạn:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < appointment.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
              <Eye className="h-4 w-4 mr-1" />
              Chi tiết
            </Button>

            {appointment.status === "pending" && (
              <Button variant="outline" size="sm" onClick={() => setCancellingAppointment(appointment)}>
                <X className="h-4 w-4 mr-1" />
                Hủy lịch
              </Button>
            )}

            {appointment.status === "completed" && !appointment.rating && (
              <Button variant="outline" size="sm" onClick={() => setRatingAppointment(appointment)}>
                <Star className="h-4 w-4 mr-1" />
                Đánh giá
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tất cả ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận ({counts.pending})</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận ({counts.confirmed})</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành ({counts.completed})</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy ({counts.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filterAppointments("all").map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          {filterAppointments("all").length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Hiện tại chưa có lịch hẹn nào</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterAppointments("pending").map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          {filterAppointments("pending").length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Không có lịch hẹn nào đang chờ xác nhận</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {filterAppointments("confirmed").map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          {filterAppointments("confirmed").length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Không có lịch hẹn nào đã được xác nhận</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterAppointments("completed").map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          {filterAppointments("completed").length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Không có lịch hẹn nào đã hoàn thành</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {filterAppointments("cancelled").map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          {filterAppointments("cancelled").length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Không có lịch hẹn nào đã bị hủy</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {selectedAppointment && (
        <AppointmentDetail
          appointment={{
            id: selectedAppointment.id,
            doctor_id: selectedAppointment.doctor_id,
            doctorName: selectedAppointment.doctor_name,
            doctorTitle: selectedAppointment.doctor_title,
            doctor_avatar: selectedAppointment.doctor_avatar,
            specialty: selectedAppointment.specialty,
            date: selectedAppointment.appointment_date,
            time: selectedAppointment.appointment_time,
            status: selectedAppointment.status,
            location: "78 Đường Hữu Nghị, Đồng Hới", // Default location
            price: selectedAppointment.price,
            patientName: selectedAppointment.patient_name,
            phone: selectedAppointment.patient_phone,
            symptoms: selectedAppointment.symptoms,
            bookingCode: selectedAppointment.id,
            rating: selectedAppointment.rating,
          }}
          open={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {cancellingAppointment && (
        <CancelAppointmentDialog
          appointment={cancellingAppointment}
          open={!!cancellingAppointment}
          onClose={() => setCancellingAppointment(null)}
          onConfirm={() => handleCancelAppointment(cancellingAppointment.id)}
        />
      )}

      {ratingAppointment && (
        <RatingDialog
          appointment={ratingAppointment}
          open={!!ratingAppointment}
          onClose={() => setRatingAppointment(null)}
          onRate={(rating) => handleRateAppointment(ratingAppointment.id, rating)}
        />
      )}
    </div>
  )
}
