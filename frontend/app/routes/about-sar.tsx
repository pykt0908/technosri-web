import { useState, useEffect } from "react";
import {
    FileText,
    Calendar,
    Search,
    Download,
    Eye,
    Archive,
    BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal";
import toast from "react-hot-toast";

interface SarReport {
    id: number;
    year: number;
    title: string;
    file_path: string;
    file_size: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export default function AboutSar() {
    const [reports, setReports] = useState<SarReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        document.title = "รายงานการประเมินตนเอง (SAR) | วิทยาลัยเทคโนโลยีศรีราชา";
        const fetchReports = async () => {
            try {
                // Fetch from public route which filters only is_active=true
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sars?public=1`);
                if (!res.ok) throw new Error("Failed to load SAR reports");
                const data: SarReport[] = await res.json();
                setReports(data);
            } catch (err) {
                console.error(err);
                toast.error("ไม่สามารถโหลดข้อมูลรายงาน SAR ได้");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const filteredReports = reports.filter(r =>
        String(r.year).includes(searchTerm) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') {
            return <FileText className="text-red-500 dark:text-red-400 w-10 h-10" />;
        }
        if (['doc', 'docx'].includes(ext || '')) {
            return <FileText className="text-blue-500 dark:text-blue-400 w-10 h-10" />;
        }
        if (['zip', 'rar'].includes(ext || '')) {
            return <Archive className="text-amber-500 dark:text-amber-400 w-10 h-10" />;
        }
        return <FileText className="text-slate-400 dark:text-slate-500 w-10 h-10" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">กำลังโหลดข้อมูลรายงาน SAR...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 overflow-hidden relative transition-colors duration-500">
            {/* Background dynamic light effect */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-[1280px] mx-auto px-6 lg:px-12 space-y-12">

                {/* Header Section */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200/60 dark:border-slate-800/80 pb-8">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 bg-primary-100/50 dark:bg-primary-900/20 px-4 py-1.5 rounded-full mb-6 border border-primary-100 dark:border-primary-900/50">
                            <BookOpen size={12} className="animate-pulse" />
                            <span className="tracking-[0.1em] uppercase">การประกันคุณภาพ</span>
                            <span className="text-slate-400 dark:text-slate-500 mx-1">|</span>
                            <span className="tracking-[0.3em] uppercase">SAR Reports</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                            รายงานการประเมินตนเอง <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">ของสถานศึกษา (SAR)</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-4 max-w-2xl font-medium leading-relaxed">
                            รายงานการประเมินตนเองของสถานศึกษา (Self-Assessment Report: SAR)
                            เป็นรายงานที่วิทยาลัยจัดทำขึ้นตามเกณฑ์มาตรฐานการประกันคุณภาพการศึกษา
                            เพื่อสะท้อนภาพความสำเร็จในการบริหารจัดการศึกษาประจำปีการศึกษาต่าง ๆ
                        </p>
                    </Reveal>
                </header>

                {/* Filter and Reports List */}
                <div className="space-y-6">
                    {/* Search Panel */}
                    <Reveal delay={0.2}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
                            <div className="relative w-full sm:w-80 group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Search size={15} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="ค้นหารายงาน SAR..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-xs font-bold text-slate-700 dark:text-white placeholder:text-slate-400 shadow-sm"
                                />
                            </div>
                            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
                                พบทั้งหมด {filteredReports.length} รายการ
                            </div>
                        </div>
                    </Reveal>

                    {/* Reports List */}
                    <Reveal delay={0.3}>
                        {filteredReports.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-20 text-center shadow-md">
                                <div className="flex flex-col items-center max-w-sm mx-auto opacity-40">
                                    <FileText size={48} className="text-slate-400 mb-4" />
                                    <h3 className="text-sm font-black text-slate-750 dark:text-white uppercase tracking-wider mb-2">ไม่พบผลการค้นหา</h3>
                                    <p className="text-xs text-slate-405 dark:text-slate-450 leading-relaxed font-semibold">ไม่พบข้อมูลรายงาน SAR ของปีการศึกษา หรือ คำค้นหาที่ระบุ</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredReports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="group bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-500/5 dark:hover:shadow-none transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-center space-x-5 min-w-0 flex-1">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-105 transition-transform duration-300 shrink-0 flex items-center justify-center">
                                                {getFileIcon(report.file_path)}
                                            </div>
                                            <div className="space-y-2 min-w-0 flex-1">
                                                <div className="inline-flex items-center space-x-1.5 text-[9px] font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 px-2.5 py-1 rounded-full border border-primary-100/40">
                                                    <Calendar size={10} />
                                                    <span>ปีการศึกษา {report.year}</span>
                                                </div>
                                                <h3 className="text-lg font-black text-slate-850 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                    {report.title}
                                                </h3>
                                                <div className="flex items-center text-[10px] font-bold text-slate-400 space-x-1.5 font-mono">
                                                    <span>ขนาดไฟล์: {report.file_size || 'ไม่ระบุ'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                                            <a
                                                href={`${import.meta.env.VITE_API_URL}/storage/${report.file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 md:flex-initial px-5 py-3.5 bg-slate-50 hover:bg-primary-50 hover:text-primary-600 dark:bg-slate-850 dark:hover:bg-primary-950/20 dark:hover:text-primary-400 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-100 dark:border-slate-800/50 flex items-center justify-center space-x-2"
                                            >
                                                <Eye size={14} />
                                                <span>ดูเอกสาร</span>
                                            </a>
                                            <a
                                                href={`${import.meta.env.VITE_API_URL}/storage/${report.file_path}`}
                                                download
                                                className="flex-1 md:flex-initial px-5 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary-500/10 flex items-center justify-center space-x-2"
                                            >
                                                <Download size={14} />
                                                <span>ดาวน์โหลด</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Reveal>
                </div>

                {/* Elegant Footnote Statement */}
                <div className="text-center pt-8 max-w-md mx-auto">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed tracking-wider uppercase">
                        รายงานสถิติสารสนเทศและการประกันคุณภาพการศึกษาภายในสถานศึกษา
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">
                        วิทยาลัยเทคโนโลยีศรีราชา สงวนลิขสิทธิ์ © {new Date().getFullYear()}
                    </p>
                </div>

            </div>
        </main>
    );
}
