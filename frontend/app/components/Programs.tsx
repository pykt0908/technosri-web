import { useState, useEffect } from "react";
import Reveal from "./Reveal";

const programs = [
    {
        title: "ช่างอุตสาหกรรม",
        icon: "fa-tools",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        details: ["ช่างยนต์ (ยานยนต์สมัยใหม่)", "ช่างไฟฟ้ากำลัง", "ช่างอิเล็กทรอนิกส์"]
    },
    {
        title: "พาณิชยกรรม",
        icon: "fa-chart-pie",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        details: ["การบัญชี", "การตลาด (E-Commerce)", "การจัดการธุรกิจ"]
    },
    {
        title: "เทคโนโลยีสารสนเทศ",
        icon: "fa-laptop-code",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        details: ["คอมพิวเตอร์ธุรกิจ", "เทคโนโลยีสารสนเทศ", "กราฟิกดีไซน์"]
    },
    {
        title: "หลักสูตรระยะสั้น",
        icon: "fa-certificate",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        details: ["ภาษาต่างประเทศ", "ทักษะดิจิทัลสมัยใหม่", "การประกอบธุรกิจส่วนตัว"]
    }
];

export default function Programs() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setItemsPerView(1);
            else if (window.innerWidth < 1024) setItemsPerView(2);
            else setItemsPerView(3);
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        if (currentIndex < programs.length - itemsPerView) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <section id="programs" className="py-32 bg-white dark:bg-gray-950">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <Reveal className="mb-8 md:mb-0">
                        <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">สาขาวิชาที่น่าสนใจ</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none dark:text-white">หลักสูตร<br />ที่เปิดสอน</h2>
                    </Reveal>
                    <Reveal delay={0.2} className="flex flex-col items-end space-y-6">
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm font-medium text-right hidden md:block">
                            เราออกแบบหลักสูตรให้ตอบโจทย์โลกอนาคต ผสมผสานทักษะวิชาชีพเข้ากับนวัตกรรมสมัยใหม่
                        </p>
                        <div className="flex items-center space-x-4">
                            <button onClick={prevSlide} className="carousel-btn dark:bg-gray-800 dark:text-white dark:border-gray-700" disabled={currentIndex === 0} aria-label="เลื่อนซ้าย">
                                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                            </button>
                            <button onClick={nextSlide} className="carousel-btn dark:bg-gray-800 dark:text-white dark:border-gray-700" disabled={currentIndex >= programs.length - itemsPerView} aria-label="เลื่อนขวา">
                                <i className="fas fa-arrow-right" aria-hidden="true"></i>
                            </button>
                        </div>
                    </Reveal>
                </div>

                <div className="program-carousel-container !px-0 sm:!px-8">
                    <div
                        className="program-carousel-track"
                        style={{ transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}%))` }}
                    >
                        {programs.map((prog, index) => (
                            <div key={index} className="program-card-item min-w-[85vw] md:min-w-[calc((100%-2rem)/2)] lg:min-w-[calc((100%-4rem)/3)]">
                                <div className="bento-card rounded-[3rem] h-full overflow-hidden group dark:border-gray-800">
                                    <div className="h-[250px] relative overflow-hidden">
                                        <img src={prog.image} alt={prog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-6 left-8 text-white">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                                                <i className={`fas ${prog.icon}`}></i>
                                            </div>
                                            <h3 className="text-3xl font-black uppercase">{prog.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-10 bg-white dark:bg-gray-900">
                                        <ul className="space-y-4 text-gray-500 dark:text-gray-400 font-bold mb-8">
                                            {prog.details.map((detail, idx) => (
                                                <li key={idx} className="flex items-center">
                                                    <i className="fas fa-check text-primary-500 mr-3"></i>
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                        <a href="#" className="inline-flex items-center text-primary-500 font-black uppercase tracking-widest group/btn">
                                            ดูรายละเอียด <i className="fas fa-arrow-right ml-3 group-hover/btn:translate-x-2 transition-transform"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
