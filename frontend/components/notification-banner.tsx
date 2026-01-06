"use client"

import { useState, useEffect } from "react"
import { X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem("notification-banner-dismissed")
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("notification-banner-dismissed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 rounded-lg mx-4 mt-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/images/lopgo..png" 
            alt="MedBooking Logo" 
            className="h-6 w-auto object-contain"
          />
          <span className="text-sm text-gray-700">
            <span className="font-semibold">MedBooking</span>
            <span className="text-gray-500"> - Đặt lịch khám bệnh</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  )
}









