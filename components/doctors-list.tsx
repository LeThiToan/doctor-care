"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

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
  const [currentPage, setCurrentPage] = useState(1)
  const doctorsPerPage = 6

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors")
        const data = await res.json()
        setDoctors(data)
      } catch (error) {
        console.error("Lỗi khi tải danh sách bác sĩ:", error)
      }
    }
    fetchDoctors()
  }, [])

  // Tính toán phân trang
  const indexOfLastDoctor = currentPage * doctorsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
  const totalPages = Math.ceil(doctors.length / doctorsPerPage)

  return (
    <div>
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
                href={`/booking?id=${doctor.id}`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Đặt lịch
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-grays-200 rounded disabled:opacity-50"
          >
            Trước
          </button>

          <span>
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  )
}
