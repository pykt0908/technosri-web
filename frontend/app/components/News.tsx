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
        <section id="news" className="py-32 bg-white dark:bg-gray-950">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <Reveal>
                        <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">PR & News</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none dark:text-white">ประชาสัมพันธ์</h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm font-medium mt-6 md:mt-0 text-right">
                            ติดตามข่าวสาร กิจกรรม และความเคลื่อนไหวต่าง ๆ ของวิทยาลัยเทคโนโลยีศรีราชา
                        </p>
                    </Reveal>
                </div>

                {/* Dynamic Image Grid */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Big Item - Latest News */}
                    <Reveal delay={0.3} className="lg:col-span-7 overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-500 group">
                        <Link to={news[0] ? `/news/${news[0].slug}` : "#"} className="flex flex-col h-full">
                            <div className="aspect-[4/5] overflow-hidden relative">
                                {news[0]?.featured_image ? (
                                    <img
                                        src={getImageUrl(news[0]?.featured_image)}
                                        alt={news[0]?.title || "Featured"}
                                        className="w-full h-full object-cover transition-transform duration-1000"
                                        width="800"
                                        height="400"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-7xl select-none">
                                        {news[0]?.title?.substring(0, 2) || "ST"}
                                    </div>
                                )}
                            </div>
                            <div className="p-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-3 block">Latest News</span>
                                <h3 className="text-2xl font-black uppercase line-clamp-2 text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors leading-tight">
                                    {news[0]?.title || "กำลังโหลดข่าวสารล่าสุด..."}
                                </h3>
                            </div>
                        </Link>
                    </Reveal>

                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="grid grid-cols-2 gap-8">
                            {/* Second Item */}
                            <Reveal delay={0.4} className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-500 group">
                                <Link to={news[1] ? `/news/${news[1].slug}` : "#"} className="h-full block">
                                    {news[1]?.featured_image ? (
                                        <img
                                            src={getImageUrl(news[1]?.featured_image)}
                                            alt={news[1]?.title || "News"}
                                            className="w-full h-full object-cover transition-transform duration-1000"
                                            width="400"
                                            height="240"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-4xl select-none">
                                            {news[1]?.title?.substring(0, 2) || "ST"}
                                        </div>
                                    )}
                                </Link>
                            </Reveal>

                            {/* View More Button */}
                            <Reveal delay={0.5} className="aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                                <Link
                                    to="/news"
                                    className="w-full h-full bg-primary-500 flex flex-col items-center justify-center text-white hover:bg-primary-600 transition-colors group relative"
                                >
                                    <span className="text-4xl font-black mb-1">STC</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center">
                                        ดูข่าวทั้งหมด <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                </Link>
                            </Reveal>
                        </div>

                        {/* Third Item */}
                        <Reveal delay={0.6} className="overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-500 group">
                            <Link to={news[2] ? `/news/${news[2].slug}` : "#"} className="flex flex-col">
                                <div className="aspect-[4/5] overflow-hidden relative">
                                    {news[2]?.featured_image ? (
                                        <img
                                            src={getImageUrl(news[2]?.featured_image)}
                                            alt={news[2]?.title || "News"}
                                            className="w-full h-full object-cover transition-transform duration-1000"
                                            width="600"
                                            height="180"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-4xl select-none">
                                            {news[2]?.title?.substring(0, 2) || "ST"}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-black uppercase line-clamp-1 text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors leading-tight">
                                        {news[2]?.title || "ข่าวสารลำดับถัดไป"}
                                    </h3>
                                </div>
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
