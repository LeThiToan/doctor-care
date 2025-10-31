"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import { Calendar, Clock, Users, ArrowRight, Sparkles } from "lucide-react"

const banners = [
    {
        title: "Đặt lịch khám dễ dàng",
        desc: "Chủ động chọn bác sĩ và thời gian phù hợp với lịch trình của bạn",
        button: "Đặt lịch ngay",
        path: "/booking",
        variant: "default" as const,
        gradient: "from-blue-600 via-blue-700 to-blue-800",
        icon: <Calendar className="h-16 w-16 md:h-20 md:w-20" />,
    },
    {
        title: "Theo dõi lịch hẹn của bạn",
        desc: "Quản lý và cập nhật các lịch hẹn một cách nhanh chóng và tiện lợi",
        button: "Xem lịch hẹn",
        path: "/appointments",
        variant: "secondary" as const,
        gradient: "from-green-600 via-green-700 to-green-800",
        icon: <Clock className="h-16 w-16 md:h-20 md:w-20" />,
    },
    {
        title: "Đội ngũ bác sĩ chuyên nghiệp",
        desc: "Kết nối với bác sĩ giỏi từ các bệnh viện hàng đầu Việt Nam",
        button: "Xem bác sĩ",
        path: "/doctors",
        variant: "outline" as const,
        gradient: "from-purple-600 via-purple-700 to-purple-800",
        icon: <Users className="h-16 w-16 md:h-20 md:w-20" />,
    },
]

export default function HeroBanner() {
    const router = useRouter()

    const handleNavigate = (path: string) => {
        const token = localStorage.getItem("token")
        if (token) {
            router.push(path)
        } else {
            // Nếu chưa đăng nhập và muốn đặt lịch, chuyển đến login với redirect
            if (path === "/booking") {
                router.push("/login?redirect=/booking")
            } else {
                router.push("/login")
            }
        }
    }

    return (
        <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ 
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-8'
                }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                className="w-full h-full"
            >
                {banners.map((banner, i) => (
                    <SwiperSlide key={i}>
                        <div className={`relative w-full h-full bg-gradient-to-br ${banner.gradient}`}>
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                                      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                                      radial-gradient(circle at 40% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`
                                }}></div>
                            </div>

                            {/* Floating decorative elements */}
                            <div className="absolute top-20 left-10 opacity-30 animate-pulse">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute bottom-20 right-10 opacity-30 animate-pulse delay-300">
                                <Sparkles className="h-12 w-12 text-white" />
                            </div>
                            <div className="absolute top-1/2 right-1/4 opacity-20 animate-pulse delay-500">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                                {/* Icon */}
                                <div className="mb-8 animate-bounce-slow">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                                        <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-full border border-white/20">
                                            {banner.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in-up">
                                    {banner.title}
                                </h1>

                                {/* Description */}
                                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl drop-shadow-lg animate-fade-in-up delay-200">
                                    {banner.desc}
                                </p>

                                {/* Button */}
                                <div className="animate-fade-in-up delay-300">
                                    <Button
                                        size="lg"
                                        variant={banner.variant}
                                        onClick={() => handleNavigate(banner.path)}
                                        className="group shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                                    >
                                        {banner.button}
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>

                            {/* Bottom wave decoration */}
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom styles for animations */}
            <style jsx global>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                .delay-200 {
                    animation-delay: 0.2s;
                    opacity: 0;
                }
                .delay-300 {
                    animation-delay: 0.4s;
                    opacity: 0;
                }
                .delay-500 {
                    animation-delay: 0.5s;
                }
            `}</style>
        </div>
    )
}
