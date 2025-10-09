"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

const banners = [
    {
        image: "/banner1.jpg",
        title: "Đặt lịch khám dễ dàng",
        desc: "Chủ động chọn bác sĩ và thời gian phù hợp",
        button: "Đặt lịch ngay",
        path: "/booking",
        variant: "default",
    },
    {
        image: "/banner2.jpg",
        title: "Theo dõi lịch hẹn của bạn",
        desc: "Quản lý và cập nhật các lịch hẹn nhanh chóng",
        button: "Xem lịch hẹn",
        path: "/appointments",
        variant: "secondary",
    },
    {
        image: "/banner3.jpg",
        title: "Đội ngũ bác sĩ chuyên nghiệp",
        desc: "Kết nối với bác sĩ giỏi từ các bệnh viện hàng đầu",
        button: "Xem bác sĩ",
        path: "/doctors",
        variant: "outline",
    },
]

export default function HeroBanner() {
    const router = useRouter()

    const handleNavigate = (path: string) => {
        const token = localStorage.getItem("token")
        if (token) {
            router.push(path)
        } else {
            router.push("/login")
        }
    }

    return (
        <div className="relative w-full h-[500px]">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                className="w-full h-full"
            >
                {banners.map((banner, i) => (
                    <SwiperSlide key={i}>
                        <div
                            className="relative w-full h-[500px] bg-cover bg-center"
                            style={{ backgroundImage: `url(${banner.image})` }}
                        >
                            {/* Overlay nội dung */}
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                    {banner.title}
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow">
                                    {banner.desc}
                                </p>
                                <Button
                                    size="lg"
                                    variant={banner.variant as any}
                                    onClick={() => handleNavigate(banner.path)}
                                >
                                    {banner.button}
                                </Button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
