import { useState, useEffect, useRef } from "react";
import { 
    FileText, Plus, Edit2, Trash2, Calendar, 
    X, Save, Loader2, Search, Sparkles, Upload, 
    Download, Check, AlertCircle, FileUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function AdminSar() {
    const [reports, setReports] = useState<SarReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ show: boolean; data?: SarReport }>({ show: false });
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form fields
    const [year, setYear] = useState<number | "">("");
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isActive, setIsActive] = useState(true);
    const [dragActive, setDragActive] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sars`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (!res.ok) throw new Error();
            const data: SarReport[] = await res.json();
            setReports(data);
        } catch (err) {
            toast.error("ไม่สามารถโหลดข้อมูลรายงาน SAR ได้");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const openModal = (report?: SarReport) => {
        if (report) {
            setModal({ show: true, data: report });
            setYear(report.year);
            setTitle(report.title);
            setIsActive(report.is_active);
            setSelectedFile(null);
        } else {
            setModal({ show: true });
            const currentThaiYear = new Date().getFullYear() + 543;
            setYear(currentThaiYear);
            setTitle("");
            setIsActive(true);
            setSelectedFile(null);
        }
    };

    const handleCloseModal = () => {
        setModal({ show: false });
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // File Drag and Drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const validTypes = [
                "application/pdf", 
                "application/msword", 
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/zip",
                "application/x-zip-compressed",
                "application/x-rar-compressed"
            ];
            
            // Check file extension if type is empty (some systems don't resolve zip/rar types properly)
            const ext = file.name.split('.').pop()?.toLowerCase();
            const isValidExt = ['pdf', 'doc', 'docx', 'zip', 'rar'].includes(ext || '');

            if (validTypes.includes(file.type) || isValidExt) {
                if (file.size <= 20 * 1024 * 1024) { // 20MB
                    setSelectedFile(file);
                    // Autofill title if empty
                    if (!title) {
                        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                        setTitle(nameWithoutExt);
                    }
                } else {
                    toast.error("ไฟล์มีขนาดใหญ่เกินกว่า 20MB");
                }
            } else {
                toast.error("รองรับเฉพาะไฟล์รูปแบบ PDF, Word (.doc, .docx), ZIP, RAR เท่านั้น");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size <= 20 * 1024 * 1024) {
                setSelectedFile(file);
                // Autofill title if empty
                if (!title) {
                    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    setTitle(nameWithoutExt);
                }
            } else {
                toast.error("ไฟล์มีขนาดใหญ่เกินกว่า 20MB");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!year || year < 2400 || year > 2700) {
            toast.error("กรุณาระบุปีการศึกษาที่ถูกต้อง (2400 - 2700)");
            return;
        }

        if (!title.trim()) {
            toast.error("กรุณาระบุชื่อรายงาน SAR");
            return;
        }

        if (!modal.data && !selectedFile) {
            toast.error("กรุณาแนบไฟล์รายงาน SAR");
            return;
        }

        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading(modal.data ? "กำลังอัปเดตรายงาน SAR..." : "กำลังบันทึกรายงาน SAR ใหม่...");

        try {
            const formData = new FormData();
            formData.append("year", String(year));
            formData.append("title", title);
            formData.append("is_active", isActive ? "1" : "0");
            
            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            let url = `${import.meta.env.VITE_API_URL}/api/sars`;
            if (modal.data) {
                url = `${import.meta.env.VITE_API_URL}/api/sars/${modal.data.id}`;
                formData.append("_method", "PUT"); // Laravel PUT method emulation
            }

            const res = await fetch(url, {
                method: "POST", // Standard POST with _method emulation
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: formData
            });

            if (res.ok) {
                toast.success(modal.data ? "อัปเดตรายงาน SAR สำเร็จ" : "บันทึกรายงาน SAR ใหม่สำเร็จ", { id: loadingToast });
                handleCloseModal();
                fetchReports();
            } else {
                const errData = await res.json();
                toast.error(errData.message || "การดำเนินการล้มเหลว กรุณาตรวจสอบข้อมูล", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", { id: loadingToast });
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (report: SarReport) => {
        if (!confirm(`ยืนยันการลบรายงาน SAR: "${report.title}"?\nการกระทำนี้จะไม่สามารถกู้คืนข้อมูลได้`)) return;
        
        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading("กำลังลบรายงาน SAR...");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sars/${report.id}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (res.ok) {
                toast.success("ลบรายงาน SAR สำเร็จ", { id: loadingToast });
                fetchReports();
            } else {
                toast.error("ไม่สามารถลบรายงาน SAR ได้", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", { id: loadingToast });
            console.error(err);
        }
    };

    const filteredReports = reports.filter(r => 
        String(r.year).includes(searchTerm) || 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <span className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 p-2 rounded-xl text-xs font-bold font-mono">PDF</span>;
        if (['doc', 'docx'].includes(ext || '')) return <span className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 p-2 rounded-xl text-xs font-bold font-mono">DOC</span>;
        if (['zip', 'rar'].includes(ext || '')) return <span className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 p-2 rounded-xl text-xs font-bold font-mono">ZIP</span>;
        return <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 p-2 rounded-xl text-xs font-bold font-mono">FILE</span>;
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 gap-6">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <FileText size={10} className="mr-2 animate-pulse" /> ระบบรายงานประเมินตนเอง (SAR)
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">รายงานการประเมินตนเองของสถานศึกษา</h1>
                    <p className="text-sm text-slate-500 mt-1">บริหารจัดการไฟล์รายงานการประเมินตนเอง (Self-Assessment Report: SAR) ประจำปีการศึกษาต่าง ๆ</p>
                </div>
                
                <button 
                    onClick={() => openModal()}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-primary-600/20 flex items-center group cursor-pointer"
                >
                    <Plus className="mr-2 group-hover:rotate-90 transition-transform" size={16} /> เพิ่มรายงาน SAR
                </button>
            </header>

            {/* Main Stats / Quick View Banner */}
            {reports.length > 0 && (
                <div className="mb-10 p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-3xl shadow-xl shadow-emerald-500/10 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 text-white/[0.03] pointer-events-none">
                        <Sparkles size={300} />
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">ข้อมูลล่าสุดในระบบ</span>
                            <h2 className="text-2xl font-black tracking-tight leading-tight mt-1">
                                {reports[0].title}
                            </h2>
                            <p className="text-xs text-white/75 font-semibold mt-1">
                                ปีการศึกษา {reports[0].year} • ขนาดไฟล์ {reports[0].file_size || 'ไม่ระบุ'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <a 
                                href={`${import.meta.env.VITE_API_URL}/storage/${reports[0].file_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                            >
                                <Download size={14} />
                                <span>ดาวน์โหลดไฟล์ล่าสุด</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* List and Actions Table Panel */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full sm:w-[350px] group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="ค้นหาตามปีการศึกษา หรือ ชื่อรายงาน..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-850 transition-all outline-none text-sm font-semibold text-slate-700 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                    <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-800 shrink-0">
                        พบรายงานทั้งหมด {filteredReports.length} รายการ
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center w-24">ปีการศึกษา</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em]">ชื่อรายงาน SAR</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center w-36">ชนิดและขนาดไฟล์</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center w-32">การแสดงผล</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center w-40">อัปเดตเมื่อ</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center w-28">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Loader2 size={32} className="animate-spin text-primary-500 mb-4" />
                                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">กำลังดาวน์โหลดข้อมูลรายงาน SAR...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <FileText size={48} className="text-slate-400 mb-4" />
                                            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">ไม่พบรายงาน SAR ในระบบ</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200">
                                        <td className="px-6 py-5 text-center font-black text-slate-900 dark:text-white text-base">
                                            {r.year}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="text-emerald-500" size={18} />
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-100">{r.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-xs md:max-w-md truncate">
                                                        {r.file_path.replace('sars/', '')}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center space-y-1">
                                                {getFileIcon(r.file_path)}
                                                <span className="text-[10px] text-slate-400 font-bold">{r.file_size || 'ไม่ทราบขนาด'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                r.is_active 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/35' 
                                                    : 'bg-slate-100 text-slate-650 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                            }`}>
                                                {r.is_active ? 'แสดงผล' : 'ซ่อน'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center text-slate-500 dark:text-slate-400 text-xs font-bold">
                                            {r.updated_at ? new Date(r.updated_at).toLocaleDateString("th-TH", {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : "-"}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center space-x-2">
                                                <a
                                                    href={`${import.meta.env.VITE_API_URL}/storage/${r.file_path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-9 h-9 flex items-center justify-center text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="ดาวน์โหลด/ดูไฟล์"
                                                >
                                                    <Download size={14} />
                                                </a>
                                                <button
                                                    onClick={() => openModal(r)}
                                                    className="w-9 h-9 flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm cursor-pointer"
                                                    title="แก้ไขรายละเอียด"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(r)}
                                                    className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm cursor-pointer"
                                                    title="ลบรายงาน"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                        >
                            <form onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center text-xl mr-5 shrink-0">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">
                                                {modal.data ? "แก้ไขรายงาน SAR" : "เพิ่มรายงาน SAR ใหม่"}
                                            </h2>
                                            <p className="text-xs text-slate-400 font-bold mt-1 tracking-wider uppercase">
                                                กรอกรายละเอียดและแนบไฟล์รายงานการประเมินตนเอง
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleCloseModal} 
                                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                {/* Form Body */}
                                <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto">
                                    {/* Year and Status Toggle */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">ปีการศึกษา (พ.ศ.) *</label>
                                            <input 
                                                type="number" 
                                                value={year}
                                                onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
                                                required
                                                min={2400}
                                                max={2700}
                                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none placeholder-slate-400 transition-all text-sm"
                                                placeholder="เช่น 2568"
                                            />
                                        </div>
                                        
                                        <div className="flex flex-col justify-end">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3 pl-1">สถานะการแสดงผล</label>
                                            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl">
                                                <input 
                                                    type="checkbox"
                                                    id="isActive"
                                                    checked={isActive}
                                                    onChange={(e) => setIsActive(e.target.checked)}
                                                    className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500 bg-white dark:bg-slate-700 outline-none cursor-pointer"
                                                />
                                                <label htmlFor="isActive" className="text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                                                    แสดงผลบนหน้าเว็บไซต์สาธารณะ
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Report Title */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">ชื่อรายงาน SAR *</label>
                                        <input 
                                            type="text" 
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none placeholder-slate-400 transition-all text-sm"
                                            placeholder="เช่น รายงานการประเมินตนเอง ปีการศึกษา 2568"
                                        />
                                    </div>

                                    {/* File Attachment Dropzone */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">
                                            {modal.data ? "อัปโหลดไฟล์ใหม่เพื่อเปลี่ยนแทน (ไม่บังคับ)" : "แนบไฟล์รายงาน (PDF, Word, ZIP, RAR) *"}
                                        </label>
                                        
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragOver={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-[2rem] p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                                                dragActive 
                                                    ? "border-primary-500 bg-primary-50/30 dark:bg-primary-950/20" 
                                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750 bg-slate-50/50 dark:bg-slate-800/50"
                                            }`}
                                        >
                                            <input 
                                                ref={fileInputRef}
                                                type="file" 
                                                accept=".pdf,.doc,.docx,.zip,.rar"
                                                onChange={handleFileChange}
                                                className="hidden" 
                                            />
                                            
                                            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950 text-primary-500 rounded-full flex items-center justify-center mb-3">
                                                <FileUp size={20} />
                                            </div>

                                            {selectedFile ? (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-slate-800 dark:text-white max-w-sm truncate px-4">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold">
                                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-350">
                                                        ลากไฟล์มาวางที่นี่ หรือคลิกเพื่ออัปโหลด
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                                                        รองรับ PDF, DOC, DOCX, ZIP, RAR (สูงสุด 20MB)
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {modal.data && !selectedFile && (
                                            <div className="mt-2.5 flex items-center space-x-2 text-[10px] text-slate-405 dark:text-slate-450 pl-2">
                                                <AlertCircle size={12} />
                                                <span>ไฟล์ปัจจุบันในระบบ: <strong className="font-semibold text-slate-500 font-mono truncate max-w-xs block sm:inline">{modal.data.file_path.replace('sars/', '')}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Footer Actions */}
                                <div className="p-10 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end items-center space-x-4 border-t border-slate-100 dark:border-slate-800">
                                    <button 
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors cursor-pointer"
                                    >
                                        ยกเลิก
                                    </button>
                                    
                                    <button 
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-8 py-4 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center min-w-[140px] cursor-pointer"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                                        <span>{modal.data ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
