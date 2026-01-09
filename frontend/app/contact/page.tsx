import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Liên hệ với chúng tôi</h1>
            <p className="text-muted-foreground">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Hotline</p>
                    <p className="text-muted-foreground">+84 385 597 210 (24/7)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">contact@medbooking.comcom</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Địa chỉ</p>
                    <p className="text-muted-foreground">78 Đường Hữu Nghị Đồng Hới</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Giờ làm việc</p>
                    <p className="text-muted-foreground">Thứ 2 - Chủ nhật: 7:00 - 22:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Làm thế nào để đặt lịch khám?</h4>
                  <p className="text-sm text-muted-foreground">
                    Bạn có thể đặt lịch trực tuyến qua website hoặc gọi hotline +84 385 597 210.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Có thể hủy lịch hẹn không?</h4>
                  <p className="text-sm text-muted-foreground">
                    Có, bạn có thể hủy lịch hẹn trước 24 giờ mà không mất phí.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Phương thức thanh toán nào được chấp nhận?</h4>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi chấp nhận thanh toán tiền mặt, thẻ ATM, và ví điện tử.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Có hỗ trợ khám tại nhà không?</h4>
                  <p className="text-sm text-muted-foreground">
                    Có, chúng tôi có dịch vụ khám tại nhà cho một số chuyên khoa.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Vị trí của chúng tôi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border shadow-sm">
                <iframe
                  src="https://maps.google.com/maps?q=78%20%C4%90%C6%B0%E1%BB%9Dng%20H%E1%BB%AFu%20Ngh%E1%BB%8B%2C%20%C4%90%E1%BB%93ng%20H%E1%BB%9Bi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="Vị trí MedBooking - 78 Đường Hữu Nghị Đồng Hới"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>78 Đường Hữu Nghị,Đồng Hới</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=78+Đường+Hữu+Nghị+Đồng+Hới"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-primary hover:underline"
                >
                  Xem trên Google Maps →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
