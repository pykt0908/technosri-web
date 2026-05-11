import { useEffect, useState } from "react";
import Reveal from "./Reveal";

const carouselItems = [
    {
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        alt: "บรรยากาศการเรียนการสอนในห้องปฏิบัติการโรงงานจำลอง"
    },
    {
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        alt: "ห้องปฏิบัติการคอมพิวเตอร์และเทคโนโลยีสารสนเทศที่ทันสมัย"
    }
];

export default function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="home" className="relative overflow-hidden bg-white dark:bg-gray-950 pt-[5rem]">
            {/* Full-Width Carousel at Top */}
            <div className="relative w-full aspect-video md:aspect-auto md:h-[calc(100vh-5rem)] overflow-hidden">
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                        aria-hidden={index !== activeIndex}
                    >
                        <img
                            src={item.image}
                            alt={item.alt}
                            className="object-cover w-full h-full"
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchPriority={index === 0 ? "high" : "low"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                    </div>
                ))}

                {/* Controls */}
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
                    {carouselItems.map((_, index) => (
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
                                <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-6 block">
                                    เปิดโอกาศใหม่ ๆ ในการเรียนรู้และพัฒนาทักษะของคุณ
                                </span>
                                <h1 className="kinetic-text uppercase mb-10 leading-[0.9] dark:text-white">
                                    The Future<br />
                                    <span className="text-outline dark:text-white">เริ่มขึ้นที่นี่</span>
                                </h1>
                            </Reveal>
                        </div>
                        <div className="lg:col-span-4 pb-4">
                            <Reveal animation="fade-up" delay={0.4} duration={1.2}>
                                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 border-l-4 border-primary-600 pl-6 font-medium">
                                    มุ่งเน้นความเป็นเลิศทางนวัตกรรมและเทคโนโลยี
                                    สร้างความพร้อมให้นักศึกษาสู่ตลาดแรงงานระดับสากล
                                </p>
                                <div className="flex items-center space-x-6">
                                    <a href="#enroll" className="w-16 h-16 bg-black dark:bg-white dark:text-black text-white rounded-full grid place-items-center hover:scale-110 transition-transform shadow-2xl" aria-label="เลื่อนลงดูข้อมูลเพิ่มเติม">
                                        <i className="fas fa-arrow-down text-xl animate-bounce" aria-hidden="true"></i>
                                    </a>
                                    <span className="font-bold text-gray-500 dark:text-gray-400">สนใจสมัครเรียนกับเรา</span>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
