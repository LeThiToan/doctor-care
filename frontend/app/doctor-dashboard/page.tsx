"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDoctorAuth } from "@/app/hooks/useDoctorAuth"
import { doctorsApi } from "@/lib/doctors-api"
import { 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  LogOut, 
  Stethoscope, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from "lucide-react"

interface Appointment {
  id: string
  patient_name: string
  patient_phone: string
  patient_email?: string
  appointment_date: string
  appointment_time: string
  status: string
  specialty?: string
  symptoms?: string
  gender?: string
  date_of_birth?: string
  created_at: string
}

export default function DoctorDashboard() {
  const { isLoggedIn, doctor, loading, logout } = useDoctorAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/doctor-login')
    }
  }, [isLoggedIn, loading, router])

  useEffect(() => {
    if (isLoggedIn && doctor) {
      fetchAppointments()
    }
  }, [isLoggedIn, doctor])

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true)
      const data = await doctorsApi.getDoctorAppointments()
      setAppointments(data)
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn:", error)
    } finally {
      setAppointmentsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      setUpdatingStatus(appointmentId)
      await doctorsApi.updateAppointmentStatus(appointmentId, newStatus)
      await fetchAppointments()
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error)
      alert("Có lỗi xảy ra khi cập nhật trạng thái!")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-700 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
      case 'completed': return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-700 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận'
      case 'pending': return 'Chờ xác nhận'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle2 className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getFilteredAppointments = (status: string) => {
    if (status === "all") return appointments
    return appointments.filter(appointment => appointment.status === status)
  }

  const getAppointmentCounts = () => {
    return {
      all: appointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length
    }
  }

  const counts = getAppointmentCounts()
  const todayAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date).toDateString() === new Date().toDateString()
  ).length

  const renderAppointmentList = (appointments: Appointment[]) => {
    if (appointmentsLoading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Đang tải lịch hẹn...</p>
        </div>
      )
    }

    if (appointments.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Chưa có lịch hẹn nào</p>
          <p className="text-sm text-muted-foreground">Lịch hẹn mới sẽ xuất hiện ở đây</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-foreground">{appointment.patient_name}</h3>
                      <Badge 
                        className={`${getStatusColor(appointment.status)} border flex items-center gap-1 px-2 py-1`}
                      >
                        {getStatusIcon(appointment.status)}
                        {getStatusText(appointment.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {appointment.patient_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{appointment.patient_phone}</span>
                        </div>
                      )}
                      {appointment.patient_email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{appointment.patient_email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày khám</p>
                    <p className="font-semibold text-sm">
                      {new Date(appointment.appointment_date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Giờ khám</p>
                    <p className="font-semibold text-sm">{appointment.appointment_time}</p>
                  </div>
                </div>
                {appointment.specialty && (
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Chuyên khoa</p>
                      <p className="font-semibold text-sm">{appointment.specialty}</p>
                    </div>
                  </div>
                )}
                {appointment.gender && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Giới tính</p>
                      <p className="font-semibold text-sm">
                        {appointment.gender === 'male' ? 'Nam' : appointment.gender === 'female' ? 'Nữ' : 'Khác'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {appointment.symptoms && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Triệu chứng</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">{appointment.symptoms}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Update Buttons */}
              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Cập nhật trạng thái</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {appointment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                          disabled={updatingStatus === appointment.id}
                          className="gap-2"
                        >
                          {updatingStatus === appointment.id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Xác nhận
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                          disabled={updatingStatus === appointment.id}
                          className="gap-2"
                        >
                          {updatingStatus === appointment.id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Hoàn thành
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                          disabled={updatingStatus === appointment.id}
                          className="gap-2"
                        >
                          {updatingStatus === appointment.id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Hủy lịch
                            </>
                          )}
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                        disabled={updatingStatus === appointment.id}
                        className="gap-2"
                      >
                        {updatingStatus === appointment.id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Hoàn thành
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Status Info for completed and cancelled */}
              {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                <div className="border-t pt-4 mt-4">
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${appointment.status === 'completed' ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'}`}>
                    {appointment.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                          Lịch hẹn đã hoàn thành - Không thể thay đổi trạng thái
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-300">
                          Lịch hẹn đã hủy - Không thể thay đổi trạng thái
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <div className="text-muted-foreground">Đang tải...</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <Card className="border-none shadow-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                    <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                      <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                      Chào mừng, {doctor?.name}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Trang quản lý lịch hẹn bác sĩ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tổng lịch hẹn</p>
                    <p className="text-3xl font-bold text-foreground">{appointments.length}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Hôm nay</p>
                    <p className="text-3xl font-bold text-foreground">{todayAppointments}</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Chờ xác nhận</p>
                    <p className="text-3xl font-bold text-foreground">{counts.pending}</p>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Hoàn thành</p>
                    <p className="text-3xl font-bold text-foreground">{counts.completed}</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List with Tabs */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Lịch hẹn bệnh nhân</CardTitle>
                  <CardDescription className="text-base">
                    Quản lý và cập nhật trạng thái lịch hẹn
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-6 bg-muted/30">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-background border shadow-sm">
                    <TabsTrigger value="all" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Tất cả ({counts.all})
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Chờ ({counts.pending})
                    </TabsTrigger>
                    <TabsTrigger value="confirmed" className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Đã xác nhận ({counts.confirmed})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Hoàn thành ({counts.completed})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="gap-2">
                      <XCircle className="h-4 w-4" />
                      Đã hủy ({counts.cancelled})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-6 pb-6 pt-6">
                  <TabsContent value="all" className="mt-0">
                    {renderAppointmentList(getFilteredAppointments("all"))}
                  </TabsContent>

                  <TabsContent value="pending" className="mt-0">
                    {renderAppointmentList(getFilteredAppointments("pending"))}
                  </TabsContent>

                  <TabsContent value="confirmed" className="mt-0">
                    {renderAppointmentList(getFilteredAppointments("confirmed"))}
                  </TabsContent>

                  <TabsContent value="completed" className="mt-0">
                    {renderAppointmentList(getFilteredAppointments("completed"))}
                  </TabsContent>

                  <TabsContent value="cancelled" className="mt-0">
                    {renderAppointmentList(getFilteredAppointments("cancelled"))}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
