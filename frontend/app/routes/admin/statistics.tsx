import { useState, useEffect } from "react";
import { 
    Activity, Plus, Edit2, Trash2, Calendar, 
    GraduationCap, Presentation, UserCheck, Users, 
    Briefcase, Award, X, Save, Loader2, AlertCircle, Search, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface StatisticRecord {
    id: number;
    year: number;
    students_pvc: number;
    students_pvs: number;
    classrooms: number;
    executives: number;
    teachers: number;
    academic_staff: number;
    other_staff: number;
    as_of_date: string;
    created_at?: string;
    updated_at?: string;
}

export default function AdminStatistics() {
    const [records, setRecords] = useState<StatisticRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ show: boolean; data?: StatisticRecord }>({ show: false });
    const [isSaving, setIsSaving] = useState(false);
    const [filterYear, setFilterYear] = useState("");

    // Form fields
    const [year, setYear] = useState<number | "">("");
    const [studentsPvc, setStudentsPvc] = useState<number | "">("");
    const [studentsPvs, setStudentsPvs] = useState<number | "">("");
    const [classrooms, setClassrooms] = useState<number | "">("");
    const [executives, setExecutives] = useState<number | "">("");
    const [teachers, setTeachers] = useState<number | "">("");
    const [academicStaff, setAcademicStaff] = useState<number | "">("");
    const [otherStaff, setOtherStaff] = useState<number | "">("");
    const [asOfDate, setAsOfDate] = useState("");

    const fetchRecords = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/school-statistics`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (!res.ok) throw new Error();
            const data: StatisticRecord[] = await res.json();
            setRecords(data);
        } catch (err) {
            toast.error("ไม่สามารถโหลดข้อมูลสถิติได้");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const openModal = (record?: StatisticRecord) => {
        if (record) {
            setModal({ show: true, data: record });
            setYear(record.year);
            setStudentsPvc(record.students_pvc);
            setStudentsPvs(record.students_pvs);
            setClassrooms(record.classrooms);
            setExecutives(record.executives);
            setTeachers(record.teachers);
            setAcademicStaff(record.academic_staff);
            setOtherStaff(record.other_staff);
            setAsOfDate(record.as_of_date);
        } else {
            setModal({ show: true });
            const currentThaiYear = new Date().getFullYear() + 543;
            const existingYears = records.map(r => r.year);
            const defaultYear = existingYears.includes(currentThaiYear) ? "" : currentThaiYear;
            
            setYear(defaultYear);
            setStudentsPvc("");
            setStudentsPvs("");
            setClassrooms("");
            setExecutives("");
            setTeachers("");
            setAcademicStaff("");
            setOtherStaff("");
            setAsOfDate(new Date().toISOString().split("T")[0]);
        }
    };

    const handleCloseModal = () => {
        setModal({ show: false });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!year || year < 2400 || year > 2700) {
            toast.error("กรุณาระบุปีการศึกษาที่ถูกต้อง (2400 - 2700)");
            return;
        }

        const statsData = {
            year: Number(year),
            students_pvc: Number(studentsPvc || 0),
            students_pvs: Number(studentsPvs || 0),
            classrooms: Number(classrooms || 0),
            executives: Number(executives || 0),
            teachers: Number(teachers || 0),
            academic_staff: Number(academicStaff || 0),
            other_staff: Number(otherStaff || 0),
            as_of_date: asOfDate
        };

        // Unique year checks
        if (!modal.data) {
            const yearExists = records.some(r => r.year === statsData.year);
            if (yearExists) {
                toast.error(`มีข้อมูลปีการศึกษา ${statsData.year} อยู่ในระบบแล้ว`);
                return;
            }
        } else {
            const yearExists = records.some(r => r.year === statsData.year && r.id !== modal.data?.id);
            if (yearExists) {
                toast.error(`มีข้อมูลปีการศึกษา ${statsData.year} อยู่ในระบบแล้ว`);
                return;
            }
        }

        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading(modal.data ? "กำลังอัปเดตข้อมูลสถิติ..." : "กำลังบันทึกข้อมูลสถิติใหม่...");

        try {
            const method = modal.data ? "PUT" : "POST";
            const url = modal.data 
                ? `${import.meta.env.VITE_API_URL}/api/school-statistics/${modal.data.id}`
                : `${import.meta.env.VITE_API_URL}/api/school-statistics`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(statsData)
            });

            if (res.ok) {
                toast.success(modal.data ? "อัปเดตข้อมูลสถิติสำเร็จ" : "บันทึกข้อมูลสถิติใหม่สำเร็จ", { id: loadingToast });
                handleCloseModal();
                fetchRecords();
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

    const handleDelete = async (record: StatisticRecord) => {
        if (!confirm(`ยืนยันการลบข้อมูลสถิติปีการศึกษา ${record.year}?\nการกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
        
        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading("กำลังลบข้อมูลสถิติ...");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/school-statistics/${record.id}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (res.ok) {
                toast.success("ลบข้อมูลสถิติสำเร็จ", { id: loadingToast });
                fetchRecords();
            } else {
                toast.error("ไม่สามารถลบข้อมูลสถิติได้", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", { id: loadingToast });
            console.error(err);
        }
    };

    const filteredRecords = records.filter(r => 
        String(r.year).includes(filterYear)
    );

    const formatThaiDate = (dateString: string) => {
        if (!dateString) return "";
        const parts = dateString.split("-");
        if (parts.length !== 3) return dateString;
        
        const date = new Date(dateString);
        const thaiMonths = [
            "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", 
            "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
        ];
        
        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const yearFull = date.getFullYear() + 543;
        const yearShort = String(yearFull).slice(-2);
        
        return `${day} ${month} ${yearShort}`;
    };

    const latestRecord = records[0] || null;

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 gap-6">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <Activity size={10} className="mr-2 animate-pulse" /> Statistics Management
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการสถิตินักเรียนและบุคลากร</h1>
                    <p className="text-sm text-slate-500 mt-1">บันทึกและจัดการจำนวนนักเรียนนักศึกษา ห้องเรียน และบุคลากรแยกตามปีการศึกษา</p>
                </div>
                
                <button 
                    onClick={() => openModal()}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-primary-600/20 flex items-center group"
                >
                    <Plus className="mr-2 group-hover:rotate-90 transition-transform" size={16} /> เพิ่มข้อมูลปีการศึกษา
                </button>
            </header>

            {/* Quick Preview Grid (Latest Year Data) */}
            {latestRecord && (
                <div className="mb-10 p-6 bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-3xl shadow-xl shadow-primary-500/10 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 text-white/[0.03] pointer-events-none">
                        <Sparkles size={300} />
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">สถิติล่าสุดในระบบ</span>
                            <h2 className="text-2xl font-black tracking-tight leading-tight mt-1">
                                ประจำปีการศึกษา {latestRecord.year}
                            </h2>
                            <p className="text-xs text-white/75 font-semibold mt-1">
                                ข้อมูล ณ วันที่ {formatThaiDate(latestRecord.as_of_date)}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold backdrop-blur-md">
                            <Calendar size={14} />
                            <span>แก้ไขล่าสุด: {latestRecord.updated_at ? new Date(latestRecord.updated_at).toLocaleDateString("th-TH") : "-"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl transition-all border border-white/5 flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">ปวช.</span>
                            <span className="text-2xl font-black tracking-tight mt-1">{latestRecord.students_pvc.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl transition-all border border-white/5 flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">ปวส.</span>
                            <span className="text-2xl font-black tracking-tight mt-1">{latestRecord.students_pvs.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl transition-all border border-white/5 flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">ห้องเรียน</span>
                            <span className="text-2xl font-black tracking-tight mt-1">{latestRecord.classrooms.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl transition-all border border-white/5 flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">ผู้บริหาร</span>
                            <span className="text-2xl font-black tracking-tight mt-1">{latestRecord.executives.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl transition-all border border-white/5 flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">ครู</span>
                            <span className="text-2xl font-black tracking-tight mt-1">{latestRecord.teachers.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl transition-all border border-white/5 flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">บุคลากรทางการศึกษา</span>
                            <span className="text-2xl font-black tracking-tight mt-1">{latestRecord.academic_staff.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl transition-all border border-white/5 flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">บุคลากรอื่นๆ</span>
                            <span className="text-2xl font-black tracking-tight mt-1">{latestRecord.other_staff.toLocaleString()}</span>
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
                            placeholder="ค้นหาตามปีการศึกษา (เช่น 2569)..."
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="w-full pl-14 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-semibold text-slate-700 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                    <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-800 shrink-0">
                        พบสถิติทั้งหมด {filteredRecords.length} ปีการศึกษา
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">ปีการศึกษา</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">ปวช.</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">ปวส.</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">ห้องเรียน</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">ผู้บริหาร</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">ครู</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">บุคลากรทาง กศ.</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">บุคลากรอื่นๆ</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center font-bold">ข้อมูล ณ วันที่</th>
                                <th className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="p-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Loader2 size={32} className="animate-spin text-primary-500 mb-4" />
                                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">กำลังดาวน์โหลดข้อมูลสถิติ...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="p-20 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <Activity size={48} className="text-slate-400 mb-4" />
                                            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">ไม่พบสถิติของปีการศึกษาที่ต้องการ</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200">
                                        <td className="px-6 py-5 text-center font-black text-slate-900 dark:text-white">
                                            {r.year}
                                        </td>
                                        <td className="px-6 py-5 text-center font-bold text-slate-700 dark:text-slate-300">
                                            {r.students_pvc.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-center font-bold text-slate-700 dark:text-slate-300">
                                            {r.students_pvs.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-center font-bold text-slate-700 dark:text-slate-300">
                                            {r.classrooms.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-center text-slate-600 dark:text-slate-400 font-medium">
                                            {r.executives.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-center text-slate-600 dark:text-slate-400 font-medium">
                                            {r.teachers.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-center text-slate-600 dark:text-slate-400 font-medium">
                                            {r.academic_staff.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-center text-slate-600 dark:text-slate-400 font-medium">
                                            {r.other_staff.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-center text-slate-500 font-bold whitespace-nowrap text-xs">
                                            {formatThaiDate(r.as_of_date)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => openModal(r)}
                                                    className="w-9 h-9 flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="แก้ไขสถิติ"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(r)}
                                                    className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="ลบสถิติ"
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

            {/* statistics modal */}
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
                                            <Activity size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">
                                                {modal.data ? "แก้ไขข้อมูลสถิติ" : "เพิ่มข้อมูลสถิติใหม่"}
                                            </h2>
                                            <p className="text-xs text-slate-400 font-bold mt-1 tracking-wider uppercase">
                                                ข้อมูลสถิตินักเรียน นักศึกษา และบุคลากรวิทยาลัย
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleCloseModal} 
                                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                {/* Form Body */}
                                <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
                                    {/* Row 1: Academic Year and As of Date */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">ปีการศึกษา (พ.ศ.)</label>
                                            <input 
                                                type="number" 
                                                value={year}
                                                onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
                                                required
                                                min={2400}
                                                max={2700}
                                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none placeholder-slate-400 transition-all"
                                                placeholder="เช่น 2569"
                                            />
                                        </div>
                                        
                                        <div className="relative group">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">ข้อมูล ณ วันที่ (As of Date)</label>
                                            <div className="relative">
                                                <input 
                                                    type="date" 
                                                    value={asOfDate}
                                                    onChange={(e) => setAsOfDate(e.target.value)}
                                                    required
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-semibold outline-none transition-all cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Division: Students */}
                                    <div>
                                        <div className="flex items-center space-x-2 text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                                            <GraduationCap size={14} />
                                            <span>ส่วนที่ 1: สถิตินักเรียนและห้องเรียน (Students & Classrooms)</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">นักเรียน ปวช. (คน)</label>
                                                <input 
                                                    type="number"
                                                    value={studentsPvc}
                                                    onChange={(e) => setStudentsPvc(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                                                    required
                                                    min={0}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">นักเรียน ปวส. (คน)</label>
                                                <input 
                                                    type="number"
                                                    value={studentsPvs}
                                                    onChange={(e) => setStudentsPvs(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                                                    required
                                                    min={0}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">จำนวนห้องเรียน (ห้อง)</label>
                                                <input 
                                                    type="number"
                                                    value={classrooms}
                                                    onChange={(e) => setClassrooms(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                                                    required
                                                    min={0}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Division: Staff */}
                                    <div>
                                        <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                                            <Users size={14} />
                                            <span>ส่วนที่ 2: สถิติผู้บริหาร ครู และบุคลากร (Staff & Personnel)</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">ผู้บริหาร (คน)</label>
                                                <input 
                                                    type="number"
                                                    value={executives}
                                                    onChange={(e) => setExecutives(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                                                    required
                                                    min={0}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">ครู (คน)</label>
                                                <input 
                                                    type="number"
                                                    value={teachers}
                                                    onChange={(e) => setTeachers(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                                                    required
                                                    min={0}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">บุคลากรทาง กศ. (คน)</label>
                                                <input 
                                                    type="number"
                                                    value={academicStaff}
                                                    onChange={(e) => setAcademicStaff(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                                                    required
                                                    min={0}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 pl-1">บุคลากรอื่นๆ (คน)</label>
                                                <input 
                                                    type="number"
                                                    value={otherStaff}
                                                    onChange={(e) => setOtherStaff(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                                                    required
                                                    min={0}
                                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white font-bold outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Footer Actions */}
                                <div className="p-10 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end items-center space-x-4 border-t border-slate-100 dark:border-slate-800">
                                    <button 
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        ยกเลิก
                                    </button>
                                    
                                    <button 
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-8 py-4 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center min-w-[140px]"
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
