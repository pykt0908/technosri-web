import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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
const ChevronLeft = Lucide.ChevronLeft || Lucide.ChevronLeft;
const ChevronRight = Lucide.ChevronRight || Lucide.ChevronRight;

interface DownloadFileItem {
    id: number;
    download_document_id: number;
    title: string;
    file_path: string;
    file_size: string | null;
    download_count: number;
    created_at: string;
}

interface DownloadDocumentItem {
    id: number;
    download_category_id: number;
    title: string;
    sort_order: number;
    files: DownloadFileItem[];
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
    const [documents, setDocuments] = useState<DownloadDocumentItem[]>([]);
    
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

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

    // Fetch documents when active category slug changes
    useEffect(() => {
        if (!slug || categories.length === 0) return;

        const cat = categories.find(c => c.slug === slug);
        if (cat) {
            setCurrentCategory(cat);
            fetchCategoryFiles(cat.slug);
            setCurrentPage(1); // Reset page on category switch
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
            setDocuments(data.documents || []);
        } catch (err) {
            console.error("Failed to fetch documents for category", err);
        } finally {
            setLoadingFiles(false);
        }
    };

    const getFileIcon = (filePath: string) => {
        const ext = filePath.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FileText className="text-red-500 dark:text-red-400" size={18} />;
        if (['doc', 'docx'].includes(ext || '')) return <FileText className="text-blue-500 dark:text-blue-400" size={18} />;
        if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="text-green-500 dark:text-green-400" size={18} />;
        if (['zip', 'rar', '7z'].includes(ext || '')) return <Archive className="text-amber-500 dark:text-amber-400" size={18} />;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <FileImage className="text-purple-500 dark:text-purple-400" size={18} />;
        return <DefaultFileIcon className="text-slate-400 dark:text-slate-500" size={18} />;
    };

    const handleDownload = (fileId: number) => {
        // Trigger download counter and file stream via window open/download
        window.open(`${import.meta.env.VITE_API_URL}/api/downloads/files/${fileId}/download`, '_blank');
        
        // Optimistically increment local counter so UI feels instant
        setDocuments(prevDocs => 
            prevDocs.map(doc => ({
                ...doc,
                files: doc.files.map(f => 
                    f.id === fileId ? { ...f, download_count: f.download_count + 1 } : f
                )
            }))
        );
    };

    const filteredDocuments = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <p className="text-slate-500 dark:text-slate-400 max-w-3xl text-lg leading-relaxed">
                            รวบรวมเอกสาร แบบฟอร์มต่างๆ และสื่อการเรียนการสอนสำหรับการดาวน์โหลดใช้งานอย่างเป็นทางการ
                        </p>
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

                    {/* Right: Documents List & Search */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* Search bar inside selected category */}
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input 
                                type="text" 
                                placeholder={currentCategory ? `ค้นหาเอกสารในหมวดหมู่ "${currentCategory.name}"...` : "ค้นหาเอกสารดาวน์โหลด..."} 
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset page on typing search query
                                }}
                                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/30 dark:shadow-none focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-bold text-slate-700 dark:text-white"
                            />
                        </div>

                        {/* Documents Loading or Display */}
                        {loadingFiles ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] h-[120px] animate-pulse border border-slate-100 dark:border-slate-800 shadow-sm"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {paginatedDocuments.map((doc, index) => (
                                    <Reveal key={doc.id} delay={index * 0.05}>
                                        <div className="group bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-500/5 dark:hover:shadow-none transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            
                                            {/* Left: Icon & Document Title */}
                                            <div className="flex items-center space-x-4 min-w-0 flex-1">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                                                    <Lucide.FileText className="text-primary-600 dark:text-primary-400" size={32} />
                                                </div>
                                                <div className="space-y-1.5 min-w-0 flex-1">
                                                    <h3 className="text-lg font-black text-slate-850 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                        {doc.title}
                                                    </h3>
                                                    <div className="flex items-center text-xs font-bold text-slate-400 space-x-1.5">
                                                        <Calendar size={12} className="opacity-80" />
                                                        <span>{formatDate(doc.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: File download buttons side-by-side */}
                                            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
                                                {doc.files.map(file => {
                                                    const ext = file.file_path.split('.').pop()?.toLowerCase();
                                                    return (
                                                        <button
                                                            key={file.id}
                                                            onClick={() => handleDownload(file.id)}
                                                            className={`flex-1 md:flex-initial px-5 py-3.5 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 text-white shadow-xl active:scale-95 hover:scale-[1.02] cursor-pointer shrink-0 ${
                                                                ext === 'pdf'
                                                                    ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-500/25"
                                                                    : ['doc', 'docx'].includes(ext || '')
                                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25"
                                                                    : ['xls', 'xlsx'].includes(ext || '')
                                                                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25"
                                                                    : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 shadow-lg shadow-slate-500/20"
                                                            }`}
                                                            title={`${file.title} • ดาวน์โหลด ${file.download_count} ครั้ง`}
                                                        >
                                                            <Download size={12} />
                                                            <span>{ext?.toUpperCase() || 'ดาวน์โหลด'} {file.file_size ? `(${file.file_size})` : ''}</span>
                                                        </button>
                                                    );
                                                })}

                                                {doc.files.length === 0 && (
                                                    <span className="text-xs font-bold text-slate-400 italic py-2">ยังไม่มีไฟล์รูปแบบให้ดาวน์โหลด</span>
                                                )}
                                            </div>

                                        </div>
                                    </Reveal>
                                ))}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center space-x-2 pt-8">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        {Array.from({ length: totalPages }, (_, idx) => {
                                            const pageNum = idx + 1;
                                            const isActive = pageNum === currentPage;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`w-11 h-11 rounded-2xl text-xs font-black transition-all duration-300 shadow-sm cursor-pointer ${
                                                        isActive
                                                            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-500/20 scale-105"
                                                            : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:scale-[1.02]"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Empty category files state */}
                                {filteredDocuments.length === 0 && (
                                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-md">
                                        <div className="text-slate-300 dark:text-slate-700 mb-4">
                                            <Lucide.File className="mx-auto" size={64} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-850 dark:text-white">
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
