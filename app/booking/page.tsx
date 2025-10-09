import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingWizard from "@/components/booking-wizard"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Đặt lịch khám bệnh</h1>
            <p className="text-muted-foreground">Hoàn thành các bước sau để đặt lịch khám với bác sĩ</p>
          </div>

          <BookingWizard />
        </div>
      </main>

      <Footer />
    </div>
  )
}
