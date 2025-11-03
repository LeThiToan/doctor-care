"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Calendar, ArrowRight } from "lucide-react"
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
  description?: string
}

export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedDoctors = async () => {
      try {
        setLoading(true)
        const data = await api.getDoctors()
        
        // Sắp xếp theo rating (cao nhất trước) và lấy top 5
        const sortedDoctors = [...data]
          .sort((a, b) => {
            // Ưu tiên rating cao hơn, nếu rating bằng nhau thì ưu tiên reviews nhiều hơn
            if (b.rating !== a.rating) {
              return b.rating - a.rating
            }
            return (b.reviews || 0) - (a.reviews || 0)
          })
          .slice(0, 5)
        
        setDoctors(sortedDoctors)
      } catch (error) {
        console.error("Lỗi khi tải danh sách bác sĩ nổi bật:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedDoctors()
  }, [])

  if (loading) {
    return (
      <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Đội ngũ bác sĩ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Bác sĩ <span className="text-primary">nổi bật</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (doctors.length === 0) {
    return null
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Đội ngũ bác sĩ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Bác sĩ <span className="text-primary">nổi bật</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Đội ngũ bác sĩ xuất sắc với nhiều năm kinh nghiệm và đánh giá cao từ bệnh nhân
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Top badge for highest rating */}
              {doctor.rating >= 4.8 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none shadow-lg">
                    <Award className="h-3 w-3 mr-1" />
                    Top Rated
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                {/* Avatar */}
                <div className="relative mb-6 flex justify-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                    {doctor.avatar ? (
                      <img
                        src={`/images/doctors/${doctor.avatar}`}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to default if image fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex'
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-2xl ${doctor.avatar ? 'hidden' : ''}`}
                    >
                      {doctor.name.charAt(0)}
                    </div>
                  </div>
                  {/* Decorative circle */}
                  <div className="absolute inset-0 border-4 border-primary/10 rounded-full animate-pulse"></div>
                </div>

                {/* Name & Title */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{doctor.title}</p>
                  <Badge variant="secondary" className="text-xs">
                    {doctor.specialty}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{doctor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({doctor.reviews || 0} đánh giá)
                  </span>
                </div>

                {/* Experience */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>{doctor.experience}</span>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-primary">{doctor.price}</span>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <Link href={`/booking?doctor=${doctor.id}`}>
                    <Button 
                      className="w-full group"
                      size="sm"
                    >
                      Đặt lịch ngay
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href={`/doctor/${doctor.id}`}>
                    <Button 
                      variant="outline"
                      className="w-full group"
                      size="sm"
                    >
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </CardContent>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/doctors">
            <Button variant="outline" size="lg" className="group">
              Xem tất cả bác sĩ
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

