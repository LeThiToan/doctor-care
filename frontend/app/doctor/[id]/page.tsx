"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Briefcase, 
  GraduationCap, 
  DollarSign,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Clock,
  Globe,
  CheckCircle2
} from "lucide-react"
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
  education: string | string[]
  languages: string | string[]
  description: string
}

export default function DoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getDoctorById(params.id as string)
        setDoctor(data)
      } catch (err: any) {
        console.error("Lỗi khi tải thông tin bác sĩ:", err)
        setError(err.message || "Không tìm thấy bác sĩ")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDoctor()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center items-center h-64">
              <div className="text-muted-foreground">Đang tải thông tin bác sĩ...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card>
              <CardContent className="p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy bác sĩ</h2>
                <p className="text-muted-foreground mb-6">{error || "Bác sĩ không tồn tại"}</p>
                <Link href="/doctors">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại danh sách bác sĩ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const educationArray = Array.isArray(doctor.education) ? doctor.education : [doctor.education].filter(Boolean)
  const languagesArray = Array.isArray(doctor.languages) ? doctor.languages : (typeof doctor.languages === 'string' ? doctor.languages.split(',').map(l => l.trim()) : [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Link href="/doctors">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Doctor Info */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  {/* Avatar */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <img
                        src={`/images/doctors/${doctor.avatar || "default.png"}`}
                        alt={doctor.name}
                        className="w-48 h-48 object-cover rounded-full border-4 border-primary/20"
                        onError={(e) => {
                          e.currentTarget.src = "/images/doctors/default.png"
                        }}
                      />
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
                    <p className="text-muted-foreground mb-3">{doctor.title}</p>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {doctor.specialty}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2 mb-4 pb-4 border-b">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold">{doctor.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({doctor.reviews} đánh giá)
                    </span>
                  </div>

                  {/* Info Items */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Kinh nghiệm</p>
                        <p className="text-sm text-muted-foreground">{doctor.experience}</p>
                      </div>
                    </div>

                    {educationArray.length > 0 && (
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Học vấn</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {educationArray.map((edu, idx) => (
                              <p key={idx}>{edu}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {languagesArray.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Ngôn ngữ</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {languagesArray.map((lang, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-center justify-center gap-2 text-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phí khám</p>
                        <p className="text-3xl font-bold text-primary">{doctor.price}</p>
                        <p className="text-xs text-muted-foreground">/ lần khám</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href={`/booking?doctor=${doctor.id}`} className="block">
                      <Button className="w-full" size="lg">
                        <Calendar className="h-5 w-5 mr-2" />
                        Đặt lịch ngay
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Giới thiệu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {doctor.description || "Chưa có thông tin mô tả."}
                  </p>
                </CardContent>
              </Card>

              {/* Services/Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle>Chuyên môn & Kinh nghiệm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Chuyên khoa</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Thời gian làm việc</p>
                        <p className="text-sm text-muted-foreground">Theo lịch hẹn</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Đánh giá</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.rating.toFixed(1)} / 5.0 ({doctor.reviews} đánh giá)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Kinh nghiệm</p>
                        <p className="text-sm text-muted-foreground">{doctor.experience}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              {educationArray.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Học vấn & Bằng cấp</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {educationArray.map((edu, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Sẵn sàng đặt lịch khám?</h3>
                      <p className="text-muted-foreground">
                        Chọn thời gian phù hợp và đặt lịch ngay với {doctor.name}
                      </p>
                    </div>
                    <Link href={`/booking?doctor=${doctor.id}`}>
                      <Button size="lg" className="w-full md:w-auto">
                        <Calendar className="h-5 w-5 mr-2" />
                        Đặt lịch khám
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

