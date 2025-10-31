import Header from "@/components/header"
import Footer from "@/components/footer"
import DoctorsList from "@/components/doctors-list"

export default function DoctorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Đội ngũ bác sĩ</h1>
            <p className="text-muted-foreground">Gặp gỡ các bác sĩ chuyên khoa giàu kinh nghiệm của chúng tôi</p>
          </div>

          <DoctorsList />
        </div>
      </main>

      <Footer />
    </div>
  )
}
