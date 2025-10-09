"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Stethoscope, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem("user")
      if (user) {
        const userData = JSON.parse(user)
        setIsLoggedIn(true)
        setUserName(userData.name || userData.email)
      }
    }

    checkLoginStatus()

    // Listen for storage changes to update login status across tabs
    window.addEventListener("storage", checkLoginStatus)
    return () => window.removeEventListener("storage", checkLoginStatus)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })

      localStorage.removeItem("user")
      localStorage.removeItem("token") // xoá token JWT
      setIsLoggedIn(false)
      setUserName("")
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link href="/doctors" className="text-foreground hover:text-primary transition-colors">
              Bác sĩ
            </Link>
            <Link href="/booking" className="text-foreground hover:text-primary transition-colors">
              Đặt lịch
            </Link>
            <Link href="/appointments" className="text-foreground hover:text-primary transition-colors">
              Lịch hẹn
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Liên hệ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{userName}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
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
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <Link href="/doctors" className="text-foreground hover:text-primary transition-colors">
                Bác sĩ
              </Link>
              <Link href="/booking" className="text-foreground hover:text-primary transition-colors">
                Đặt lịch
              </Link>
              <Link href="/appointments" className="text-foreground hover:text-primary transition-colors">
                Lịch hẹn
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Liên hệ
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 text-foreground p-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{userName}</span>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Đăng ký</Link>
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
