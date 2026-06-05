import { useState, useEffect } from "react";
import { 
    GraduationCap, 
    Users, 
    Calendar,
    ChevronDown,
    ShieldCheck,
    TrendingUp,
    Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../components/Reveal";
import toast from "react-hot-toast";
import Chart from "react-apexcharts";

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
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        document.title = "ข้อมูลสถิตินักเรียนและบุคลากร | วิทยาลัยเทคโนโลยีศรีราชา";
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
        const BEYearFull = activeRecord ? activeRecord.year : date.getFullYear() + 543;
        const BEYearShort = String(BEYearFull).slice(-2);
        
        return `${day} ${month} ${BEYearShort}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">กำลังจัดเตรียมรายงานสถิติ...</p>
                </div>
            </div>
        );
    }

    // Sort records chronologically (by year ascending) for trend line
    const chronologicalRecords = [...records].sort((a, b) => a.year - b.year);
    const trendYears = chronologicalRecords.map(r => `${r.year}`);
    const pvcSeries = chronologicalRecords.map(r => r.students_pvc);
    const pvsSeries = chronologicalRecords.map(r => r.students_pvs);
    const totalSeries = chronologicalRecords.map(r => r.students_pvc + r.students_pvs);

    // High-contrast, minimalist formal trend chart options
    const trendChartOptions: any = {
        chart: {
            id: "enrollment-trend",
            toolbar: { show: false },
            fontFamily: 'LINE Seed Sans TH, sans-serif',
            background: 'transparent',
            sparkline: { enabled: false }
        },
        colors: ['#1ea2ff', '#6366f1', '#0f172a'], // Brand Blue, Indigo, Royal Navy
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 5, strokeWidth: 1 },
        xaxis: {
            categories: trendYears,
            axisBorder: { show: true, color: '#e2e8f0' },
            axisTicks: { show: true, color: '#e2e8f0' },
            labels: { style: { colors: '#64748b', fontWeight: 600, fontSize: '10px' } }
        },
        yaxis: {
            labels: { style: { colors: '#64748b', fontWeight: 600, fontSize: '10px' } }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 3,
        },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light' },
        legend: { position: 'top', horizontalAlign: 'right', fontWeight: 700, fontSize: '12px' }
    };

    const trendChartSeries = [
        { name: 'จำนวนนักศึกษา ปวช.', data: pvcSeries },
        { name: 'จำนวนนักศึกษา ปวส.', data: pvsSeries },
        { name: 'ยอดรวมนักศึกษาทั้งหมด', data: totalSeries }
    ];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 overflow-hidden relative transition-colors duration-500">
            {/* Background dynamic light effect (matching other routes) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-[1280px] mx-auto px-6 lg:px-12 space-y-12">
                
                {/* Header Section (Left-aligned matching about.tsx and college-emblem.tsx) */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 bg-primary-100/50 dark:bg-primary-900/20 px-4 py-1.5 rounded-full mb-6 border border-primary-100 dark:border-primary-900/50">
                            <Activity size={12} className="animate-pulse" />
                            <span className="tracking-[0.1em] uppercase">สถิติวิทยาลัย</span>
                            <span className="text-slate-400 dark:text-slate-500 mx-1">|</span>
                            <span className="tracking-[0.3em] uppercase">School Stats</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                            ข้อมูลสถิตินักเรียน <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">และบุคลากรวิทยาลัย</span>
                        </h1>
                    </Reveal>

                    {/* Interactive Dropdown matching pages theme */}
                    {records.length > 0 && (
                        <Reveal delay={0.2}>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 shrink-0 z-10">
                                {/* Year Select */}
                                <div className="relative w-full sm:w-48">
                                    <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 pl-1">เลือกปีการศึกษา</label>
                                    <div className="relative">
                                        <select
                                            value={selectedYear || ""}
                                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-black text-slate-705 dark:text-white appearance-none outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer shadow-lg shadow-slate-200/50 dark:shadow-none pr-10"
                                        >
                                            {records.map((r) => (
                                                <option key={r.id} value={r.year}>
                                                    ปีการศึกษา {r.year}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={14} />
                                        </div>
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
                            className="space-y-10"
                        >
                            {/* Branded Summary Cards (Matches about.tsx rounded-[2.5rem] cards) */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden transition-all duration-300">
                                {/* Subtle watermark emblem logo */}
                                <div className="absolute right-0 bottom-0 p-8 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                                    <img 
                                        src="/logo/LOGO_SERIRACHA_COLOR_TRANERENT.png" 
                                        alt="watermark" 
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>

                                {/* Certification Subheading (Matches border accent theme in about.tsx text-3xl font-black) */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-8 gap-4">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white border-l-4 border-primary-600 pl-6 leading-none">
                                            สรุปสารสนเทศ ปีการศึกษา {activeRecord.year}
                                        </h2>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-3 pl-6">
                                            Academic Factsheet Summary Year {activeRecord.year}
                                        </p>
                                    </div>
                                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 self-start sm:self-auto shadow-sm">
                                        ข้อมูล ณ วันที่ {formatThaiDate(activeRecord.as_of_date)}
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    {/* Division 1: Students Enrollment */}
                                    <div>
                                        <h4 className="text-[10px] font-black text-primary-600 dark:text-primary-450 uppercase tracking-[0.1em] mb-6">สถิติจำนวนนักศึกษาแยกตามระดับชั้น <span className="font-black uppercase tracking-[0.3em] ml-2">/ Student Enrollment</span></h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                                            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem] border border-slate-100/70 dark:border-slate-850 transition-all hover:scale-[1.01]">
                                                <span className="text-xs font-bold text-slate-400 block mb-1">ระดับ ปวช.</span>
                                                <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-none block my-3 tracking-tight">{activeRecord.students_pvc.toLocaleString()}</span>
                                                <span className="text-xs font-bold text-slate-550 dark:text-slate-450 block">คน (Students)</span>
                                            </div>
                                            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem] border border-slate-100/70 dark:border-slate-850 transition-all hover:scale-[1.01]">
                                                <span className="text-xs font-bold text-slate-400 block mb-1">ระดับ ปวส.</span>
                                                <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-none block my-3 tracking-tight">{activeRecord.students_pvs.toLocaleString()}</span>
                                                <span className="text-xs font-bold text-slate-550 dark:text-slate-450 block">คน (Students)</span>
                                            </div>
                                            <div className="p-6 bg-primary-50/20 dark:bg-primary-950/10 rounded-[2rem] border border-primary-100/50 dark:border-primary-900/30 transition-all hover:scale-[1.01]">
                                                <span className="text-xs font-bold text-primary-600 dark:text-primary-450 block mb-1">รวมจำนวนนักศึกษา</span>
                                                <span className="text-4xl md:text-5xl font-black text-primary-600 dark:text-primary-400 leading-none block my-3 tracking-tight">{(activeRecord.students_pvc + activeRecord.students_pvs).toLocaleString()}</span>
                                                <span className="text-xs font-bold text-primary-500 block">คน (Total Enrollment)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Division 2: School Staff */}
                                    <div>
                                        <h4 className="text-[10px] font-black text-primary-600 dark:text-primary-450 uppercase tracking-[0.1em] mb-6">สถิติจำนวนบุคลากรแยกตามการปฏิบัติงาน <span className="font-black uppercase tracking-[0.3em] ml-2">/ Personnel Statistics</span></h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                            <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem] border border-slate-100/70 dark:border-slate-850 transition-all hover:scale-[1.01]">
                                                <span className="text-xs font-bold text-slate-400 block mb-1">ผู้บริหาร</span>
                                                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none block my-2.5 tracking-tight">{activeRecord.executives.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-slate-400 block">คน (Executives)</span>
                                            </div>
                                            <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem] border border-slate-100/70 dark:border-slate-850 transition-all hover:scale-[1.01]">
                                                <span className="text-xs font-bold text-slate-400 block mb-1">ครูผู้สอน</span>
                                                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none block my-2.5 tracking-tight">{activeRecord.teachers.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-slate-400 block">คน (Teachers)</span>
                                            </div>
                                            <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem] border border-slate-100/70 dark:border-slate-850 transition-all hover:scale-[1.01]">
                                                <span className="text-xs font-bold text-slate-400 block mb-1">บุคลากรทางการศึกษา</span>
                                                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none block my-2.5 tracking-tight">{activeRecord.academic_staff.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-slate-400 block">คน (Academic Staff)</span>
                                            </div>
                                            <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem] border border-slate-100/70 dark:border-slate-850 transition-all hover:scale-[1.01]">
                                                <span className="text-xs font-bold text-slate-400 block mb-1">บุคลากรอื่นๆ</span>
                                                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none block my-2.5 tracking-tight">{activeRecord.other_staff.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-slate-400 block">คน (Support Staff)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Minimalist enrollment trend chart (Matches about.tsx rounded-[2.5rem] cards) */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.1em] mb-6 flex items-center gap-1.5">
                                    <TrendingUp size={14} className="text-primary-500" />
                                    <span>แนวโน้มจำนวนนักเรียนย้อนหลัง</span>
                                    <span className="text-slate-455 dark:text-slate-500 font-bold uppercase tracking-[0.25em] ml-1">/ Enrollment Growth Trend</span>
                                </h4>
                                <div className="h-[240px] flex items-center justify-center">
                                    {isClient ? (
                                        <Chart options={trendChartOptions} series={trendChartSeries} type="line" height="100%" width="100%" />
                                    ) : (
                                        <div className="text-slate-400 text-xs font-bold animate-pulse">กำลังประมวลแผนภูมิสถิติ...</div>
                                    )}
                                </div>
                            </div>

                            {/* Ultra-Minimalist Table Facts-sheet (Detailed View - wrapped in matching rounded card) */}
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.1em] mb-6">ข้อมูลสถิติล่าสุดและย้อนหลังในระบบ <span className="font-bold uppercase tracking-[0.25em] ml-1">/ Historical Statistics Factsheet</span></h4>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-455 uppercase font-black tracking-[0.1em] text-center">
                                                    <th className="px-2 py-4 pb-4">ปีการศึกษา</th>
                                                    <th className="px-2 py-4 pb-4">ปวช.</th>
                                                    <th className="px-2 py-4 pb-4">ปวส.</th>
                                                    <th className="px-2 py-4 pb-4 text-slate-655 dark:text-slate-350 font-black">รวมนักศึกษา</th>
                                                    <th className="px-2 py-4 pb-4">ห้องเรียน</th>
                                                    <th className="px-2 py-4 pb-4">ผู้บริหาร</th>
                                                    <th className="px-2 py-4 pb-4">ครู</th>
                                                    <th className="px-2 py-4 pb-4">บุคลากรทาง กศ.</th>
                                                    <th className="px-2 py-4 pb-4">บุคลากรอื่นๆ</th>
                                                    <th className="px-2 py-4 pb-4 text-right">ข้อมูล ณ วันที่</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-sm">
                                                {records.map((r) => (
                                                    <tr 
                                                        key={r.id} 
                                                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/20 text-slate-600 dark:text-slate-400 text-center transition-all ${r.year === selectedYear ? 'bg-primary-500/[0.04] dark:bg-primary-500/[0.07] font-bold text-primary-600 dark:text-primary-400' : ''}`}
                                                    >
                                                        <td className="px-2 py-4 font-black text-slate-850 dark:text-white text-center">
                                                            {r.year}
                                                        </td>
                                                        <td className="px-2 py-4">{r.students_pvc.toLocaleString()}</td>
                                                        <td className="px-2 py-4">{r.students_pvs.toLocaleString()}</td>
                                                        <td className="px-2 py-4 font-bold text-slate-800 dark:text-white">{(r.students_pvc + r.students_pvs).toLocaleString()}</td>
                                                        <td className="px-2 py-4">{r.classrooms.toLocaleString()}</td>
                                                        <td className="px-2 py-4">{r.executives.toLocaleString()}</td>
                                                        <td className="px-2 py-4">{r.teachers.toLocaleString()}</td>
                                                        <td className="px-2 py-4">{r.academic_staff.toLocaleString()}</td>
                                                        <td className="px-2 py-4">{r.other_staff.toLocaleString()}</td>
                                                        <td className="px-2 py-4 text-right font-medium text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{formatThaiDate(r.as_of_date)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-16 text-center">
                            <p className="text-xs text-slate-400 font-bold">ไม่พบข้อมูลสถิติของปีที่เลือกในระบบ</p>
                        </div>
                    )}
                </AnimatePresence>

                {/* Elegant Footnote Statement */}
                <div className="text-center pt-4 max-w-md mx-auto">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed tracking-wider uppercase">
                        รายงานสถิตินี้จัดทำเพื่อเผยแพร่ข้อมูลตามมาตรฐานสำนักงานคณะกรรมการการอาชีวศึกษา
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">
                        วิทยาลัยเทคโนโลยีศรีราชา สงวนลิขสิทธิ์ © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </main>
    );
}
