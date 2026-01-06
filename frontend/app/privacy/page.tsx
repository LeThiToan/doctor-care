import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, FileText, Users, AlertCircle } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Chính sách bảo mật</h1>
            <p className="text-muted-foreground text-lg">
              Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN", { 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  1. Thông tin chúng tôi thu thập
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
                  <p className="text-muted-foreground">
                    Khi bạn đăng ký tài khoản hoặc đặt lịch khám, chúng tôi có thể thu thập thông tin như:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>Họ và tên</li>
                    <li>Email và số điện thoại</li>
                    <li>Ngày sinh và giới tính</li>
                    <li>Địa chỉ liên hệ</li>
                    <li>Thông tin bảo hiểm y tế (nếu có)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Thông tin y tế</h3>
                  <p className="text-muted-foreground">
                    Chúng tôi có thể thu thập thông tin về triệu chứng, tiền sử bệnh lý và các thông tin y tế khác 
                    mà bạn cung cấp khi đặt lịch khám.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  2. Cách chúng tôi sử dụng thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Thông tin của bạn được sử dụng để:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Xử lý và quản lý lịch hẹn khám bệnh của bạn</li>
                  <li>Liên hệ với bạn về lịch hẹn và các thông báo quan trọng</li>
                  <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng</li>
                  <li>Gửi thông tin về các dịch vụ y tế phù hợp (nếu bạn đồng ý)</li>
                  <li>Tuân thủ các yêu cầu pháp lý và quy định</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  3. Bảo mật thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Mã hóa dữ liệu khi truyền tải qua internet</li>
                  <li>Lưu trữ thông tin trên hệ thống máy chủ an toàn</li>
                  <li>Giới hạn quyền truy cập thông tin chỉ cho nhân viên có thẩm quyền</li>
                  <li>Thường xuyên kiểm tra và cập nhật các biện pháp bảo mật</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  4. Chia sẻ thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, 
                  trừ các trường hợp:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Với bác sĩ và cơ sở y tế để thực hiện dịch vụ khám chữa bệnh</li>
                  <li>Khi có yêu cầu từ cơ quan pháp luật có thẩm quyền</li>
                  <li>Để bảo vệ quyền lợi và an toàn của người dùng khác</li>
                  <li>Với sự đồng ý rõ ràng của bạn</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  5. Quyền của bạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Bạn có quyền:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Truy cập và xem thông tin cá nhân của mình</li>
                  <li>Yêu cầu chỉnh sửa hoặc cập nhật thông tin</li>
                  <li>Yêu cầu xóa tài khoản và dữ liệu cá nhân</li>
                  <li>Từ chối nhận email marketing hoặc thông báo quảng cáo</li>
                  <li>Khiếu nại về việc xử lý thông tin cá nhân</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  6. Liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Nếu bạn có câu hỏi hoặc yêu cầu về chính sách bảo mật, vui lòng liên hệ với chúng tôi:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> cudecpro@gmail.com</p>
                  <p><strong>Hotline:</strong> +84 385 597 210</p>
                  <p><strong>Địa chỉ:</strong> 78 Đường Hữu Nghị, Đồng Hới</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}









