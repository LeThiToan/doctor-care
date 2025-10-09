"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Phone, MapPin, Star, X, Eye } from "lucide-react"
import AppointmentDetail from "@/components/appointment-detail"
import CancelAppointmentDialog from "@/components/cancel-appointment-dialog"
import RatingDialog from "@/components/rating-dialog"

interface Appointment {
  id: string
  doctorName: string
  doctorTitle: string
  specialty: string
  date: string
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  location: string
  price: string
  patientName: string
  phone: string
  symptoms?: string
  bookingCode: string
  rating?: number
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorName: "BS. Nguyễn Văn An",
    doctorTitle: "Bác sĩ chuyên khoa I",
    specialty: "Tim mạch",
    date: "2024-12-15",
    time: "09:00",
    status: "confirmed",
    location: "Phòng khám Tim mạch - Tầng 3",
    price: "300.000đ",
    patientName: "Nguyễn Văn A",
    phone: "0123456789",
    symptoms: "Đau ngực, khó thở khi gắng sức",
    bookingCode: "BK123456",
  },
  {
    id: "2",
    doctorName: "BS. Trần Thị Bình",
    doctorTitle: "Bác sĩ chuyên khoa II",
    specialty: "Tim mạch",
    date: "2024-12-10",
    time: "14:30",
    status: "completed",
    location: "Phòng khám Tim mạch - Tầng 3",
    price: "350.000đ",
    patientName: "Nguyễn Văn A",
    phone: "0123456789",
    symptoms: "Khám định kỳ",
    bookingCode: "BK123455",
    rating: 5,
  },
  {
    id: "3",
    doctorName: "PGS.TS. Lê Minh Cường",
    doctorTitle: "Phó Giáo sư, Tiến sĩ",
    specialty: "Tim mạch",
    date: "2024-12-08",
    time: "10:00",
    status: "completed",
    location: "Phòng khám Tim mạch - Tầng 3",
    price: "500.000đ",
    patientName: "Nguyễn Văn A",
    phone: "0123456789",
    bookingCode: "BK123454",
  },
  {
    id: "4",
    doctorName: "BS. Nguyễn Thị Cẩm",
    doctorTitle: "Bác sĩ chuyên khoa I",
    specialty: "Nhi khoa",
    date: "2024-12-05",
    time: "15:00",
    status: "cancelled",
    location: "Phòng khám Nhi - Tầng 2",
    price: "250.000đ",
    patientName: "Nguyễn Văn A",
    phone: "0123456789",
    bookingCode: "BK123453",
  },
]

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

  const filterAppointments = (status?: string) => {
    if (status === "all") return mockAppointments
    return mockAppointments.filter((apt) => apt.status === status)
  }

  const getTabCounts = () => {
    return {
      all: mockAppointments.length,
      pending: mockAppointments.filter((apt) => apt.status === "pending").length,
      confirmed: mockAppointments.filter((apt) => apt.status === "confirmed").length,
      completed: mockAppointments.filter((apt) => apt.status === "completed").length,
      cancelled: mockAppointments.filter((apt) => apt.status === "cancelled").length,
    }
  }

  const counts = getTabCounts()

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const config = statusConfig[appointment.status]

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>
              <p className="text-muted-foreground mb-1">{appointment.doctorTitle}</p>
              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-primary">{appointment.price}</div>
              <div className="text-sm text-muted-foreground">#{appointment.bookingCode}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(appointment.date).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.patientName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm mb-4">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.location}</span>
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

            {appointment.status === "confirmed" && (
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
          appointment={selectedAppointment}
          open={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {cancellingAppointment && (
        <CancelAppointmentDialog
          appointment={cancellingAppointment}
          open={!!cancellingAppointment}
          onClose={() => setCancellingAppointment(null)}
        />
      )}

      {ratingAppointment && (
        <RatingDialog
          appointment={ratingAppointment}
          open={!!ratingAppointment}
          onClose={() => setRatingAppointment(null)}
        />
      )}
    </div>
  )
}
