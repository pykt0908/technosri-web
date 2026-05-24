import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import * as Lucide from "lucide-react";
import Reveal from "../components/Reveal";

// Helper for Lucide icons
const FileText = Lucide.FileText || Lucide.File;
const FileSpreadsheet = Lucide.FileSpreadsheet || Lucide.File;
const Archive = Lucide.Archive || Lucide.File;
const FileImage = Lucide.Image || Lucide.File;
const DefaultFileIcon = Lucide.File || Lucide.File;
const Search = Lucide.Search || Lucide.Search;
const ArrowRight = Lucide.ArrowRight || Lucide.ChevronRight;
const Download = Lucide.Download || Lucide.ArrowDown;
const Calendar = Lucide.Calendar || Lucide.Clock;

interface DownloadFileItem {
    id: number;
    download_category_id: number;
    title: string;
    file_path: string;
    file_size: string | null;
    download_count: number;
    created_at: string;
}

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
}

export default function DownloadsPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(null);
    const [files, setFiles] = useState<DownloadFileItem[]>([]);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/categories`);
                const data = await res.json();
                setCategories(data);

                if (data.length > 0) {
                    // If no slug is specified in the route, default to first category
                    if (!slug) {
                        navigate(`/downloads/${data[0].slug}`, { replace: true });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch download categories", err);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [slug, navigate]);

    // Fetch files when active category slug changes
    useEffect(() => {
        if (!slug || categories.length === 0) return;

        const cat = categories.find(c => c.slug === slug);
        if (cat) {
            setCurrentCategory(cat);
            fetchCategoryFiles(cat.slug);
        } else {
            // Slug not found in categories list, default to first
            navigate(`/downloads/${categories[0].slug}`, { replace: true });
        }
    }, [slug, categories, navigate]);

    const fetchCategoryFiles = async (categorySlug: string) => {
        setLoadingFiles(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/categories/v/${categorySlug}`);
            const data = await res.json();
            setFiles(data.files || []);
        } catch (err) {
            console.error("Failed to fetch files for category", err);
        } finally {
            setLoadingFiles(false);
        }
    };

    const getFileIcon = (filePath: string) => {
        const ext = filePath.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FileText className="text-red-500 dark:text-red-400" size={32} />;
        if (['doc', 'docx'].includes(ext || '')) return <FileText className="text-blue-500 dark:text-blue-400" size={32} />;
        if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="text-green-500 dark:text-green-400" size={32} />;
        if (['zip', 'rar', '7z'].includes(ext || '')) return <Archive className="text-amber-500 dark:text-amber-400" size={32} />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <FileImage className="text-purple-500 dark:text-purple-400" size={32} />;
        return <DefaultFileIcon className="text-slate-400 dark:text-slate-500" size={32} />;
    };

    const handleDownload = (fileId: number) => {
        // Trigger download counter and file stream via window open/download
        window.open(`${import.meta.env.VITE_API_URL}/api/downloads/files/${fileId}/download`, '_blank');

        // Optimistically increment local counter so UI feels instant
        setFiles(prevFiles =>
            prevFiles.map(f =>
                f.id === fileId ? { ...f, download_count: f.download_count + 1 } : f
            )
        );
    };

    const filteredFiles = files.filter(file =>
        file.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-20 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

                {/* Header */}
                <header className="mb-16">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-100/50 dark:bg-primary-900/20 px-4 py-1.5 rounded-full mb-6">
                            <Download size={14} />
                            <span>Download Center</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight uppercase mb-6">
                            เอกสารดาวน์โหลด <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">และแบบฟอร์มต่างๆ</span>
                        </h1>
                    </Reveal>
                </header>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

                    {/* Left: Category Sidebar */}
                    <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none sticky top-28">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-6 pl-2">
                            หมวดหมู่เอกสาร
                        </h3>

                        {loadingCategories ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-3 lg:pb-0 scrollbar-none">
                                {categories.map((cat) => {
                                    const isActive = cat.slug === slug;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setSearchTerm("");
                                                navigate(`/downloads/${cat.slug}`);
                                            }}
                                            className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black whitespace-nowrap lg:whitespace-normal transition-all duration-300 w-full text-left group ${isActive
                                                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20"
                                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary-600 dark:hover:text-primary-400"
                                                }`}
                                        >
                                            <span>{cat.name}</span>
                                            <ArrowRight
                                                size={14}
                                                className={`hidden lg:block transition-transform duration-300 ${isActive ? "translate-x-1" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    );
                                })}

                                {categories.length === 0 && (
                                    <div className="text-center py-6 text-slate-400 font-bold text-xs">
                                        ไม่พบหมวดหมู่เอกสาร
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Files List & Search */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Search bar inside selected category */}
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder={currentCategory ? `ค้นหาไฟล์ในหมวดหมู่ "${currentCategory.name}"...` : "ค้นหาไฟล์เอกสาร..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/30 dark:shadow-none focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-bold text-slate-700 dark:text-white"
                            />
                        </div>

                        {/* Files Loading or Display */}
                        {loadingFiles ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] h-[100px] animate-pulse border border-slate-100 dark:border-slate-800 shadow-sm"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredFiles.map((file, index) => (
                                    <Reveal key={file.id} delay={index * 0.05}>
                                        <div className="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-500/5 dark:hover:shadow-none transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

                                            {/* Left: Icon & Details */}
                                            <div className="flex items-start space-x-4 flex-1">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                                                    {getFileIcon(file.file_path)}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-base font-black text-slate-800 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                        {file.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
                                                        {file.file_size && (
                                                            <span className="bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md text-[10px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                                                                {file.file_size}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center space-x-1.5">
                                                            <Calendar size={12} className="opacity-80" />
                                                            <span>{formatDate(file.created_at)}</span>
                                                        </span>
                                                        <span>
                                                            ดาวน์โหลด: {file.download_count.toLocaleString()} ครั้ง
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Download Button */}
                                            <button
                                                onClick={() => handleDownload(file.id)}
                                                className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-primary-600 dark:bg-slate-800 dark:hover:bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 group-hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-slate-950/10 dark:shadow-none hover:shadow-primary-500/20"
                                            >
                                                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                                <span>ดาวน์โหลด</span>
                                            </button>

                                        </div>
                                    </Reveal>
                                ))}

                                {/* Empty category files state */}
                                {filteredFiles.length === 0 && (
                                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-md">
                                        <div className="text-slate-300 dark:text-slate-700 mb-4">
                                            <Lucide.File className="mx-auto" size={64} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white">
                                            ไม่พบเอกสารดาวน์โหลด
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-1">
                                            {searchTerm ? "ลองเปลี่ยนคำค้นหาใหม่อีกครั้ง" : "หมวดหมู่นี้ยังไม่มีการอัปโหลดไฟล์เอกสาร"}
                                        </p>
                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                </div>

            </div>
        </main>
    );
}
