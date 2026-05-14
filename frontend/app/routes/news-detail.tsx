import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { 
    Calendar, 
    User, 
    ChevronLeft, 
    Share2, 
    Link as LinkIcon, 
    Tag,
    Clock,
    Smile,
    ArrowLeft,
    Share,
    ExternalLink,
    Bookmark
} from "lucide-react";
import Reveal from "../components/Reveal";
import toast from "react-hot-toast";

interface NewsItem {
    id: number;
    title: string;
    content: string;
    featured_image: string | null;
    published_at: string; // ใช้ published_at
    created_at: string;
    author?: { name: string };
    meta_title?: string;
    meta_description?: string;
}

export default function NewsDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/news/v/${slug}`, {
                    headers: { "Accept": "application/json" }
                });
                if (!res.ok) throw new Error("News not found");
                const data = await res.json();
                setNews(data);
            } catch (err) {
                toast.error("ไม่พบข้อมูลข่าวสาร");
                navigate("/news");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchNewsDetail();
        }
    }, [slug, navigate]);

    // ฟังก์ชันจัดรูปแบบวันที่
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const options: Intl.DateTimeFormatOptions = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!news) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-20">
            <style>{`
                .tiptap-content {
                    white-space: pre-wrap;
                }
                .tiptap-content p {
                    min-height: 1.5rem;
                    margin-bottom: 1.25rem;
                }
                .tiptap-content [style*="text-align: left"] { text-align: left; }
                .tiptap-content [style*="text-align: center"] { text-align: center; }
                .tiptap-content [style*="text-align: right"] { text-align: right; }
                .tiptap-content [style*="text-align: justify"] { text-align: justify; }
                .tiptap-content ul { list-style-type: disc; margin-left: 1.5rem; }
                .tiptap-content ol { list-style-type: decimal; margin-left: 1.5rem; }
                .tiptap-content blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; font-style: italic; color: #64748b; margin: 1.5rem 0; }
                
                /* Bootstrap-style Striped Table (Horizontal lines only) */
                .tiptap-content table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    margin: 1.5rem 0 !important;
                    border: none !important;
                }
                .tiptap-content td p, .tiptap-content th p {
                    margin-bottom: 0 !important;
                }
                .tiptap-content th {
                    background-color: #f8fafc !important;
                    padding: 12px 16px !important;
                    font-weight: 700 !important;
                    text-align: left !important;
                    border: none !important;
                    border-bottom: 2px solid #cbd5e1 !important;
                    color: #0f172a !important;
                    font-size: 0.85rem !important;
                }
                .dark .tiptap-content th {
                    background-color: #1e293b !important;
                    border-bottom-color: #334155 !important;
                    color: #f1f5f9 !important;
                }
                .tiptap-content td {
                    padding: 12px 16px !important;
                    border: none !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    color: #33415b !important;
                    font-size: 0.9rem !important;
                    vertical-align: top !important;
                }
                .dark .tiptap-content td {
                    border-bottom-color: #1e293b !important;
                    color: #cbd5e1 !important;
                }
                .tiptap-content tr:nth-child(even) {
                    background-color: #f8fafc !important;
                }
                .dark .tiptap-content tr:nth-child(even) {
                    background-color: rgba(30, 41, 59, 0.5) !important;
                }
                .tiptap-content tr:hover {
                    background-color: #f1f5f9 !important;
                }
                .dark .tiptap-content tr:hover {
                    background-color: rgba(30, 41, 59, 0.8) !important;
                }
                .tiptap-content hr {
                    border: none !important;
                    border-top: 1px solid #cbd5e1 !important;
                    margin: 1.5rem 0 !important;
                    opacity: 1 !important;
                }
                .dark .tiptap-content hr {
                    border-top-color: #334155 !important;
                }
            `}</style>
            <div className="max-w-[1000px] mx-auto px-6">
                <div className="mb-12 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors group"
                    >
                        <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        ย้อนกลับ
                    </button>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <i className="fab fa-facebook-f text-[18px]"></i>
                        </button>
                        <button className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-900 hover:text-white transition-all shadow-sm"><Share2 size={18} /></button>
                        <button className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-900 hover:text-white transition-all shadow-sm"><LinkIcon size={18} /></button>
                    </div>
                </div>

                <Reveal>
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100 mb-6">
                            <Tag size={12} />
                            <span>News & PR STC</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 dark:text-white leading-[1.1] mb-8 tracking-tight">
                            {news.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-gray-400">
                            <div className="flex items-center">
                                <Calendar size={18} className="mr-2 text-primary-500" />
                                {formatDate(news.published_at || news.created_at)}
                            </div>
                            <div className="flex items-center">
                                <User size={18} className="mr-2 text-primary-500" />
                                {news.author?.name || "Administrator"}
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="mb-16 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary-500/10 border border-gray-100 dark:border-gray-800">
                        {news.featured_image ? (
                            <img 
                                src={`${import.meta.env.VITE_API_URL}/storage/${news.featured_image}`} 
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-8xl select-none">
                                {news.title.substring(0, 2)}
                            </div>
                        )}
                    </div>
                </Reveal>

                <article className="prose prose-slate dark:prose-invert lg:prose-xl max-w-none prose-img:rounded-3xl prose-img:shadow-none prose-img:border-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-600 prose-blockquote:border-primary-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl">
                    <div 
                        className="tiptap-content leading-relaxed text-slate-700 dark:text-slate-300"
                        dangerouslySetInnerHTML={{ __html: news.content }} 
                    />
                </article>
            </div>
        </div>
    );
}
