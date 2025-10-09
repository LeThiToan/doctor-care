import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactForm from "@/components/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"

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
            <div className="space-y-6">
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
                      <p className="text-muted-foreground">cudecpro@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Địa chỉ</p>
                      <p className="text-muted-foreground">27 Trần Hưng Đạo, Điện Bàn, Đà Nẵng</p>
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

              <Card>
                <CardHeader>
                  <CardTitle>Câu hỏi thường gặp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Làm thế nào để đặt lịch khám?</h4>
                    <p className="text-sm text-muted-foreground">
                      Bạn có thể đặt lịch trực tuyến qua website hoặc gọi hotline 1900 1234.
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

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Gửi tin nhắn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Vị trí của chúng tôi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Bản đồ Google Maps sẽ được hiển thị ở đây</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
