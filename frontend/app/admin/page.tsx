"use client"

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { adminApi } from "@/lib/admin-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CalendarDays,
  LogOut,
  Pencil,
  PlusCircle,
  Stethoscope,
  Trash2,
  TrendingUp,
  Users2,
} from "lucide-react"

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

interface RevenueTotals {
  total_completed: number
  total_revenue_vnd: number
}

interface MonthlyRevenue {
  month: string
  completed_count: number
  revenue_vnd: number
}

interface DoctorListItem {
  id: number
  name: string
  title: string | null
  specialty: string | null
  experience: string | null
  rating: number
  reviews: number
  price: string | null
  avatar: string | null
  education: string[] | null
  languages: string[] | null
  description: string | null
  email: string | null
  account_email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Patient {
  id: number
  name: string
  email: string
  created_at: string
}

const defaultDoctorForm = {
  name: "",
  title: "",
  specialty: "",
  experience: "",
  price: "",
  email: "",
  password: "",
  avatar: "",
  education: "",
  languages: "",
  description: "",
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isLoggedIn, loading, admin, logout } = useAdminAuth()
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [doctors, setDoctors] = useState<DoctorListItem[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [revenueTotals, setRevenueTotals] = useState<RevenueTotals>({
    total_completed: 0,
    total_revenue_vnd: 0,
  })
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true)
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)
  const [doctorForm, setDoctorForm] = useState(() => ({ ...defaultDoctorForm }))
  const [createDoctorAccount, setCreateDoctorAccount] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null)
  const [doctorResult, setDoctorResult] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isCreatingDoctor, setIsCreatingDoctor] = useState(false)
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarObjectUrlRef = useRef<string | null>(null)

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

  const refreshDoctorsAndPatients = async (tokenParam?: string) => {
    try {
      setIsLoadingDoctors(true)
      setIsLoadingPatients(true)
      const token = tokenParam || localStorage.getItem("admin_token")
      if (!token) {
        throw new Error("Không tìm thấy token admin")
      }

      const [doctorsData, patientsData] = await Promise.all([
        adminApi.getDoctors(token),
        adminApi.getPatients(token),
      ])

      setDoctors(doctorsData || [])
      setPatients(patientsData || [])
    } catch (error) {
      console.error("Failed to refresh doctors/patients:", error)
    } finally {
      setIsLoadingDoctors(false)
      setIsLoadingPatients(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setIsLoadingData(true)
      const token = localStorage.getItem("admin_token")
      if (!token) {
        throw new Error("Không tìm thấy token admin")
      }

      const [appointmentsData, revenueData] = await Promise.all([
        adminApi.getAppointments(token),
        adminApi.getRevenue(token),
      ])

      setAppointments(appointmentsData)

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

      await refreshDoctorsAndPatients(token)
    } catch (error) {
      console.error("Failed to load admin dashboard:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0)
  }

  const formatDate = (value: string) => {
    if (!value) return "-"
    try {
      return new Date(value).toLocaleDateString("vi-VN")
    } catch {
      return value
    }
  }

  const recentAppointments = useMemo(() => {
    return appointments.slice(0, 10)
  }, [appointments])

  const recentPatients = useMemo(() => {
    return patients.slice(0, 12)
  }, [patients])

  const buildAvatarPreviewUrl = (avatar?: string | null) => {
    if (!avatar) return null
    if (avatar.startsWith("blob:") || avatar.startsWith("data:")) return avatar
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar
    if (avatar.startsWith("/")) return avatar
    if (avatar.includes("/")) {
      return `/${avatar.replace(/^\/+/, "")}`
    }
    return `/images/doctors/${avatar}`
  }

  const revokeAvatarObjectUrl = () => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current)
      avatarObjectUrlRef.current = null
    }
  }

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    revokeAvatarObjectUrl()
    const objectUrl = URL.createObjectURL(file)
    avatarObjectUrlRef.current = objectUrl
    setSelectedAvatarFile(file)
    setAvatarPreview(objectUrl)
    setDoctorForm((prev) => ({
      ...prev,
      avatar: file.name,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerAvatarFileDialog = () => {
    fileInputRef.current?.click()
  }

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleDoctorFormChange = (field: keyof typeof doctorForm, value: string) => {
    setDoctorForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetDoctorForm = () => {
    revokeAvatarObjectUrl()
    setSelectedAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setDoctorForm({ ...defaultDoctorForm })
    setCreateDoctorAccount(false)
    setFormMode("create")
    setEditingDoctorId(null)
  }

  const handleSubmitDoctorForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDoctorResult(null)

    if (!doctorForm.name || !doctorForm.specialty || !doctorForm.price) {
      setDoctorResult({
        type: "error",
        message: "Tên bác sĩ, chuyên khoa và giá khám là bắt buộc.",
      })
      return
    }

    if (
      formMode === "create" &&
      createDoctorAccount &&
      (!doctorForm.email || !doctorForm.password)
    ) {
      setDoctorResult({
        type: "error",
        message: "Cần nhập email và mật khẩu nếu muốn tạo tài khoản đăng nhập cho bác sĩ.",
      })
      return
    }

    const token = localStorage.getItem("admin_token")
    if (!token) {
      setDoctorResult({
        type: "error",
        message: "Không tìm thấy token admin, vui lòng đăng nhập lại.",
      })
      return
    }

    setIsCreatingDoctor(true)
    try {
      let avatarFileName: string | null = doctorForm.avatar ? doctorForm.avatar : null

      if (selectedAvatarFile) {
        const base64 = await fileToBase64(selectedAvatarFile)
        const uploadResult = await adminApi.uploadDoctorAvatar(token, {
          fileName: selectedAvatarFile.name,
          fileData: base64,
        })
        avatarFileName = uploadResult.fileName
      }

      const payload = {
        name: doctorForm.name,
        title: doctorForm.title,
        specialty: doctorForm.specialty,
        experience: doctorForm.experience,
        price: doctorForm.price,
        avatar: avatarFileName || null,
        education: doctorForm.education
          ? doctorForm.education.split(",").map((item) => item.trim()).filter(Boolean)
          : undefined,
        languages: doctorForm.languages
          ? doctorForm.languages.split(",").map((item) => item.trim()).filter(Boolean)
          : undefined,
        description: doctorForm.description || null,
        email: doctorForm.email || null,
      } as any

      const passwordToSend =
        doctorForm.password && doctorForm.password.trim().length > 0
          ? doctorForm.password
          : undefined

      if (formMode === "create") {
        await adminApi.createDoctor(token, {
          ...payload,
          doctorPassword: passwordToSend || null,
          createDoctorAccount,
        })

        setDoctorResult({
          type: "success",
          message: "Thêm bác sĩ thành công!",
        })
        resetDoctorForm()
      } else if (editingDoctorId) {
        await adminApi.updateDoctor(token, editingDoctorId, {
          ...payload,
          password: passwordToSend,
        })

        setDoctorResult({
          type: "success",
          message: "Cập nhật bác sĩ thành công!",
        })
        setSelectedAvatarFile(null)
        revokeAvatarObjectUrl()
        const previewUrl = buildAvatarPreviewUrl(avatarFileName)
        setAvatarPreview(previewUrl)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        setDoctorForm((prev) => ({
          ...prev,
          avatar: avatarFileName || "",
          password: "",
        }))
      }

      await refreshDoctorsAndPatients()
    } catch (error: any) {
      console.error("Create doctor error:", error)
      setDoctorResult({
        type: "error",
        message: error?.message || (formMode === "edit" ? "Không thể cập nhật bác sĩ." : "Không thể thêm bác sĩ."),
      })
    } finally {
      setIsCreatingDoctor(false)
    }
  }

  const handleEditDoctor = (doctor: DoctorListItem) => {
    setDoctorResult(null)
    setFormMode("edit")
    setEditingDoctorId(doctor.id)
    setCreateDoctorAccount(false)
    revokeAvatarObjectUrl()
    setSelectedAvatarFile(null)
    setAvatarPreview(buildAvatarPreviewUrl(doctor.avatar))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setDoctorForm({
      name: doctor.name || "",
      title: doctor.title || "",
      specialty: doctor.specialty || "",
      experience: doctor.experience || "",
      price: doctor.price || "",
      avatar: doctor.avatar || "",
      education: doctor.education?.join(", ") || "",
      languages: doctor.languages?.join(", ") || "",
      description: doctor.description || "",
      email: doctor.account_email || doctor.email || "",
      password: "",
    })
  }

  const handleCancelEdit = () => {
    resetDoctorForm()
    setDoctorResult(null)
  }

  const handleDeleteDoctor = async (doctor: DoctorListItem) => {
    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa bác sĩ "${doctor.name}"?`)
    if (!confirmDelete) return

    const token = localStorage.getItem("admin_token")
    if (!token) {
      setDoctorResult({
        type: "error",
        message: "Không tìm thấy token admin, vui lòng đăng nhập lại.",
      })
      return
    }

    try {
      await adminApi.deleteDoctor(token, doctor.id)
      setDoctorResult({
        type: "success",
        message: `Đã xóa bác sĩ ${doctor.name}`,
      })
      if (formMode === "edit" && editingDoctorId === doctor.id) {
        resetDoctorForm()
      }
      await refreshDoctorsAndPatients()
    } catch (error: any) {
      console.error("Delete doctor error:", error)
      setDoctorResult({
        type: "error",
        message: error?.message || "Không thể xóa bác sĩ.",
      })
    }
  }

  const handleLogout = () => {
    logout()
    router.replace("/admin/login")
  }

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        Đang tải bảng điều khiển...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Bảng điều khiển admin</h1>
            <p className="text-sm text-slate-400">Xin chào, {admin?.name || "Quản trị viên"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-emerald-500/40 text-emerald-400" onClick={fetchDashboardData}>
              Làm mới dữ liệu
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Lịch hẹn hoàn thành</CardTitle>
              <Users2 className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{revenueTotals.total_completed}</div>
              <p className="text-xs text-slate-500">Tổng số lịch có trạng thái completed</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Doanh thu hoàn thành</CardTitle>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(revenueTotals.total_revenue_vnd)}</div>
              <p className="text-xs text-slate-500">Tổng phí khám từ lịch hẹn hoàn thành</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Tổng lịch hiện có</CardTitle>
              <CalendarDays className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{appointments.length}</div>
              <p className="text-xs text-slate-500">Bao gồm tất cả trạng thái</p>
            </CardContent>
          </Card>
        </section>

        {/* Doctor creation / editor */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">
                    {formMode === "create" ? "Thêm bác sĩ mới" : `Chỉnh sửa: ${doctorForm.name || "Bác sĩ"}`}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Điền thông tin cơ bản của bác sĩ. Các trường languages, education có thể nhập danh sách cách nhau bởi dấu phẩy.
                  </CardDescription>
                </div>
                {formMode === "edit" && (
                  <Button variant="outline" onClick={handleCancelEdit} className="border-slate-700 text-slate-300">
                    Hủy chỉnh sửa
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {doctorResult && (
                <div
                  className={`mb-4 rounded-md border px-3 py-2 text-sm ${
                    doctorResult.type === "success"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-red-500/40 bg-red-500/10 text-red-200"
                  }`}
                >
                  {doctorResult.message}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmitDoctorForm}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-name">Tên bác sĩ *</Label>
                    <Input
                      id="doctor-name"
                      value={doctorForm.name}
                      onChange={(event) => handleDoctorFormChange("name", event.target.value)}
                      placeholder="VD: BS. Nguyễn Văn A"
                      required
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-title">Chức danh</Label>
                    <Input
                      id="doctor-title"
                      value={doctorForm.title}
                      onChange={(event) => handleDoctorFormChange("title", event.target.value)}
                      placeholder="Bác sĩ chuyên khoa I"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-specialty">Chuyên khoa *</Label>
                    <Input
                      id="doctor-specialty"
                      value={doctorForm.specialty}
                      onChange={(event) => handleDoctorFormChange("specialty", event.target.value)}
                      placeholder="Tim mạch, Tiêu hóa..."
                      required
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-experience">Kinh nghiệm</Label>
                    <Input
                      id="doctor-experience"
                      value={doctorForm.experience}
                      onChange={(event) => handleDoctorFormChange("experience", event.target.value)}
                      placeholder="10 năm kinh nghiệm"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-price">Giá khám *</Label>
                    <Input
                      id="doctor-price"
                      value={doctorForm.price}
                      onChange={(event) => handleDoctorFormChange("price", event.target.value)}
                      placeholder="Ví dụ: 320.000đ"
                      required
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-avatar">Ảnh đại diện (tên file)</Label>
                    <Input
                      id="doctor-avatar"
                      value={doctorForm.avatar}
                      onChange={(event) => handleDoctorFormChange("avatar", event.target.value)}
                      placeholder="bs-new.jpg hoặc để trống"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-avatar">Ảnh đại diện</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Input
                        id="doctor-avatar"
                        value={doctorForm.avatar}
                        readOnly
                        placeholder="Chưa chọn ảnh"
                        className="bg-slate-900 border-slate-700 text-white sm:flex-1"
                      />
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={triggerAvatarFileDialog}>
                          Chọn ảnh
                        </Button>
                        {avatarPreview && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              revokeAvatarObjectUrl()
                              setSelectedAvatarFile(null)
                              setAvatarPreview(null)
                              setDoctorForm((prev) => ({ ...prev, avatar: "" }))
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                              }
                            }}
                            className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                          >
                            Xóa
                          </Button>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />
                    {avatarPreview ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="h-20 w-20 rounded-full border border-slate-700 object-cover"
                        />
                        <p className="text-xs text-slate-500">
                          Ảnh sẽ được lưu vào thư viện bác sĩ và áp dụng cho toàn bộ hệ thống.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Chưa có ảnh đại diện. Sử dụng nút “Chọn ảnh” để tải lên.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-education">Học vấn / Bằng cấp</Label>
                  <Input
                    id="doctor-education"
                    value={doctorForm.education}
                    onChange={(event) => handleDoctorFormChange("education", event.target.value)}
                    placeholder="Ví dụ: Đại học Y Hà Nội, Thạc sĩ Tim mạch"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-languages">Ngôn ngữ</Label>
                  <Input
                    id="doctor-languages"
                    value={doctorForm.languages}
                    onChange={(event) => handleDoctorFormChange("languages", event.target.value)}
                    placeholder="Tiếng Việt, Tiếng Anh"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-description">Mô tả</Label>
                  <Textarea
                    id="doctor-description"
                    value={doctorForm.description}
                    onChange={(event) => handleDoctorFormChange("description", event.target.value)}
                    placeholder="Thông tin chi tiết về bác sĩ..."
                    className="bg-slate-900 border-slate-700 text-white"
                    rows={4}
                  />
                </div>

                {formMode === "create" ? (
                  <div className="rounded-md border border-slate-800 bg-slate-900/40 p-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="doctor-account"
                        checked={createDoctorAccount}
                        onCheckedChange={(value) => setCreateDoctorAccount(Boolean(value))}
                      />
                      <Label htmlFor="doctor-account">Tạo tài khoản đăng nhập cho bác sĩ</Label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-email">
                          Email đăng nhập {createDoctorAccount ? "*" : "(tùy chọn)"}
                        </Label>
                        <Input
                          id="doctor-email"
                          type="email"
                          value={doctorForm.email}
                          onChange={(event) => handleDoctorFormChange("email", event.target.value)}
                          placeholder="Email đăng nhập"
                          className="bg-slate-900 border-slate-700 text-white"
                          disabled={!createDoctorAccount}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-password">
                          Mật khẩu {createDoctorAccount ? "*" : "(tùy chọn)"}
                        </Label>
                        <Input
                          id="doctor-password"
                          type="text"
                          value={doctorForm.password}
                          onChange={(event) => handleDoctorFormChange("password", event.target.value)}
                          placeholder="Nhập mật khẩu ban đầu"
                          className="bg-slate-900 border-slate-700 text-white"
                          disabled={!createDoctorAccount}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                    <p className="text-sm text-slate-400">
                      Cập nhật thông tin đăng nhập cho bác sĩ (để trống mật khẩu nếu không thay đổi).
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-email-edit">Email đăng nhập</Label>
                        <Input
                          id="doctor-email-edit"
                          type="email"
                          value={doctorForm.email}
                          onChange={(event) => handleDoctorFormChange("email", event.target.value)}
                          placeholder="Email đăng nhập"
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-password-edit">Mật khẩu mới (tùy chọn)</Label>
                        <Input
                          id="doctor-password-edit"
                          type="text"
                          value={doctorForm.password}
                          onChange={(event) => handleDoctorFormChange("password", event.target.value)}
                          placeholder="Nhập mật khẩu mới"
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={isCreatingDoctor}
                >
                  {formMode === "create" ? (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isCreatingDoctor ? "Đang thêm bác sĩ..." : "Thêm bác sĩ"}
                    </>
                  ) : (
                    <>
                      <Pencil className="mr-2 h-4 w-4" />
                      {isCreatingDoctor ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Doanh thu 12 tháng gần nhất</CardTitle>
              <CardDescription className="text-slate-400">
                Chỉ tính các lịch hẹn có trạng thái <span className="text-emerald-400">completed</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyRevenue.length === 0 ? (
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
        </section>

        {/* Appointment list */}
        <section>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Stethoscope className="h-5 w-5 text-emerald-400" />
                Lịch hẹn gần đây
              </CardTitle>
              <CardDescription className="text-slate-400">
                Hiển thị tối đa 10 lịch hẹn gần nhất. Sử dụng API admin để lọc chi tiết hơn nếu cần.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="py-10 text-center text-sm text-slate-400">Đang tải dữ liệu...</div>
              ) : recentAppointments.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">Chưa có lịch hẹn nào.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 bg-slate-900/70">
                      <TableHead className="text-slate-300">Bệnh nhân</TableHead>
                      <TableHead className="text-slate-300">Bác sĩ</TableHead>
                      <TableHead className="text-slate-300">Chuyên khoa</TableHead>
                      <TableHead className="text-slate-300">Thời gian</TableHead>
                      <TableHead className="text-slate-300">Trạng thái</TableHead>
                      <TableHead className="text-right text-slate-300">Giá</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAppointments.map((appointment) => (
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
                        <TableCell className="text-right text-slate-200 font-medium">
                          {appointment.doctor_price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption className="text-slate-500">
                    Tổng số lịch: {appointments.length}. Dữ liệu cập nhật gần nhất lúc{" "}
                    {new Date().toLocaleString("vi-VN")}
                  </TableCaption>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Doctors & Patients overview */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Danh sách bác sĩ ({doctors.length})</span>
                <span className="text-xs text-slate-400">
                  Chọn “Chỉnh sửa” để tải thông tin vào biểu mẫu bên trái.
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingDoctors ? (
                <div className="py-10 text-center text-sm text-slate-400">Đang tải danh sách bác sĩ...</div>
              ) : doctors.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">Chưa có bác sĩ nào.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 bg-slate-900/70">
                      <TableHead className="text-slate-300">Bác sĩ</TableHead>
                      <TableHead className="text-slate-300">Chuyên khoa</TableHead>
                      <TableHead className="text-slate-300">Liên hệ</TableHead>
                      <TableHead className="text-slate-300">Trạng thái</TableHead>
                      <TableHead className="text-right text-slate-300">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map((doctor) => (
                      <TableRow key={doctor.id} className="border-slate-800">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-white">{doctor.name}</div>
                            <div className="text-xs text-slate-500">{doctor.title}</div>
                            {doctor.education && doctor.education.length > 0 && (
                              <div className="text-xs text-slate-500">
                                {doctor.education.slice(0, 2).join(" • ")}
                                {doctor.education.length > 2 ? "..." : ""}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div>{doctor.specialty || "-"}</div>
                          {doctor.languages && doctor.languages.length > 0 && (
                            <div className="text-xs text-slate-500">
                              {doctor.languages.join(", ")}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div className="text-sm">{doctor.account_email || doctor.email || "Chưa có"}</div>
                          <div className="text-xs text-slate-500">{formatDate(doctor.created_at)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={doctor.is_active ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-200"}
                          >
                            {doctor.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDoctor(doctor)}
                              className="border-slate-700 text-slate-200"
                            >
                              <Pencil className="mr-1 h-4 w-4" />
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDoctor(doctor)}
                              className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Bệnh nhân gần đây ({patients.length})</CardTitle>
              <CardDescription className="text-slate-400">
                Hiển thị tối đa 12 bệnh nhân mới nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPatients ? (
                <div className="py-10 text-center text-sm text-slate-400">Đang tải danh sách bệnh nhân...</div>
              ) : recentPatients.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">Chưa có bệnh nhân nào.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 bg-slate-900/70">
                      <TableHead className="text-slate-300">Tên</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Ngày tham gia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPatients.map((patient) => (
                      <TableRow key={patient.id} className="border-slate-800">
                        <TableCell className="font-medium text-white">{patient.name}</TableCell>
                        <TableCell className="text-slate-300">{patient.email}</TableCell>
                        <TableCell className="text-slate-300">{formatDate(patient.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption className="text-slate-500">
                    Tổng số bệnh nhân: {patients.length}
                  </TableCaption>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}


