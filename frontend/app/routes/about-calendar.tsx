import { useEffect } from "react";
import { Calendar } from "lucide-react";
import Reveal from "../components/Reveal";
import CalendarSection from "../components/CalendarSection";

export default function AboutCalendar() {
    useEffect(() => {
        document.title = "ปฏิทินกิจกรรมวิทยาลัย | วิทยาลัยเทคโนโลยีศรีราชา";
    }, []);

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
                            <Calendar size={12} className="animate-pulse" />
                            <span className="tracking-[0.1em] uppercase">เกี่ยวกับเรา</span>
                            <span className="text-slate-400 dark:text-slate-500 mx-1">|</span>
                            <span className="tracking-[0.3em] uppercase">College Calendar</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                            ปฏิทินกิจกรรม <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">และปฏิทินวิชาการ</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-4 max-w-2xl font-medium leading-relaxed">
                            กำหนดการ วันสำคัญ ปฏิทินวิชาการ ตารางกิจกรรม ตารางสอบ และความเคลื่อนไหวต่าง ๆ
                            ของวิทยาลัยเทคโนโลยีศรีราชา เพื่อให้นักเรียน นักศึกษา และบุคลากรได้รับทราบข้อมูลอย่างเป็นระบบ
                        </p>
                    </Reveal>
                </header>

                {/* Calendar Content */}
                <Reveal delay={0.2}>
                    <CalendarSection isPage={true} />
                </Reveal>

                {/* Elegant Footnote Statement */}
                <div className="text-center pt-8 max-w-md mx-auto">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed tracking-wider uppercase">
                        ปฏิทินกิจกรรมและแผนการเรียนการสอน ประจำภาคเรียน วิทยาลัยเทคโนโลยีศรีราชา
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">
                        วิทยาลัยเทคโนโลยีศรีราชา สงวนลิขสิทธิ์ © {new Date().getFullYear()}
                    </p>
                </div>

            </div>
        </main>
    );
}
