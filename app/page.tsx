import Header from "@/components/header"
import Footer from "@/components/footer"
import { Calendar, Users, Clock, Shield } from "lucide-react"
import HeroBanner from "@/components/HeroBanner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Banner slideshow */}
      <HeroBanner />

      {/* Features Section giữ nguyên như cũ */}
      <section className="py-20 px-6 bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Tại sao chọn <span className="text-primary">MedBooking</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trải nghiệm đặt lịch hiện đại, tiện lợi và an toàn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Calendar className="h-8 w-8" />, title: "Đặt lịch 24/7", desc: "Đặt lịch khám bất cứ lúc nào, bất cứ đâu" },
              { icon: <Users className="h-8 w-8" />, title: "Bác sĩ chuyên khoa", desc: "Đội ngũ uy tín từ các bệnh viện hàng đầu" },
              { icon: <Clock className="h-8 w-8" />, title: "Tiết kiệm thời gian", desc: "Không cần xếp hàng, chủ động chọn giờ" },
              { icon: <Shield className="h-8 w-8" />, title: "Bảo mật tuyệt đối", desc: "Thông tin cá nhân được bảo vệ chặt chẽ" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition group text-center"
              >
                <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
