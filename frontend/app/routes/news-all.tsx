import { useState, useEffect } from "react";
import { Link } from "react-router";
import * as Lucide from "lucide-react";
import Reveal from "../components/Reveal";

// ดึงไอคอนออกมาทีละตัวเพื่อความปลอดภัย
const Calendar = Lucide.Calendar || Lucide.Clock;
const ChevronRight = Lucide.ChevronRight || Lucide.ArrowRight;
const Search = Lucide.Search || Lucide.Search;

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    featured_image: string | null;
    published_at: string;
    created_at: string;
}

export default function NewsAll() {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
                const data = await res.json();
                setNewsList(data);
            } catch (err) {
                console.error("Failed to fetch news:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    const filteredNews = newsList.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <Reveal>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">ข่าวสารและกิจกรรม</h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">ติดตามความเคลื่อนไหว กิจกรรม และประกาศต่างๆ ของวิทยาลัยเทคโนโลยีศรีราชา</p>
                    </div>
                </Reveal>

                <div className="mb-12 relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="ค้นหาข่าวสาร..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] h-[400px] animate-pulse border border-slate-100 dark:border-slate-800"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((item, index) => (
                            <Reveal key={item.id} delay={index * 0.1}>
                                <Link to={`/news/${item.slug}`} className="group block bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2">
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        {item.featured_image ? (
                                            <img 
                                                src={`${import.meta.env.VITE_API_URL}/storage/${item.featured_image}`} 
                                                alt={item.title}
                                                className="w-full h-full transition-transform duration-700 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-5xl select-none">
                                                {item.title.substring(0, 2)}
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <div className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary-600 uppercase tracking-widest shadow-sm">
                                                STC News
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-wider">
                                            <Calendar size={14} className="mr-2 text-primary-500" />
                                            {formatDate(item.published_at || item.created_at)}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center text-primary-600 text-sm font-bold group-hover:gap-2 transition-all">
                                            อ่านเพิ่มเติม <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                )}

                {!loading && filteredNews.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-slate-300 mb-4"><Search size={64} className="mx-auto" /></div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">ไม่พบข่าวสารที่คุณค้นหา</h3>
                        <p className="text-slate-500">ลองใช้คำค้นหาอื่นดูอีกครั้ง</p>
                    </div>
                )}
            </div>
        </div>
    );
}
