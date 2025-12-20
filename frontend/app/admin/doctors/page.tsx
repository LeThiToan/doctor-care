"use client"

import { useEffect, useState, useRef, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { adminApi } from "@/lib/admin-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, PlusCircle, Trash2 } from "lucide-react"

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
  languages: [] as string[],
  description: "",
}

// Danh sách chức danh
const doctorTitles = [
  "Bác sĩ",
  "Bác sĩ chuyên khoa I",
  "Bác sĩ chuyên khoa II",
  "Thạc sĩ",
  "Tiến sĩ",
  "Tiến sĩ - Bác sĩ",
  "Phó Giáo sư",
  "Giáo sư",
  "Giáo sư - Tiến sĩ",
]

// Danh sách chuyên khoa
const specialties = [
  "Tim mạch",
  "Tiêu hóa",
  "Nội tiết",
  "Thần kinh",
  "Da liễu",
  "Mắt",
  "Tai mũi họng",
  "Nhi khoa",
  "Sản phụ khoa",
  "Nam khoa",
  "Ung bướu",
  "Xương khớp",
  "Tâm thần",
  "Y học cổ truyền",
  "Phục hồi chức năng",
  "Gây mê hồi sức",
  "Chấn thương chỉnh hình",
  "Phẫu thuật thẩm mỹ",
]

// Danh sách kinh nghiệm
const experienceOptions = [
  "Dưới 1 năm",
  "1-3 năm",
  "3-5 năm",
  "5-10 năm",
  "10-15 năm",
  "15-20 năm",
  "Trên 20 năm",
]

// Danh sách ngôn ngữ
const languages = [
  "Tiếng Việt",
  "Tiếng Anh",
  "Tiếng Pháp",
  "Tiếng Đức",
  "Tiếng Nhật",
  "Tiếng Hàn",
  "Tiếng Trung",
  "Tiếng Tây Ban Nha",
  "Tiếng Ý",
  "Tiếng Nga",
]

export default function AdminDoctorsPage() {
  const router = useRouter()
  const { isLoggedIn, loading } = useAdminAuth()
  const [doctors, setDoctors] = useState<DoctorListItem[]>([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true)
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
        fetchDoctors()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isLoggedIn])

  const fetchDoctors = async () => {
    try {
      setIsLoadingDoctors(true)
      const token = localStorage.getItem("admin_token")
      if (!token) {
        throw new Error("Không tìm thấy token admin")
      }

      const doctorsData = await adminApi.getDoctors(token)
      setDoctors(doctorsData || [])
    } catch (error) {
      console.error("Failed to fetch doctors:", error)
    } finally {
      setIsLoadingDoctors(false)
    }
  }

  const formatDate = (value: string) => {
    if (!value) return "-"
    try {
      return new Date(value).toLocaleDateString("vi-VN")
    } catch {
      return value
    }
  }

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

  const handleDoctorFormChange = (field: keyof typeof doctorForm, value: string | string[]) => {
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
    setDoctorResult(null)
  }

  const handleSubmitDoctorForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDoctorResult(null)

    // Chỉ validate bắt buộc khi tạo mới
    if (formMode === "create") {
      if (!doctorForm.name || !doctorForm.specialty || !doctorForm.price) {
        setDoctorResult({
          type: "error",
          message: "Tên bác sĩ, chuyên khoa và giá khám là bắt buộc.",
        })
        return
      }

      if (createDoctorAccount && (!doctorForm.email || !doctorForm.password)) {
        setDoctorResult({
          type: "error",
          message: "Cần nhập email và mật khẩu nếu muốn tạo tài khoản đăng nhập cho bác sĩ.",
        })
        return
      }
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
        languages: doctorForm.languages && doctorForm.languages.length > 0
          ? doctorForm.languages
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

      await fetchDoctors()
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
      languages: doctor.languages || [],
      description: doctor.description || "",
      email: doctor.account_email || doctor.email || "",
      password: "",
    })
  }

  const handleCancelEdit = () => {
    resetDoctorForm()
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
      await fetchDoctors()
    } catch (error: any) {
      console.error("Delete doctor error:", error)
      setDoctorResult({
        type: "error",
        message: error?.message || "Không thể xóa bác sĩ.",
      })
    }
  }

  if (loading || !isLoggedIn) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Quản lý Bác sĩ</h2>
        <p className="text-slate-400">Thêm, sửa, xóa thông tin bác sĩ</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
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
                  <Label htmlFor="doctor-name">
                    Tên bác sĩ {formMode === "create" && "*"}
                  </Label>
                  <Input
                    id="doctor-name"
                    value={doctorForm.name}
                    onChange={(event) => handleDoctorFormChange("name", event.target.value)}
                    placeholder="VD: BS. Nguyễn Văn A"
                    required={formMode === "create"}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-title">Chức danh</Label>
                  <Select
                    value={doctorForm.title}
                    onValueChange={(value) => handleDoctorFormChange("title", value)}
                  >
                    <SelectTrigger
                      id="doctor-title"
                      className="bg-slate-900 border-slate-700 text-white"
                    >
                      <SelectValue placeholder="Chọn chức danh" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {doctorTitles.map((title) => (
                        <SelectItem key={title} value={title} className="text-white focus:bg-slate-800">
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-specialty">
                    Chuyên khoa {formMode === "create" && "*"}
                  </Label>
                  <Select
                    value={doctorForm.specialty}
                    onValueChange={(value) => handleDoctorFormChange("specialty", value)}
                  >
                    <SelectTrigger
                      id="doctor-specialty"
                      className="bg-slate-900 border-slate-700 text-white"
                    >
                      <SelectValue placeholder="Chọn chuyên khoa" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty} className="text-white focus:bg-slate-800">
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-experience">Kinh nghiệm</Label>
                  <Select
                    value={doctorForm.experience}
                    onValueChange={(value) => handleDoctorFormChange("experience", value)}
                  >
                    <SelectTrigger
                      id="doctor-experience"
                      className="bg-slate-900 border-slate-700 text-white"
                    >
                      <SelectValue placeholder="Chọn kinh nghiệm" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {experienceOptions.map((exp) => (
                        <SelectItem key={exp} value={exp} className="text-white focus:bg-slate-800">
                          {exp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-price">
                    Giá khám {formMode === "create" && "*"}
                  </Label>
                  <Input
                    id="doctor-price"
                    value={doctorForm.price}
                    onChange={(event) => handleDoctorFormChange("price", event.target.value)}
                    placeholder="Ví dụ: 320.000đ"
                    required={formMode === "create"}
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
                      Chưa có ảnh đại diện. Sử dụng nút "Chọn ảnh" để tải lên.
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
                <div className="rounded-md border border-slate-700 bg-slate-900/50 p-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {languages.map((lang) => {
                      const isSelected = doctorForm.languages.includes(lang)
                      return (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${lang}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleDoctorFormChange("languages", [...doctorForm.languages, lang])
                              } else {
                                handleDoctorFormChange(
                                  "languages",
                                  doctorForm.languages.filter((l) => l !== lang)
                                )
                              }
                            }}
                            className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <Label
                            htmlFor={`lang-${lang}`}
                            className="text-sm text-slate-300 cursor-pointer"
                          >
                            {lang}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                  {doctorForm.languages.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-400">
                        Đã chọn: {doctorForm.languages.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
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

        {/* Doctors List */}
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Danh sách bác sĩ ({doctors.length})</CardTitle>
            <CardDescription className="text-slate-400">
              Chọn "Sửa" để tải thông tin vào biểu mẫu bên trái.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDoctors ? (
              <div className="py-10 text-center text-sm text-slate-400">Đang tải danh sách bác sĩ...</div>
            ) : doctors.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">Chưa có bác sĩ nào.</div>
            ) : (
              <div className="overflow-x-auto">
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

