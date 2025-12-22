import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, Gavel } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Scale className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Điều khoản sử dụng</h1>
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
                  <FileText className="h-5 w-5 text-primary" />
                  1. Chấp nhận điều khoản
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bằng việc truy cập và sử dụng dịch vụ MedBooking, bạn đồng ý tuân thủ và bị ràng buộc bởi 
                  các điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  2. Quyền và trách nhiệm của người dùng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Quyền của người dùng</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Sử dụng dịch vụ để đặt lịch khám bệnh</li>
                    <li>Truy cập thông tin về bác sĩ và dịch vụ y tế</li>
                    <li>Quản lý lịch hẹn của mình</li>
                    <li>Đánh giá và phản hồi về dịch vụ</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Trách nhiệm của người dùng</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Cung cấp thông tin chính xác và đầy đủ</li>
                    <li>Bảo mật thông tin tài khoản của mình</li>
                    <li>Tuân thủ các quy định về hủy và thay đổi lịch hẹn</li>
                    <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-primary" />
                  3. Hành vi bị cấm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Người dùng không được phép:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Sử dụng dịch vụ để đặt lịch giả hoặc lừa đảo</li>
                  <li>Chia sẻ tài khoản với người khác</li>
                  <li>Cố gắng truy cập trái phép vào hệ thống</li>
                  <li>Phát tán virus, malware hoặc mã độc</li>
                  <li>Xâm phạm quyền riêng tư của người dùng khác</li>
                  <li>Sử dụng bot hoặc công cụ tự động để đặt lịch</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  4. Hủy và thay đổi lịch hẹn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Hủy lịch hẹn</h3>
                  <p className="text-muted-foreground">
                    Bạn có thể hủy lịch hẹn trước 24 giờ mà không mất phí. Nếu hủy trong vòng 24 giờ, 
                    có thể áp dụng phí hủy theo quy định của cơ sở y tế.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Thay đổi lịch hẹn</h3>
                  <p className="text-muted-foreground">
                    Bạn có thể thay đổi lịch hẹn thông qua tài khoản của mình hoặc liên hệ hotline. 
                    Việc thay đổi phụ thuộc vào lịch trống của bác sĩ.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary" />
                  5. Giới hạn trách nhiệm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  MedBooking là nền tảng kết nối giữa bệnh nhân và bác sĩ. Chúng tôi:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Không chịu trách nhiệm về chất lượng dịch vụ y tế của bác sĩ</li>
                  <li>Không đảm bảo tính chính xác tuyệt đối của thông tin bác sĩ</li>
                  <li>Không chịu trách nhiệm về các quyết định y tế của bác sĩ</li>
                  <li>Không bồi thường cho các thiệt hại gián tiếp hoặc hậu quả phát sinh</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Người dùng chịu trách nhiệm về quyết định sử dụng dịch vụ y tế của mình.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  6. Sở hữu trí tuệ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tất cả nội dung trên website MedBooking, bao gồm logo, thiết kế, văn bản, hình ảnh, 
                  đều thuộc quyền sở hữu của MedBooking và được bảo vệ bởi luật bản quyền. 
                  Bạn không được phép sao chép, phân phối hoặc sử dụng nội dung này mà không có sự cho phép.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  7. Thay đổi điều khoản
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chúng tôi có quyền thay đổi các điều khoản sử dụng này bất cứ lúc nào. 
                  Các thay đổi sẽ có hiệu lực ngay sau khi được đăng tải trên website. 
                  Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn đã chấp nhận các điều khoản mới.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  8. Liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ:
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






