import { useEffect, useState } from "react";
import Reveal from "./Reveal";

interface CarouselItem {
    id: number;
    image_path: string;
    link_url: string | null;
    link_target: "_self" | "_blank";
}

// Global cache
let carouselCache: CarouselItem[] | null = null;
let isFetchingCarousels = false;

export default function Hero({ initialData = [] }: { initialData?: CarouselItem[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [carousels, setCarousels] = useState<CarouselItem[]>(carouselCache || initialData);
    const [loading, setLoading] = useState(!carouselCache && initialData.length === 0);

    const nextSlide = () => {
        if (carousels.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % carousels.length);
    };

    const prevSlide = () => {
        if (carousels.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + carousels.length) % carousels.length);
    };

    useEffect(() => {
        if (carouselCache && carouselCache.length > 0) {
            setCarousels(carouselCache);
            setLoading(false);
            return;
        }

        if (initialData && initialData.length > 0) {
            setCarousels(initialData);
            carouselCache = initialData;
            setLoading(false);
            return;
        }

        if (isFetchingCarousels) return;
        isFetchingCarousels = true;

        const fetchCarousels = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/carousels/active`);
                const data = await res.json();
                setCarousels(data);
                carouselCache = data;
            } catch (err) {
                console.error("Failed to fetch carousels");
            } finally {
                setLoading(false);
                isFetchingCarousels = false;
            }
        };

        fetchCarousels();
    }, []);

    useEffect(() => {
        if (carousels.length > 1) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [carousels.length]);

    if (loading) return <div className="h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center animate-pulse"></div>;
    if (carousels.length === 0) return null;

    return (
        <section id="home" className="relative overflow-hidden bg-white dark:bg-gray-950 pt-[5rem]">
            {/* Full-Width Carousel at Top */}
            <div className="relative w-full aspect-[2048/836] overflow-hidden shadow-2xl">
                {carousels.map((item, index) => (
                    <div
                        key={item.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                        aria-hidden={index !== activeIndex}
                    >
                        {item.link_url ? (
                            <a href={item.link_url} target={item.link_target} rel={item.link_target === '_blank' ? "noopener noreferrer" : undefined}>
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/storage/${item.image_path}`}
                                    alt="แบนเนอร์วิทยาลัยเทคโนโลยีศรีราชา"
                                    className="object-cover w-full h-full cursor-pointer hover:scale-105 transition-transform duration-[10s]"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchPriority={index === 0 ? "high" : "low"}
                                    width="1920"
                                    height="1080"
                                    decoding="async"
                                />
                            </a>
                        ) : (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/storage/${item.image_path}`}
                                alt="แบนเนอร์วิทยาลัยเทคโนโลยีศรีราชา"
                                className="object-cover w-full h-full"
                                loading={index === 0 ? "eager" : "lazy"}
                                fetchPriority={index === 0 ? "high" : "low"}
                                width="1920"
                                height="1080"
                                decoding="async"
                            />
                        )}
                        {/* Blue-tinted Overlay */}
                        <div className="absolute inset-0 bg-primary-900/10 mix-blend-multiply pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-white/10 dark:to-transparent pointer-events-none"></div>
                    </div>
                ))}

                {/* Controls */}
                {carousels.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all z-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label="รูปภาพก่อนหน้า"
                        >
                            <i className="fas fa-chevron-left" aria-hidden="true"></i>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all z-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label="รูปภาพถัดไป"
                        >
                            <i className="fas fa-chevron-right" aria-hidden="true"></i>
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20" role="tablist">
                            {carousels.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    role="tab"
                                    aria-selected={index === activeIndex}
                                    aria-label={`ไปยังสไลด์ที่ ${index + 1}`}
                                    className={`h-1.5 rounded-full bg-white transition-all ${index === activeIndex ? "w-12" : "w-6 opacity-40"}`}
                                ></button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Creative Content Below Carousel */}
            <div className="pt-20 pb-20 relative">
                {/* Marquee Background Text */}
                <div className="absolute top-40 left-0 w-full opacity-[0.03] select-none pointer-events-none marquee-container overflow-hidden">
                    <div className="marquee-content kinetic-text uppercase">
                        SRIRACHA TECHNOLOGICAL COLLEGE SRIRACHA TECHNOLOGICAL COLLEGE&nbsp;
                    </div>
                    <div className="marquee-content kinetic-text uppercase">
                        SRIRACHA TECHNOLOGICAL COLLEGE SRIRACHA TECHNOLOGICAL COLLEGE&nbsp;
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 w-full">
                    <div className="grid lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-8">
                            <Reveal animation="fade-up" duration={1.2}>
                                <span className="text-primary-700 font-black tracking-[0.3em] uppercase text-sm mb-6 block">
                                    เปิดโอกาสใหม่ ๆ ในการเรียนรู้และพัฒนาทักษะของคุณ
                                </span>
                                <h1 className="kinetic-text uppercase mb-10 leading-[0.9] dark:text-white">
                                    The Future<br />
                                    <span className="text-outline dark:text-white">เริ่มขึ้นที่นี่</span>
                                </h1>
                            </Reveal>
                        </div>
                        <div className="lg:col-span-4 pb-4">
                            <Reveal animation="fade-up" delay={0.4} duration={1.2}>
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-8">
                                        <img src="/logo_sriracha.png" alt="ตราวิทยาลัยเทคโนโลยีศรีราชา" className="h-40 md:h-48 w-auto object-contain drop-shadow-2xl" />
                                    </div>
                                    <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-10 font-medium max-w-sm">
                                        มุ่งเน้นความเป็นเลิศทางนวัตกรรมและเทคโนโลยี
                                        สร้างความพร้อมให้นักศึกษาสู่ตลาดแรงงานระดับสากล
                                    </p>
                                    <div className="flex flex-col items-center space-y-4">
                                        <a href="#enroll" className="w-16 h-16 bg-black dark:bg-white dark:text-black text-white rounded-full grid place-items-center hover:scale-110 transition-transform shadow-2xl" aria-label="เลื่อนลงดูข้อมูลเพิ่มเติม">
                                            <i className="fas fa-arrow-down text-xl animate-bounce" aria-hidden="true"></i>
                                        </a>
                                        <span className="font-bold text-gray-500 dark:text-gray-400">สนใจสมัครเรียนกับเรา</span>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
