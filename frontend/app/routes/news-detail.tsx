import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
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
    Bookmark,
    X,
    LayoutGrid,
    Camera
} from "lucide-react";
import Reveal from "../components/Reveal";
import toast from "react-hot-toast";

interface NewsItem {
    id: number;
    title: string;
    content: string;
    featured_image: string | null;
    gallery?: string[] | null;
    google_photo_url?: string | null;
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
    
    const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        setActiveImageIdx(index);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setActiveImageIdx(null);
        document.body.style.overflow = "unset";
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (news?.gallery && activeImageIdx !== null) {
            setActiveImageIdx((activeImageIdx + 1) % news.gallery.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (news?.gallery && activeImageIdx !== null) {
            setActiveImageIdx((activeImageIdx - 1 + news.gallery.length) % news.gallery.length);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeImageIdx === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeImageIdx, news?.gallery]);

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
                .gallery-scroll::-webkit-scrollbar {
                    height: 6px;
                }
                .gallery-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .gallery-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 9999px;
                }
                .dark .gallery-scroll::-webkit-scrollbar-thumb {
                    background: #334155;
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
                            {news.google_photo_url && (
                                <a 
                                    href={news.google_photo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-900/50 px-3.5 py-1.5 rounded-full border border-primary-500/20 transition-all hover:scale-105"
                                >
                                    <Camera size={14} className="mr-1.5" />
                                    <span>อัลบั้ม Google Photos</span>
                                    <ExternalLink size={11} className="ml-1 opacity-70" />
                                </a>
                            )}
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

                {/* News Gallery Grid with Overlay (Placed beautifully under the featured image) */}
                {news.gallery && news.gallery.length > 0 && (
                    <Reveal delay={0.25}>
                        <div className="mb-12">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {news.gallery.slice(0, 4).map((path, idx) => {
                                    const isLast = news.gallery.length > 4 && idx === 3;
                                    return (
                                        <div 
                                            key={idx} 
                                            onClick={() => openLightbox(idx)}
                                            className="aspect-[4/3] bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm cursor-pointer relative group"
                                        >
                                            <img 
                                                src={`${import.meta.env.VITE_API_URL}/storage/${path}`} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                alt={`Gallery image ${idx + 1}`} 
                                            />
                                            {isLast ? (
                                                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white transition-all duration-300 group-hover:bg-slate-950/50">
                                                    <span className="text-3xl md:text-4xl font-black tracking-wider">+{news.gallery.length - 3}</span>
                                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1 text-slate-300">รูปภาพ</span>
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <span className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                        <Share size={16} className="rotate-45" />
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* Google Photos Album Banner */}
                {news.google_photo_url && (
                    <Reveal delay={0.28}>
                        <div className="mb-14 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-emerald-950/40 border border-blue-200/60 dark:border-blue-900/40 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-start sm:items-center space-x-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#f8fafc" className="dark:fill-slate-800" />
                                            <path d="M12 3v9H3c0-4.97 4.03-9 9-9z" fill="#EA4335"/>
                                            <path d="M21 12c0-4.97-4.03-9-9-9v9h9z" fill="#4285F4"/>
                                            <path d="M12 21c4.97 0 9-4.03 9-9h-9v9z" fill="#34A853"/>
                                            <path d="M3 12c0 4.97 4.03 9 9 9v-9H3z" fill="#FBBC05"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-100/60 dark:bg-primary-900/40 px-2.5 py-0.5 rounded-full">
                                                Google Photos
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">อัลบั้มภาพกิจกรรม</span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                            ชมภาพบรรยากาศกิจกรรมทั้งหมด (ความละเอียดสูง)
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                                            สามารถกดเข้าชมและบันทึกรูปภาพกิจกรรมต้นฉบับผ่าน Google Photos ได้ทันที
                                        </p>
                                    </div>
                                </div>
                                <a 
                                    href={news.google_photo_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 shrink-0 w-full md:w-auto cursor-pointer"
                                >
                                    <span>เปิดดูอัลบั้มภาพบน Google Photos</span>
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    </Reveal>
                )}

                <article className="prose prose-slate dark:prose-invert lg:prose-xl max-w-none prose-img:rounded-3xl prose-img:shadow-none prose-img:border-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-600 prose-blockquote:border-primary-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl">
                    <div 
                        className="tiptap-content leading-relaxed text-slate-700 dark:text-slate-300"
                        dangerouslySetInnerHTML={{ __html: news.content }} 
                    />
                </article>

                {/* Premium Lightbox Modal */}
                <AnimatePresence>
                    {activeImageIdx !== null && news.gallery && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeLightbox}
                            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                        >
                            <button 
                                onClick={closeLightbox}
                                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 cursor-pointer z-10"
                                title="ปิดหน้าต่าง (ESC)"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Navigation Arrow */}
                            {news.gallery.length > 1 && (
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 cursor-pointer z-10"
                                    title="ภาพก่อนหน้า (←)"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            {/* Main High-Res Image Container */}
                            <motion.div 
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                                className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                            >
                                <img 
                                    src={`${import.meta.env.VITE_API_URL}/storage/${news.gallery[activeImageIdx]}`} 
                                    className="w-full h-auto max-h-[85vh] object-contain" 
                                    alt={`Gallery detail ${activeImageIdx + 1}`} 
                                />
                                
                                {/* Photo caption overlay */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-6 text-white text-center flex flex-col items-center gap-2">
                                    <p className="font-bold text-sm tracking-wide">ภาพที่ {activeImageIdx + 1} จากทั้งหมด {news.gallery.length} ภาพ</p>
                                    {news.google_photo_url && (
                                        <a 
                                            href={news.google_photo_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur transition-all active:scale-95"
                                        >
                                            <Camera size={14} /> ดูภาพกิจกรรมทั้งหมดบน Google Photos <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </motion.div>

                            {/* Right Navigation Arrow */}
                            {news.gallery.length > 1 && (
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 cursor-pointer z-10"
                                    title="ภาพถัดไป (→)"
                                >
                                    <ChevronLeft size={24} className="rotate-180" />
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
