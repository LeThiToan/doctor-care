"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { adminApi } from "@/lib/admin-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, TrendingUp, Users2, Stethoscope } from "lucide-react"
import Link from "next/link"

interface RevenueTotals {
  total_completed: number
  total_revenue_vnd: number
}

interface MonthlyRevenue {
  month: string
  completed_count: number
  revenue_vnd: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isLoggedIn, loading } = useAdminAuth()
  const [revenueTotals, setRevenueTotals] = useState<RevenueTotals>({
    total_completed: 0,
    total_revenue_vnd: 0,
  })
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace("/admin/login")
      } else {
        fetchDashboardData()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isLoggedIn])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("admin_token")
      if (!token) {
        throw new Error("Không tìm thấy token admin")
      }

      const [appointmentsData, revenueData, doctorsData, patientsData] = await Promise.all([
        adminApi.getAppointments(token),
        adminApi.getRevenue(token),
        adminApi.getDoctors(token),
        adminApi.getPatients(token),
      ])

      setTotalAppointments(appointmentsData?.length || 0)

      const totals = revenueData?.totals || { total_completed: 0, total_revenue_vnd: 0 }
      setRevenueTotals({
        total_completed: Number(totals.total_completed) || 0,
        total_revenue_vnd: Number(totals.total_revenue_vnd) || 0,
      })

      const monthlyList: MonthlyRevenue[] = Array.isArray(revenueData?.monthly)
        ? revenueData.monthly.map((item: any) => ({
            month: item.month,
            completed_count: Number(item.completed_count) || 0,
            revenue_vnd: Number(item.revenue_vnd) || 0,
          }))
        : []
      setMonthlyRevenue(monthlyList)

      setTotalDoctors(doctorsData?.length || 0)
      setTotalPatients(patientsData?.length || 0)
    } catch (error) {
      console.error("Failed to load admin dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0)
  }

  if (loading || !isLoggedIn) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-slate-400">Tổng quan hệ thống MedBooking</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tổng lịch hẹn</CardTitle>
            <CalendarDays className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalAppointments}</div>
            <p className="text-xs text-slate-500 mt-1">Bao gồm tất cả trạng thái</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Lịch hẹn hoàn thành</CardTitle>
            <Users2 className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{revenueTotals.total_completed}</div>
            <p className="text-xs text-slate-500 mt-1">Tổng số lịch có trạng thái completed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Doanh thu hoàn thành</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(revenueTotals.total_revenue_vnd)}</div>
            <p className="text-xs text-slate-500 mt-1">Tổng phí khám từ lịch hẹn hoàn thành</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tổng bác sĩ</CardTitle>
            <Stethoscope className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalDoctors}</div>
            <p className="text-xs text-slate-500 mt-1">Số lượng bác sĩ trong hệ thống</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/doctors">
          <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-8 w-8 text-emerald-400" />
                <div>
                  <h3 className="font-semibold text-white">Quản lý Bác sĩ</h3>
                  <p className="text-sm text-slate-400">Thêm, sửa, xóa bác sĩ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/appointments">
          <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-8 w-8 text-emerald-400" />
                <div>
                  <h3 className="font-semibold text-white">Quản lý Lịch hẹn</h3>
                  <p className="text-sm text-slate-400">Xem tất cả lịch hẹn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/patients">
          <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users2 className="h-8 w-8 text-emerald-400" />
                <div>
                  <h3 className="font-semibold text-white">Quản lý Bệnh nhân</h3>
                  <p className="text-sm text-slate-400">Xem danh sách bệnh nhân</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/revenue">
          <Card className="bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
                <div>
                  <h3 className="font-semibold text-white">Thống kê Doanh thu</h3>
                  <p className="text-sm text-slate-400">Xem báo cáo doanh thu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Monthly Revenue */}
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Doanh thu 12 tháng gần nhất</CardTitle>
          <CardDescription className="text-slate-400">
            Chỉ tính các lịch hẹn có trạng thái <span className="text-emerald-400">completed</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-400">Đang tải dữ liệu...</div>
          ) : monthlyRevenue.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có dữ liệu doanh thu.</p>
          ) : (
            <ul className="space-y-3">
              {monthlyRevenue.map((item) => (
                <li
                  key={item.month}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.month}</p>
                    <p className="text-xs text-slate-500">{item.completed_count} lịch hoàn thành</p>
                  </div>
                  <div className="text-sm font-semibold text-emerald-400">
                    {formatCurrency(item.revenue_vnd)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
