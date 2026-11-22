import { useState, useEffect, useMemo } from "react";
import { Search, Calendar, Eye, ExternalLink, Camera, Sparkles } from "lucide-react";
import Reveal from "../components/Reveal";

interface ActivityAlbum {
    id: number;
    title: string;
    description: string | null;
    cover_image: string | null;
    google_photo_url: string;
    event_date: string | null;
    category?: string | null;
    views: number;
    created_at: string;
}

export default function GalleryPage() {
    const [albums, setAlbums] = useState<ActivityAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        document.title = "ภาพกิจกรรม & อัลบั้มรูป | วิทยาลัยเทคโนโลยีศรีราชา";
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/activity-albums`, {
                headers: { "Accept": "application/json" }
            });
            if (!res.ok) throw new Error("Failed to load albums");
            const data = await res.json();
            setAlbums(data);
        } catch (err) {
            console.error("Error fetching albums:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAlbum = (album: ActivityAlbum) => {
        // Increment view count in background
        fetch(`${import.meta.env.VITE_API_URL}/api/activity-albums/${album.id}/view`, {
            method: "POST",
            headers: { "Accept": "application/json" }
        }).catch(() => {});

        // Update local state views
        setAlbums(prev => prev.map(a => a.id === album.id ? { ...a, views: a.views + 1 } : a));

        // Open Google Photos album in new tab
        window.open(album.google_photo_url, "_blank", "noopener,noreferrer");
    };

    const filteredAlbums = useMemo(() => {
        return albums.filter(album => {
            const matchSearch = searchTerm.trim() === "" || 
                album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (album.description && album.description.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchSearch;
        });
    }, [albums, searchTerm]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 relative overflow-hidden transition-colors duration-500">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[140px] -z-10"></div>
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] -z-10"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Header */}
                <header className="mb-12">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.25em] bg-primary-100/60 dark:bg-primary-900/30 px-4 py-1.5 rounded-full mb-6 border border-primary-500/20">
                            <Camera size={13} className="text-primary-600 dark:text-primary-400" />
                            <span>Activity Photo Albums</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                            อัลบั้มภาพกิจกรรม <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600">
                                วิทยาลัยเทคโนโลยีศรีราชา
                            </span>
                        </h1>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium max-w-2xl text-base md:text-lg">
                            รวบรวมภาพถ่ายบรรยากาศกิจกรรม การแข่งขัน กีฬา และความประทับใจของชาวเทคโนฯศรีราชา สามารถคลิกเข้าชมและดาวน์โหลดภาพต้นฉบับความละเอียดสูงผ่าน Google Photos ได้ฟรี
                        </p>
                    </Reveal>
                </header>

                {/* Search Bar & Stats */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ค้นหาชื่อกิจกรรม หรือคำอธิบาย..."
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"
                            >
                                ล้าง
                            </button>
                        )}
                    </div>

                    {/* Total Count */}
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <Sparkles size={14} className="text-primary-500" />
                        <span>พบทั้งหมด {filteredAlbums.length} อัลบั้มกิจกรรม</span>
                    </div>
                </div>

                {/* Album Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] h-[380px] animate-pulse border border-slate-100 dark:border-slate-800"></div>
                        ))}
                    </div>
                ) : filteredAlbums.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-12 text-center my-12">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <Camera size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">ไม่พบอัลบั้มภาพกิจกรรม</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            {searchTerm
                                ? "ลองเปลี่ยนคำค้นหา หรือพิมพ์ค้นหาด้วยชื่อกิจกรรมอื่น"
                                : "ขณะนี้ยังไม่มีอัลบั้มภาพกิจกรรมที่เปิดเผยแพร่"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredAlbums.map((album, index) => {
                            const formattedDate = formatDate(album.event_date);
                            return (
                                <Reveal key={album.id} delay={index * 0.05}>
                                    <div className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-150 dark:border-slate-800/80 hover:border-primary-500/30 dark:hover:border-primary-500/30 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 flex flex-col h-full hover:-translate-y-1.5">
                                        {/* Cover Image Block */}
                                        <div 
                                            onClick={() => handleOpenAlbum(album)}
                                            className="aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden cursor-pointer"
                                        >
                                            {album.cover_image ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/storage/${album.cover_image}`}
                                                    alt={album.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-600/20 via-blue-600/20 to-indigo-600/20 text-primary-600 dark:text-primary-400">
                                                    <Camera size={48} className="opacity-40 mb-2" />
                                                    <span className="text-xs font-black uppercase tracking-widest opacity-60">S-TECH Album</span>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>

                                            {/* Google Photos Branding Badge */}
                                            <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-full shadow-md border border-slate-100 dark:border-slate-800">
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#f8fafc" />
                                                    <path d="M12 3v9H3c0-4.97 4.03-9 9-9z" fill="#EA4335"/>
                                                    <path d="M21 12c0-4.97-4.03-9-9-9v9h9z" fill="#4285F4"/>
                                                    <path d="M12 21c4.97 0 9-4.03 9-9h-9v9z" fill="#34A853"/>
                                                    <path d="M3 12c0 4.97 4.03 9 9 9v-9H3z" fill="#FBBC05"/>
                                                </svg>
                                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">Google Photos</span>
                                            </div>

                                            {/* Date / Quick Info Overlay at Bottom */}
                                            {formattedDate && (
                                                <div className="absolute bottom-3 left-4 z-10 flex items-center text-white/90 text-xs font-bold space-x-1.5 drop-shadow-md">
                                                    <Calendar size={13} className="text-primary-300" />
                                                    <span>{formattedDate}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6 sm:p-7 flex flex-col flex-1">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2.5">
                                                <span className="flex items-center gap-1">
                                                    <Eye size={13} /> {album.views || 0} ครั้ง
                                                </span>
                                            </div>

                                            <h3 
                                                onClick={() => handleOpenAlbum(album)}
                                                className="text-lg sm:text-xl font-black text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug cursor-pointer mb-2.5"
                                            >
                                                {album.title}
                                            </h3>

                                            {album.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed mb-6">
                                                    {album.description}
                                                </p>
                                            )}

                                            {/* Action Button */}
                                            <button
                                                onClick={() => handleOpenAlbum(album)}
                                                className="w-full mt-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all cursor-pointer group/btn"
                                            >
                                                <span>เปิดดูรูปภาพในอัลบั้ม</span>
                                                <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
