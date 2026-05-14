import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    ChevronLeft, ChevronRight, GraduationCap,
    ArrowRight, Check, BookOpen
} from "lucide-react";
import Reveal from "./Reveal";

interface Curriculum {
    id: number;
    name: string;
    slug: string;
    level: string;
    description: string;
    image: string | null;
    document_path: string | null;
}

// Global cache
let curriculaCache: Curriculum[] | null = null;
let isFetchingCurricula = false;

export default function Programs({ initialData = [] }: { initialData?: Curriculum[] }) {
    const [curricula, setCurricula] = useState<Curriculum[]>(curriculaCache || initialData);
    const [loading, setLoading] = useState(!curriculaCache && initialData.length === 0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        if (curriculaCache && curriculaCache.length > 0) {
            setCurricula(curriculaCache);
            setLoading(false);
            return;
        }

        if (initialData && initialData.length > 0) {
            setCurricula(initialData);
            curriculaCache = initialData;
            setLoading(false);
            return;
        }

        if (isFetchingCurricula) return;
        isFetchingCurricula = true;

        const fetchCurricula = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/curricula`);
                const data = await res.json();
                setCurricula(data);
                curriculaCache = data;
            } catch (err) {
                console.error("Failed to fetch curricula");
            } finally {
                setLoading(false);
                isFetchingCurricula = false;
            }
        };
        fetchCurricula();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setItemsPerView(1);
            else if (window.innerWidth < 1024) setItemsPerView(2);
            else if (window.innerWidth < 1280) setItemsPerView(3);
            else setItemsPerView(4);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        if (currentIndex < curricula.length - itemsPerView) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (!loading && curricula.length === 0) return null;

    return (
        <section id="programs" className="py-32 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <Reveal className="mb-8 md:mb-0">
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100 mb-6">
                            <GraduationCap size={14} />
                            <span>Programs</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black uppercase leading-tight dark:text-white tracking-tighter">
                            หลักสูตร<br />ที่เปิดสอน
                        </h2>
                    </Reveal>
                    <Reveal delay={0.2} className="flex flex-col items-end space-y-8">
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium text-right hidden md:block leading-relaxed text-sm">
                            วิทยาลัยเทคโนโลยีศรีราชาเปิดสอนหลักสูตรประกาศนียบัตรวิชาชีพ และประกาศนียบัตรวิชาชีพชั้นสูงหลากหลายหลักสูตร ดังนี้
                        </p>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={prevSlide}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${currentIndex === 0 ? 'border-gray-100 text-gray-300' : 'border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-primary-600 hover:text-white hover:border-primary-600 shadow-sm'}`}
                                disabled={currentIndex === 0}
                                aria-label="เลื่อนไปก่อนหน้า"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${currentIndex >= curricula.length - itemsPerView ? 'border-gray-100 text-gray-300' : 'border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-primary-600 hover:text-white hover:border-primary-600 shadow-sm'}`}
                                disabled={currentIndex >= curricula.length - itemsPerView}
                                aria-label="เลื่อนไปถัดไป"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </Reveal>
                </div>

                <div className="relative">
                    {loading ? (
                        <div className="flex gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="min-w-[calc((100%-3rem)/4)] h-[400px] bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-visible">
                            <div
                                className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                                style={{
                                    transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}%))`,
                                    gap: '0'
                                }}
                            >
                                {curricula.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="px-3 shrink-0 transition-all duration-500"
                                        style={{ width: `${100 / itemsPerView}%` }}
                                    >
                                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] h-full overflow-hidden group border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-700 flex flex-col">
                                            <div className="h-[200px] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                                {item.image ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}/storage/${item.image}`}
                                                        alt={`หลักสูตร ${item.name} - วิทยาลัยเทคโนโลยีศรีราชา`}
                                                        className="w-full h-full object-cover transition-transform duration-1000"
                                                        loading="lazy"
                                                        width="400"
                                                        height="200"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-5xl select-none">
                                                        {item.name.substring(0, 2)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="mb-4">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm ${item.level === 'ปวช.' ? 'bg-orange-500 text-white' : 'bg-purple-600 text-white'}`}>
                                                        {item.level}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold uppercase leading-tight tracking-tight text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <Link
                                                        to={`/programs/${item.slug}`}
                                                        className="inline-flex items-center text-primary-700 font-black uppercase tracking-widest text-[10px] group/btn"
                                                    >
                                                        ดูรายละเอียด
                                                        <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                                        <BookOpen size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section>
    );
}
