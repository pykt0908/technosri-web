import { useState, useEffect } from "react";
import { Link } from "react-router";
import Reveal from "./Reveal";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    featured_image: string | null;
    published_at?: string;
    created_at?: string;
}

// Global cache to prevent re-fetching on re-mount
let newsCache: NewsItem[] | null = null;
let isFetchingNews = false;

export default function News({ initialData = [] }: { initialData?: NewsItem[] }) {
    const [news, setNews] = useState<NewsItem[]>(newsCache || initialData.filter((item: any) => item.status === 'published').slice(0, 3));

    useEffect(() => {
        if (newsCache && newsCache.length > 0) {
            setNews(newsCache);
            return;
        }
        
        if (initialData && initialData.length > 0) {
            const data = initialData.filter((item: any) => item.status === 'published').slice(0, 3);
            setNews(data);
            newsCache = data;
            return;
        }

        if (isFetchingNews) return;
        isFetchingNews = true;

        const fetchNews = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
                if (!res.ok) throw new Error("Server responded with error");
                const data = await res.json();
                const publishedNews = data.filter((item: any) => item.status === 'published');
                const finalData = publishedNews.slice(0, 3);
                setNews(finalData);
                newsCache = finalData;
            } catch (err) {
                console.error("Failed to fetch news:", err);
            } finally {
                isFetchingNews = false;
            }
        };
        fetchNews();
    }, []);

    // Helper: Dynamic fallback mesh gradients
    const getFallbackGradient = (id: number) => {
        const gradients = [
            "from-blue-600 via-indigo-755 to-purple-855",
            "from-sky-600 via-blue-755 to-indigo-855",
            "from-slate-800 via-primary-900 to-blue-955",
            "from-violet-650 via-purple-755 to-pink-855",
            "from-cyan-600 via-teal-755 to-emerald-855",
        ];
        return gradients[id % gradients.length];
    };

    // Helper: Get day number
    const getDay = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.getDate().toString().padStart(2, '0');
    };

    // Helper: Get Thai short month
    const getMonthShort = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        return months[date.getMonth()];
    };

    // Helper: Format Thai Date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    // Helper: Calculate Reading Time
    const getReadingTime = (title: string) => {
        return Math.max(2, Math.ceil(title.length / 35)) + " นาที";
    };

    const getImageUrl = (path: string | null) => {
        if (!path) return null;
        return `${import.meta.env.VITE_API_URL}/storage/${path}`;
    };

    return (
        <section id="news" className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
            {/* Background decorative gradients */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <Reveal>
                        <span className="text-primary-600 dark:text-primary-400 font-black tracking-[0.3em] uppercase text-xs mb-3 block">PR & News Updates</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase leading-none text-slate-900 dark:text-white">ข่าวประชาสัมพันธ์</h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium mt-4 md:mt-0 text-sm md:text-right">
                            เกาะติดประเด็นสำคัญ ความเคลื่อนไหว และข่าวประชาสัมพันธ์ล่าสุดจากวิทยาลัยเทคโนโลยีศรีราชา
                        </p>
                    </Reveal>
                </div>

                {news.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">ไม่พบข่าวประชาสัมพันธ์ในขณะนี้</div>
                ) : (
                    <div>
                        {/* Dynamic Grid Layout based on quantity of news items */}
                        {news.length === 1 && (
                            <div className="max-w-4xl mx-auto w-full">
                                <Reveal delay={0.2}>
                                    <Link 
                                        to={`/news/${news[0].slug}`} 
                                        className="group relative flex flex-col w-full bg-slate-900 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 border border-slate-100 dark:border-slate-800 min-h-[460px]"
                                    >
                                        {/* Image or fallback mesh gradient */}
                                        {news[0].featured_image ? (
                                            <div className="absolute inset-0 w-full h-full bg-slate-800">
                                                <img
                                                    src={getImageUrl(news[0].featured_image)!}
                                                    alt={news[0].title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-700"
                                                />
                                            </div>
                                        ) : (
                                            <div className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(news[0].id)} opacity-90`}>
                                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>

                                        {/* Date Badge */}
                                        <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col items-center min-w-[65px] text-center z-10">
                                            <span className="text-xl font-black text-primary-600 leading-none">{getDay(news[0].published_at || news[0].created_at)}</span>
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{getMonthShort(news[0].published_at || news[0].created_at)}</span>
                                        </div>

                                        {/* Text Content */}
                                        <div className="mt-auto p-8 sm:p-12 z-10 text-white relative">
                                            <span className="inline-flex items-center px-3.5 py-1 bg-primary-600 text-white text-[9px] font-black tracking-widest uppercase rounded-full mb-4 shadow-md shadow-primary-600/20">
                                                ข่าวเด่นประจำวัน
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-black mb-4 leading-tight group-hover:text-primary-300 transition-colors line-clamp-2">
                                                {news[0].title}
                                            </h3>
                                            <div className="flex items-center text-primary-400 font-black text-[10px] uppercase tracking-wider group/link">
                                                อ่านรายละเอียดข่าวสาร
                                                <ArrowUpRight size={14} className="ml-1 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            </div>
                        )}

                        {news.length === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto w-full">
                                {news.map((item, index) => (
                                    <Reveal key={item.id} delay={0.2 + index * 0.1} className="flex">
                                        <Link 
                                            to={`/news/${item.slug}`} 
                                            className="group relative flex flex-col w-full bg-slate-900 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 border border-slate-100 dark:border-slate-800 min-h-[380px]"
                                        >
                                            {/* Image or fallback gradient */}
                                            {item.featured_image ? (
                                                <div className="absolute inset-0 w-full h-full bg-slate-800">
                                                    <img
                                                        src={getImageUrl(item.featured_image)!}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-700"
                                                    />
                                                </div>
                                            ) : (
                                                <div className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(item.id)} opacity-90`}>
                                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>

                                            {/* Date Badge */}
                                            <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col items-center min-w-[65px] text-center z-10">
                                                <span className="text-xl font-black text-primary-600 leading-none">{getDay(item.published_at || item.created_at)}</span>
                                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{getMonthShort(item.published_at || item.created_at)}</span>
                                            </div>

                                            {/* Text Content */}
                                            <div className="mt-auto p-6 sm:p-8 z-10 text-white relative">
                                                <span className="inline-flex items-center px-3.5 py-1 bg-primary-600 text-white text-[9px] font-black tracking-widest uppercase rounded-full mb-3 shadow-md shadow-primary-600/20">
                                                    ข่าวสารล่าสุด
                                                </span>
                                                <h3 className="text-lg sm:text-xl font-black mb-3 leading-tight group-hover:text-primary-300 transition-colors line-clamp-2">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center text-primary-400 font-black text-[10px] uppercase tracking-wider group/link">
                                                    อ่านรายละเอียดข่าวสาร
                                                    <ArrowUpRight size={14} className="ml-1 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {news.length >= 3 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                                {/* 1. Featured News (Left side, takes 7/12 width on desktop) */}
                                {news[0] && (
                                    <div className="lg:col-span-7 xl:col-span-8 flex">
                                        <Reveal delay={0.2} className="w-full flex">
                                            <Link 
                                                to={`/news/${news[0].slug}`} 
                                                className="group relative flex flex-col w-full bg-slate-900 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 border border-slate-150 dark:border-slate-800 aspect-[16/10] lg:aspect-auto min-h-[420px] lg:min-h-[520px]"
                                            >
                                                {/* Background Image */}
                                                {news[0].featured_image ? (
                                                    <div className="absolute inset-0 w-full h-full bg-slate-800">
                                                        <img
                                                            src={getImageUrl(news[0].featured_image)!}
                                                            alt={news[0].title}
                                                            className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-700"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(news[0].id)} opacity-90`}>
                                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                                    </div>
                                                )}

                                                {/* Bottom Dark Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>

                                                {/* Floating Premium Date Badge */}
                                                <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col items-center min-w-[65px] text-center z-10">
                                                    <span className="text-xl font-black text-primary-600 leading-none">{getDay(news[0].published_at || news[0].created_at)}</span>
                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{getMonthShort(news[0].published_at || news[0].created_at)}</span>
                                                </div>

                                                {/* Text Content */}
                                                <div className="mt-auto p-8 sm:p-10 z-10 text-white relative">
                                                    <span className="inline-flex items-center px-3.5 py-1 bg-primary-600 text-white text-[9px] font-black tracking-widest uppercase rounded-full mb-4 shadow-md shadow-primary-600/20">
                                                        ข่าวเด่นประจำวัน
                                                    </span>
                                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 leading-tight group-hover:text-primary-300 transition-colors line-clamp-2">
                                                        {news[0].title}
                                                    </h3>
                                                    <div className="flex items-center text-primary-400 font-black text-[10px] uppercase tracking-wider group/link">
                                                        อ่านรายละเอียดข่าวสาร
                                                        <ArrowUpRight size={14} className="ml-1 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </Reveal>
                                    </div>
                                )}

                                {/* 2. Secondary News Grid (Right side, takes 5/12 width on desktop) */}
                                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                                    {news.slice(1, 3).map((item, index) => (
                                        <Reveal key={item.id} delay={0.3 + index * 0.1} className="flex-1 flex">
                                            <Link 
                                                to={`/news/${item.slug}`} 
                                                className="group flex flex-col sm:flex-row lg:flex-col xl:flex-row w-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 min-h-[170px]"
                                            >
                                                {/* Image Section */}
                                                <div className="sm:w-[40%] lg:w-full xl:w-[40%] aspect-[16/10] sm:aspect-auto lg:aspect-[16/10] xl:aspect-auto relative overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0">
                                                    {item.featured_image ? (
                                                        <img
                                                            src={getImageUrl(item.featured_image)!}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className={`w-full h-full bg-gradient-to-br ${getFallbackGradient(item.id)} flex items-center justify-center relative`}>
                                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]"></div>
                                                            <span className="text-white/25 font-black text-2xl select-none font-sans uppercase">STC</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Section */}
                                                <div className="p-6 flex flex-col justify-between flex-1">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[10px] font-bold text-slate-400 mb-2 gap-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar size={12} className="text-primary-500" />
                                                                <span>{formatDate(item.published_at || item.created_at)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock size={12} className="text-slate-350 dark:text-slate-500" />
                                                                <span>{getReadingTime(item.title)}</span>
                                                            </div>
                                                        </div>
                                                        <h4 className="text-sm sm:text-base font-bold text-slate-850 dark:text-white leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors mb-3">
                                                            {item.title}
                                                        </h4>
                                                    </div>
                                                    <div className="mt-auto flex items-center text-primary-600 dark:text-primary-400 font-black text-[10px] uppercase tracking-wider group/link">
                                                        อ่านรายละเอียด
                                                        <ArrowUpRight size={12} className="ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </Reveal>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Show All Button */}
                <div className="mt-16 text-center">
                    <Reveal delay={0.4}>
                        <Link
                            to="/news"
                            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-primary-500/15 group text-sm"
                        >
                            ดูข่าวสารทั้งหมด
                            <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
