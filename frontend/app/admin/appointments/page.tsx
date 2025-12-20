"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { adminApi } from "@/lib/admin-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Stethoscope, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AppointmentRow {
  id: number
  patient_name: string
  patient_phone: string
  patient_email: string
  specialty: string
  appointment_date: string
  appointment_time: string
  status: string
  created_at: string
  gender: string | null
  symptoms: string | null
  rating: number | null
  doctor_name: string
  doctor_price: string
  user_name: string | null
}

export default function AdminAppointmentsPage() {
  const router = useRouter()
  const { isLoggedIn, loading } = useAdminAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingAppointment, setCancellingAppointment] = useState<AppointmentRow | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace("/admin/login")
      } else {
        fetchAppointments()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isLoggedIn])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("admin_token")
      if (!token) {
        throw new Error("Không tìm thấy token admin")
      }

      const appointmentsData = await adminApi.getAppointments(token)
      setAppointments(appointmentsData || [])
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAppointment = async () => {
    if (!cancellingAppointment) return

    try {
      setIsCancelling(true)
      const token = localStorage.getItem("admin_token")
      if (!token) {
        throw new Error("Không tìm thấy token admin")
      }

      await adminApi.cancelAppointment(token, cancellingAppointment.id)
      
      toast({
        title: "Thành công",
        description: "Đã hủy lịch hẹn thành công",
      })

      setCancellingAppointment(null)
      await fetchAppointments()
    } catch (error: any) {
      console.error("Failed to cancel appointment:", error)
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể hủy lịch hẹn",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Quản lý Lịch hẹn</h2>
        <p className="text-slate-400">Xem và quản lý tất cả lịch hẹn trong hệ thống</p>
      </div>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-white">Tất cả lịch hẹn</CardTitle>
              <CardDescription className="text-slate-400">
                Tổng số: {appointments.length} lịch hẹn
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-400">Đang tải dữ liệu...</div>
          ) : appointments.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">Chưa có lịch hẹn nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 bg-slate-900/70">
                    <TableHead className="text-slate-300">Bệnh nhân</TableHead>
                    <TableHead className="text-slate-300">Bác sĩ</TableHead>
                    <TableHead className="text-slate-300">Chuyên khoa</TableHead>
                    <TableHead className="text-slate-300">Thời gian</TableHead>
                    <TableHead className="text-slate-300">Trạng thái</TableHead>
                    <TableHead className="text-slate-300">Giá</TableHead>
                    <TableHead className="text-right text-slate-300">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id} className="border-slate-800">
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-medium text-white">{appointment.patient_name}</div>
                          <div className="text-xs text-slate-500">
                            {appointment.patient_phone}
                            {appointment.patient_email ? ` · ${appointment.patient_email}` : ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">{appointment.doctor_name}</div>
                        <div className="text-xs text-slate-500">
                          {appointment.user_name ? `Người đặt: ${appointment.user_name}` : "Khách lẻ"}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{appointment.specialty}</TableCell>
                      <TableCell className="text-slate-300">
                        {appointment.appointment_date} · {appointment.appointment_time}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`capitalize ${
                            appointment.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : appointment.status === "confirmed"
                                ? "bg-blue-500/20 text-blue-200"
                                : appointment.status === "pending"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-slate-700 text-slate-200"
                          }`}
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-200 font-medium">
                        {appointment.doctor_price}
                      </TableCell>
                      <TableCell className="text-right">
                        {appointment.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCancellingAppointment(appointment)}
                            className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Hủy lịch
                          </Button>
                        )}
                        {appointment.status !== "pending" && (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="text-slate-500">
                  Dữ liệu cập nhật gần nhất lúc {new Date().toLocaleString("vi-VN")}
                </TableCaption>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={!!cancellingAppointment} onOpenChange={(open) => !open && setCancellingAppointment(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Xác nhận hủy lịch hẹn</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Bạn có chắc muốn hủy lịch hẹn của{" "}
              <span className="font-semibold text-white">{cancellingAppointment?.patient_name}</span>?
              <br />
              <br />
              <span className="text-sm">
                Bác sĩ: {cancellingAppointment?.doctor_name}
                <br />
                Thời gian: {cancellingAppointment?.appointment_date} - {cancellingAppointment?.appointment_time}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? "Đang xử lý..." : "Xác nhận hủy"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

