import Header from "@/components/header"
import Footer from "@/components/footer"
import AppointmentsList from "@/components/appointments-list"

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý lịch hẹn</h1>
            <p className="text-muted-foreground">Theo dõi và quản lý các cuộc hẹn khám bệnh của bạn</p>
          </div>

          <AppointmentsList />
        </div>
      </main>

      <Footer />
    </div>
  )
}
