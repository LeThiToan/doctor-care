"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface Doctor {
  id: number
  name: string
  title: string
  specialty: string
  experience: string
  rating: number
  reviews: number
  price: string
  avatar: string
  education: string
  description: string
  languages: string[]
}

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const doctorsPerPage = 6
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.getDoctors()
        setDoctors(data)
        setFilteredDoctors(data)
        
        // Extract unique specialties
        const uniqueSpecialties = [...new Set(data.map(doctor => doctor.specialty))]
        setSpecialties(uniqueSpecialties)
      } catch (error) {
        console.error("Lỗi khi tải danh sách bác sĩ:", error)
      }
    }
    fetchDoctors()
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = [...doctors]

    // Search by name or specialty
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by specialty
    if (selectedSpecialty && selectedSpecialty !== "all") {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "price":
          return parseFloat(a.price.replace(/[^\d]/g, '')) - parseFloat(b.price.replace(/[^\d]/g, ''))
        default:
          return 0
      }
    })

    setFilteredDoctors(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [doctors, searchTerm, selectedSpecialty, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSpecialty("all")
    setSortBy("name")
  }

  // Tính toán phân trang
  const indexOfLastDoctor = currentPage * doctorsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage)

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bác sĩ theo tên, chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Specialty Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Chuyên khoa</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả chuyên khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả chuyên khoa</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sắp xếp theo</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                    <SelectItem value="price">Giá thấp nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Filters */}
        <div className="hidden lg:flex mt-4 pt-4 border-t">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Chuyên khoa:</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả chuyên khoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chuyên khoa</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sắp xếp:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="price">Giá thấp nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-muted-foreground">
          Hiển thị {currentDoctors.length} trong tổng số {filteredDoctors.length} bác sĩ
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-green-50 p-6 rounded-2xl shadow hover:shadow-lg transition text-center"
          >
            {/* Avatar */}
            <img
              src={`/images/doctors/${doctor.avatar || "default.png"}`}
              alt={doctor.name}
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              onError={(e) => {
                e.currentTarget.src = "/images/doctors/default.png"
              }}
            />

            {/* Info */}
            <h2 className="text-xl font-bold text-foreground">{doctor.name}</h2>
            <p className="text-muted-foreground">{doctor.title}</p>
            <p className="mt-2 px-2 py-1 bg-green-100 inline-block rounded-full text-green-800 text-sm">
              {doctor.specialty}
            </p>

            <div className="mt-4 space-y-1 text-sm text-left">
              <p>⭐ {doctor.rating} ({doctor.reviews} đánh giá)</p>
              <p>💼 {doctor.experience}</p>
              <p>🎓 {doctor.education}</p>
              <p className="text-green-600 font-semibold">{doctor.price}</p>
              <p className="mt-2">{doctor.description}</p>
            </div>

            {/* Ngôn ngữ */}
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {doctor.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-200 rounded text-sm"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-3 justify-center">
              <Link
                href={`/doctor/${doctor.id}`}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Xem chi tiết
              </Link>
              <Link
                href={`/booking?doctor=${doctor.id}`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Đặt lịch
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy bác sĩ nào</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn</p>
          </div>
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && filteredDoctors.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Trước
          </button>

          <span className="text-sm text-muted-foreground">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  )
}
