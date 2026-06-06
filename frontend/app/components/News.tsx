import { useState, useEffect } from "react";
import { Link } from "react-router";
import Reveal from "./Reveal";
import * as Lucide from "lucide-react";
const { ArrowUpRight } = Lucide;

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    featured_image: string | null;
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

    // Helper function สำหรับดึงรูปภาพ
    const getImageUrl = (path: string | null) => {
        if (!path) return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
        return `${import.meta.env.VITE_API_URL}/storage/${path}`;
    };

    return (
        <section id="news" className="py-24 bg-white dark:bg-gray-950">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <Reveal>
                        <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-xs mb-3 block">PR & News</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase leading-none dark:text-white">ประชาสัมพันธ์</h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium mt-4 md:mt-0 text-sm md:text-right">
                            ติดตามข่าวสาร กิจกรรม และความเคลื่อนไหวต่าง ๆ ของวิทยาลัยเทคโนโลยีศรีราชา
                        </p>
                    </Reveal>
                </div>

                {/* 3-Column Simple Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {news.map((item, index) => (
                        <Reveal key={item.id} delay={0.2 + index * 0.1} className="flex">
                            <Link 
                                to={`/news/${item.slug}`} 
                                className="group flex flex-col w-full bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                <div className="aspect-[16/10] overflow-hidden relative bg-slate-50 dark:bg-slate-800">
                                    {item.featured_image ? (
                                        <img
                                            src={getImageUrl(item.featured_image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-3xl select-none">
                                            {item.title?.substring(0, 2) || "ST"}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 mb-2 block">
                                        ข่าวประชาสัมพันธ์
                                    </span>
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors leading-snug line-clamp-2 mb-4">
                                        {item.title}
                                    </h3>
                                    <div className="mt-auto flex items-center text-primary-600 dark:text-primary-400 font-black text-[10px] uppercase tracking-wider group/link">
                                        อ่านรายละเอียด
                                        <ArrowUpRight size={14} className="ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Reveal delay={0.5}>
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
