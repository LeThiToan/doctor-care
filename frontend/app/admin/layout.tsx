"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Stethoscope, CalendarDays, Users2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, loading, admin, logout } = useAdminAuth()

  // Tất cả hooks phải được gọi trước khi có early return
  useEffect(() => {
    // Chỉ redirect nếu không phải trang login
    if (pathname !== "/admin/login" && pathname !== "/login/admin" && !loading && !isLoggedIn) {
      router.replace("/admin/login")
    }
  }, [loading, isLoggedIn, router, pathname])

  const handleLogout = () => {
    logout()
    router.replace("/admin/login")
  }

  // Không áp dụng layout cho trang login - return children ngay lập tức
  if (pathname === "/admin/login" || pathname === "/login/admin") {
    return <>{children}</>
  }

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mb-4"></div>
          <div>Đang tải...</div>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/doctors", label: "Bác sĩ", icon: Stethoscope },
    { href: "/admin/appointments", label: "Lịch hẹn", icon: CalendarDays },
    { href: "/admin/patients", label: "Bệnh nhân", icon: Users2 },
    { href: "/admin/revenue", label: "Doanh thu", icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">MedBooking Admin</h1>
            <p className="text-sm text-slate-400">Xin chào, {admin?.name || "Quản trị viên"}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/40 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
