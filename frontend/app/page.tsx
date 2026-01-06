import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroBanner from "@/components/HeroBanner"
import FeaturedDoctors from "@/components/featured-doctors"
import {
  Calendar,
  Users,
  Clock,
  Shield,
  Stethoscope,
  Heart,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <HeroBanner />

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: "10,000+", label: "Bệnh nhân đã tin tưởng", icon: <Users className="h-8 w-8" /> },
              { number: "500+", label: "Bác sĩ chuyên khoa", icon: <Stethoscope className="h-8 w-8" /> },
              { number: "50+", label: "Chuyên khoa", icon: <Heart className="h-8 w-8" /> },
              { number: "4.9/5", label: "Đánh giá trung bình", icon: <Star className="h-8 w-8" /> },
            ].map((stat, idx) => (
              <Card key={idx} className="border-none shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Tính năng nổi bật
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Tại sao chọn <span className="text-primary">MedBooking</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Trải nghiệm đặt lịch hiện đại, tiện lợi và an toàn với công nghệ tiên tiến
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calendar className="h-12 w-12" />,
                title: "Đặt lịch 24/7",
                desc: "Đặt lịch khám bất cứ lúc nào, bất cứ đâu với hệ thống tự động và thông minh",
                gradient: "from-blue-500 via-blue-600 to-blue-700",
                delay: "0"
              },
              {
                icon: <Users className="h-12 w-12" />,
                title: "Bác sĩ chuyên khoa",
                desc: "Đội ngũ bác sĩ uy tín, giàu kinh nghiệm từ các bệnh viện hàng đầu",
                gradient: "from-green-500 via-green-600 to-green-700",
                delay: "100"
              },
              {
                icon: <Clock className="h-12 w-12" />,
                title: "Tiết kiệm thời gian",
                desc: "Không cần xếp hàng, chủ động chọn giờ phù hợp với lịch trình cá nhân",
                gradient: "from-purple-500 via-purple-600 to-purple-700",
                delay: "200"
              },
              {
                icon: <Shield className="h-12 w-12" />,
                title: "Bảo mật tuyệt đối",
                desc: "Thông tin cá nhân được mã hóa và bảo vệ chặt chẽ theo tiêu chuẩn quốc tế",
                gradient: "from-orange-500 via-orange-600 to-orange-700",
                delay: "300"
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="group relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/30 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Icon container */}
                <div className={`relative bg-gradient-to-br ${item.gradient} w-20 h-20 flex items-center justify-center rounded-2xl mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  {item.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed relative z-10">
                  {item.desc}
                </p>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Quy trình đơn giản
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Cách hoạt động
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Chỉ 3 bước đơn giản để đặt lịch khám bệnh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Chọn chuyên khoa & Bác sĩ",
                desc: "Tìm kiếm và lựa chọn bác sĩ phù hợp với nhu cầu của bạn",
                icon: <Stethoscope className="h-6 w-6" />
              },
              {
                step: "02",
                title: "Chọn thời gian khám",
                desc: "Xem lịch trống và chọn thời gian thuận tiện nhất",
                icon: <Calendar className="h-6 w-6" />
              },
              {
                step: "03",
                title: "Xác nhận đặt lịch",
                desc: "Điền thông tin và xác nhận đặt lịch thành công",
                icon: <CheckCircle2 className="h-6 w-6" />
              },
            ].map((item, idx) => (
              <div key={idx} className="relative h-full">
                <Card className="border-none shadow-lg bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardContent className="p-8 text-center flex flex-col h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 font-bold text-2xl mx-auto">
                      {item.step}
                    </div>
                    <div className="flex justify-center mb-4 text-primary">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">{item.desc}</p>
                  </CardContent>
                </Card>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10 translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <FeaturedDoctors />

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                Lợi ích của bạn
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Chăm sóc sức khỏe <span className="text-primary">thông minh hơn</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                MedBooking mang đến cho bạn trải nghiệm đặt lịch khám bệnh tiện lợi, nhanh chóng và chuyên nghiệp.
              </p>

              <div className="space-y-4">
                {[
                  "Đặt lịch online 24/7, không cần đến tận nơi",
                  "Nhận thông báo nhắc nhở trước ngày khám",
                  "Lưu trữ lịch sử khám bệnh an toàn",
                  "Đánh giá và phản hồi về chất lượng dịch vụ",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/booking">
                  <Button size="lg" className="group">
                    Đặt lịch ngay
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <TrendingUp className="h-8 w-8" />, title: "Tăng trưởng", desc: "10,000+ người dùng" },
                { icon: <Award className="h-8 w-8" />, title: "Chất lượng", desc: "500+ bác sĩ" },
                { icon: <Star className="h-8 w-8" />, title: "Đánh giá", desc: "4.9/5 sao" },
                { icon: <Heart className="h-8 w-8" />, title: "Chuyên khoa", desc: "50+ lĩnh vực" },
              ].map((item, idx) => (
                <Card key={idx} className="border-none shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4 text-primary">
                      {item.icon}
                    </div>
                    <div className="font-bold text-lg mb-1">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary via-primary/90 to-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng chăm sóc sức khỏe của bạn?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Đặt lịch ngay hôm nay và trải nghiệm dịch vụ y tế chuyên nghiệp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="group">
                Đặt lịch khám ngay
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/doctors">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Xem danh sách bác sĩ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
