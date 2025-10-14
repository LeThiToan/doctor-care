"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MessageSquare } from "lucide-react"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    supportType: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Gửi thất bại")

      const data = await res.json()
      if (data.success) {
        alert("✅ Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.")
        setFormData({ name: "", email: "", phone: "", supportType: "", message: "" })
      } else {
        alert("❌ Gửi thất bại, vui lòng thử lại sau!")
      }
    } catch (error) {
      alert("❌ Có lỗi xảy ra, vui lòng thử lại.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const canSubmit = formData.name && formData.email && formData.supportType && formData.message

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="0123456789"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supportType">Chủ đề *</Label>
        <Select value={formData.supportType} onValueChange={(value) => handleChange("supportType", value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Chọn chủ đề" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Hỗ trợ đặt lịch">Hỗ trợ đặt lịch</SelectItem>
            <SelectItem value="Vấn đề kỹ thuật">Vấn đề kỹ thuật</SelectItem>
            <SelectItem value="Thanh toán">Thanh toán</SelectItem>
            <SelectItem value="Khiếu nại">Khiếu nại</SelectItem>
            <SelectItem value="Góp ý">Góp ý</SelectItem>
            <SelectItem value="Khác">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Tin nhắn *</Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="message"
            placeholder="Nhập nội dung tin nhắn của bạn..."
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="pl-10 min-h-[120px]"
            required
          />
        </div>
      </div>

      <div className="bg-muted p-3 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Chúng tôi cam kết bảo mật thông tin cá nhân của bạn và sẽ phản hồi trong vòng 24 giờ làm việc.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
      </Button>
    </form>
  )
}
