import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  BookOpen, 
  Search,
  Calendar,
  User,
  CreditCard,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HelpPage() {
  const faqs = [
    {
      question: "Làm thế nào để đặt lịch khám?",
      answer: "Bạn có thể đặt lịch khám bằng cách: 1) Chọn chuyên khoa và bác sĩ, 2) Chọn ngày và giờ phù hợp, 3) Điền thông tin bệnh nhân và triệu chứng, 4) Xác nhận đặt lịch. Bạn cần đăng nhập để đặt lịch."
    },
    {
      question: "Có thể hủy lịch hẹn không?",
      answer: "Có, bạn có thể hủy lịch hẹn trước 24 giờ mà không mất phí. Vào trang 'Lịch hẹn' và nhấn nút 'Hủy lịch' cho lịch hẹn bạn muốn hủy."
    },
    {
      question: "Làm sao để thay đổi lịch hẹn?",
      answer: "Bạn có thể hủy lịch hẹn cũ và đặt lịch mới, hoặc liên hệ hotline +84 385 597 210 để được hỗ trợ thay đổi lịch hẹn."
    },
    {
      question: "Phương thức thanh toán nào được chấp nhận?",
      answer: "Hiện tại chúng tôi chấp nhận thanh toán tiền mặt tại cơ sở y tế. Một số cơ sở có thể chấp nhận thẻ ATM hoặc ví điện tử."
    },
    {
      question: "Có thể đặt lịch cho người khác không?",
      answer: "Có, khi đặt lịch bạn có thể điền thông tin của người cần khám (không nhất thiết phải là chủ tài khoản)."
    },
    {
      question: "Làm sao để liên hệ với bác sĩ?",
      answer: "Bạn có thể sử dụng tính năng 'Chat với bác sĩ' trên website sau khi đã có lịch hẹn với bác sĩ đó, hoặc liên hệ trực tiếp qua cơ sở y tế."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <HelpCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Trung tâm trợ giúp</h1>
            <p className="text-muted-foreground text-lg">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Gọi hotline</h3>
                <p className="text-sm text-muted-foreground mb-3">+84 385 597 210</p>
                <Button size="sm" variant="outline" asChild>
                  <a href="tel:+84385597210">Gọi ngay</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Gửi email</h3>
                <p className="text-sm text-muted-foreground mb-3">cudecpro@gmail.com</p>
                <Button size="sm" variant="outline" asChild>
                  <a href="mailto:cudecpro@gmail.com">Gửi email</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Chat với AI</h3>
                <p className="text-sm text-muted-foreground mb-3">Trợ lý 24/7</p>
                <Button size="sm" variant="outline">Mở chat</Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-2">
                      <Search className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Guides Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Hướng dẫn sử dụng</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Đặt lịch khám
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Đăng nhập hoặc đăng ký tài khoản</li>
                    <li>Chọn chuyên khoa và bác sĩ</li>
                    <li>Chọn ngày và giờ khám phù hợp</li>
                    <li>Điền thông tin và xác nhận</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Quản lý tài khoản
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Cập nhật thông tin cá nhân</li>
                    <li>Xem lịch sử đặt lịch</li>
                    <li>Đánh giá bác sĩ sau khi khám</li>
                    <li>Thay đổi mật khẩu</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Thanh toán được thực hiện trực tiếp tại cơ sở y tế khi đến khám. 
                    Bạn sẽ nhận được thông báo về phí khám qua email sau khi đặt lịch thành công.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Hỗ trợ khẩn cấp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Nếu bạn gặp vấn đề khẩn cấp về sức khỏe, vui lòng:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Gọi 115 (cấp cứu y tế)</li>
                    <li>Đến bệnh viện gần nhất</li>
                    <li>Không sử dụng dịch vụ đặt lịch cho trường hợp khẩn cấp</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Section */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Vẫn cần hỗ trợ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Nếu bạn không tìm thấy câu trả lời, vui lòng liên hệ với chúng tôi:
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/contact">Liên hệ hỗ trợ</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:+84385597210">Gọi hotline</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:cudecpro@gmail.com">Gửi email</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}




