"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Stethoscope, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/hooks/useAuth"
import { useDoctorAuth } from "@/app/hooks/useDoctorAuth"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { isLoggedIn, user, logout } = useAuth()
  const { isLoggedIn: isDoctorLoggedIn, doctor, logout: doctorLogout } = useDoctorAuth()

  // Listen for storage events to update auth state (only between tabs/windows)
  useEffect(() => {
    const handleStorageChange = () => {
      // Only reload if storage changed from another tab/window
      window.location.reload()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = async () => {
    try {
      if (isDoctorLoggedIn) {
        await doctorLogout()
      } else {
        await logout()
      }
      router.push("/")
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }


  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MedBooking</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Trang chủ
            </Link>
            {!isDoctorLoggedIn && (
              <>
                <Link href="/doctors" className="text-foreground hover:text-primary transition-colors font-medium">
                  Bác sĩ
                </Link>
                <Link href="/booking" className="text-foreground hover:text-primary transition-colors font-medium">
                  Đặt lịch
                </Link>
                <Link href="/appointments" className="text-foreground hover:text-primary transition-colors font-medium">
                  Lịch hẹn
                </Link>
              </>
            )}
            {isDoctorLoggedIn && (
              <Link href="/doctor-dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
                Dashboard
              </Link>
            )}
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Liên hệ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isDoctorLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-foreground bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{doctor?.name}</span>
                </div>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-foreground bg-muted/50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.name || user?.email}</span>
                </div>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
                <div className="h-6 w-px bg-border"></div>
                <Button variant="outline" asChild size="sm">
                  <Link href="/doctor-login">Bác sĩ</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
                Trang chủ
              </Link>
              {!isDoctorLoggedIn && (
                <>
                  <Link href="/doctors" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
                    Bác sĩ
                  </Link>
                  <Link href="/booking" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
                    Đặt lịch
                  </Link>
                  <Link href="/appointments" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
                    Lịch hẹn
                  </Link>
                </>
              )}
              {isDoctorLoggedIn && (
                <Link href="/doctor-dashboard" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
                  Dashboard
                </Link>
              )}
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
                Liên hệ
              </Link>
              
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                {isDoctorLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 text-foreground p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{doctor?.name}</span>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </>
                ) : isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 text-foreground p-3 bg-muted/50 rounded-lg">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{user?.name || user?.email}</span>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register">Đăng ký</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/doctor-login">Đăng nhập bác sĩ</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
