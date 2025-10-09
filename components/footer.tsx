import Link from "next/link"
import { Stethoscope, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">MedBooking</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Hệ thống đặt lịch khám bệnh trực tuyến hiện đại, giúp bạn dễ dàng kết nối với các bác sĩ chuyên khoa hàng
              đầu.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>cudecpro@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>27 Trần Hưng Đạo, Điện Bàn, Đà Nẵng</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Liên kết nhanh</h3>
            <div className="flex flex-col gap-2">
              <Link href="/doctors" className="text-muted-foreground hover:text-primary transition-colors">
                Danh sách bác sĩ
              </Link>
              <Link href="/booking" className="text-muted-foreground hover:text-primary transition-colors">
                Đặt lịch khám
              </Link>
              <Link href="/appointments" className="text-muted-foreground hover:text-primary transition-colors">
                Quản lý lịch hẹn
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Pháp lý</h3>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                Trợ giúp
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 MedBooking. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
