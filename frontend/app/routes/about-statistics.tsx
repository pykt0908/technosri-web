import { useState, useEffect } from "react";
import { 
    GraduationCap, 
    Presentation, 
    UserCheck, 
    Users, 
    Briefcase,
    Calendar,
    ChevronDown,
    Activity,
    Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../components/Reveal";
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
}

export default function AboutStatistics() {
    const [records, setRecords] = useState<StatisticRecord[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | "">("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/school-statistics`);
                if (!res.ok) throw new Error("Failed to load statistics");
                const data: StatisticRecord[] = await res.json();
                setRecords(data);
                if (data.length > 0) {
                    setSelectedYear(data[0].year); // Default to the most recent year
                }
            } catch (err) {
                console.error(err);
                toast.error("ไม่สามารถโหลดข้อมูลสถิติได้");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const activeRecord = records.find(r => r.year === selectedYear) || null;

    // Helper function to format dates to premium Thai format
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
        // Extract 2 digit Buddhist Era year from the record year or dynamic calculation
        const BEYearFull = activeRecord ? activeRecord.year : date.getFullYear() + 543;
        const BEYearShort = String(BEYearFull).slice(-2);
        
        return `${day} ${month} ${BEYearShort}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 overflow-hidden relative">
            {/* Background dynamic light effect */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-50 dark:bg-primary-950/40 px-4 py-1.5 rounded-full mb-6 border border-primary-100 dark:border-primary-900/50">
                            <Activity size={12} className="animate-pulse" />
                            <span>สถิติวิทยาลัย / School Stats</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight uppercase">
                            ข้อมูลสถิตินักเรียน <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">และบุคลากรวิทยาลัย</span>
                        </h1>
                    </Reveal>

                    {/* Year Select Dropdown */}
                    {records.length > 0 && (
                        <Reveal delay={0.2}>
                            <div className="relative w-full md:w-56 shrink-0 z-10">
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 pl-1">เลือกปีการศึกษา</label>
                                <div className="relative">
                                    <select
                                        value={selectedYear || ""}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-black text-slate-700 dark:text-white appearance-none outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer shadow-lg shadow-slate-200/50 dark:shadow-none pr-12"
                                    >
                                        {records.map((r) => (
                                            <option key={r.id} value={r.year}>
                                                ปีการศึกษา {r.year}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    )}
                </header>

                <AnimatePresence mode="wait">
                    {activeRecord ? (
                        <motion.div
                            key={activeRecord.year}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="space-y-8"
                        >
                            {/* Summary Banner */}
                            <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary-500/10 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight text-center sm:text-left">
                                        สรุปจำนวนนักเรียนนักศึกษา ห้องเรียน บุคลากร <br className="hidden sm:block" />
                                        <span className="text-white/80 text-xs sm:text-sm font-bold uppercase tracking-wider">ประจำปีการศึกษา {activeRecord.year}</span>
                                    </h2>
                                </div>
                                <div className="px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-2xl text-xs sm:text-sm font-black border border-white/10 shrink-0">
                                    ข้อมูล ณ วันที่ {formatThaiDate(activeRecord.as_of_date)}
                                </div>
                            </div>

                            {/* Stat Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Students PVC Card */}
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:shadow-orange-500/5 dark:hover:shadow-none transition-all duration-500 flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <GraduationCap size={32} />
                                    </div>
                                    <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tight">
                                        {activeRecord.students_pvc.toLocaleString()}
                                    </span>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-snug">
                                        จำนวนนักเรียนนักศึกษา ปวช.
                                    </p>
                                </div>

                                {/* Students PVS Card */}
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-none transition-all duration-500 flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <GraduationCap size={32} />
                                    </div>
                                    <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tight">
                                        {activeRecord.students_pvs.toLocaleString()}
                                    </span>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-snug">
                                        จำนวนนักเรียนนักศึกษา ปวส.
                                    </p>
                                </div>

                                {/* Classrooms Card */}
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:shadow-emerald-500/5 dark:hover:shadow-none transition-all duration-500 flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <Presentation size={32} />
                                    </div>
                                    <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tight">
                                        {activeRecord.classrooms.toLocaleString()}
                                    </span>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-snug">
                                        จำนวนห้องเรียน
                                    </p>
                                </div>
                            </div>

                            {/* Personnel Stat Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Executives Card */}
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:shadow-rose-500/5 dark:hover:shadow-none transition-all duration-500 flex flex-col items-center text-center group">
                                    <div className="w-14 h-14 bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                                        <UserCheck size={26} />
                                    </div>
                                    <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tight">
                                        {activeRecord.executives.toLocaleString()}
                                    </span>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-snug">
                                        จำนวนผู้บริหาร
                                    </p>
                                </div>

                                {/* Teachers Card */}
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:shadow-purple-500/5 dark:hover:shadow-none transition-all duration-500 flex flex-col items-center text-center group">
                                    <div className="w-14 h-14 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                                        <Users size={26} />
                                    </div>
                                    <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tight">
                                        {activeRecord.teachers.toLocaleString()}
                                    </span>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-snug">
                                        จำนวนครู
                                    </p>
                                </div>

                                {/* Educational Personnel Card */}
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:shadow-sky-500/5 dark:hover:shadow-none transition-all duration-500 flex flex-col items-center text-center group">
                                    <div className="w-14 h-14 bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                                        <Award size={26} />
                                    </div>
                                    <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tight">
                                        {activeRecord.academic_staff.toLocaleString()}
                                    </span>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-snug">
                                        จำนวนบุคลากรทางการศึกษา
                                    </p>
                                </div>

                                {/* Other Staff Card */}
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:shadow-slate-500/5 dark:hover:shadow-none transition-all duration-500 flex flex-col items-center text-center group">
                                    <div className="w-14 h-14 bg-slate-500/10 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                                        <Briefcase size={26} />
                                    </div>
                                    <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tight">
                                        {activeRecord.other_staff.toLocaleString()}
                                    </span>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-snug">
                                        จำนวนบุคลากรอื่นๆ
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-md">
                            <h3 className="text-lg font-black text-slate-850 dark:text-white">
                                ไม่พบข้อมูลสถิติของปีที่เลือก
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">
                                กรุณาเลือกปีการศึกษาอื่นๆ
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
