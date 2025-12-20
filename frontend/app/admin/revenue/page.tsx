"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { adminApi } from "@/lib/admin-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface RevenueTotals {
  total_completed: number
  total_revenue_vnd: number
}

interface MonthlyRevenue {
  month: string
  completed_count: number
  revenue_vnd: number
}

export default function AdminRevenuePage() {
  const router = useRouter()
  const { isLoggedIn, loading } = useAdminAuth()
  const [revenueTotals, setRevenueTotals] = useState<RevenueTotals>({
    total_completed: 0,
    total_revenue_vnd: 0,
  })
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace("/admin/login")
      } else {
        fetchRevenue()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isLoggedIn])

  const fetchRevenue = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("admin_token")
      if (!token) {
        throw new Error("Không tìm thấy token admin")
      }

      const revenueData = await adminApi.getRevenue(token)

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
    } catch (error) {
      console.error("Failed to fetch revenue:", error)
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Thống kê Doanh thu</h2>
        <p className="text-slate-400">Báo cáo doanh thu từ các lịch hẹn đã hoàn thành</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Lịch hẹn hoàn thành</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{revenueTotals.total_completed}</div>
            <p className="text-xs text-slate-500 mt-1">Tổng số lịch có trạng thái completed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tổng doanh thu</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(revenueTotals.total_revenue_vnd)}</div>
            <p className="text-xs text-slate-500 mt-1">Tổng phí khám từ lịch hẹn hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue */}
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-white">Doanh thu 12 tháng gần nhất</CardTitle>
              <CardDescription className="text-slate-400">
                Chỉ tính các lịch hẹn có trạng thái <span className="text-emerald-400">completed</span>.
              </CardDescription>
            </div>
          </div>
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

