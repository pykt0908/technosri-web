import { useState, useEffect } from "react";
import { Briefcase, Users, GraduationCap, ClipboardList, ChevronRight, Mail, MapPin, ArrowRight, Phone, MessageCircle, Send, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../components/Reveal";
import { useSettings } from "../hooks/useSettings";

interface JobPosting {
    id: number;
    title: string;
    amount: string;
    education_level: string;
    qualifications: string;
    is_active: boolean;
    created_at: string;
}

const tiptapStyles = `
    .tiptap ul {
        list-style-type: disc !important;
        padding-left: 1.5rem !important;
        margin: 1rem 0 !important;
    }
    .tiptap ol {
        list-style-type: decimal !important;
        padding-left: 1.5rem !important;
        margin: 1rem 0 !important;
    }
`;

export default function JoinUs() {
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const { settings } = useSettings();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/active`);
                const data = await res.json();
                setJobs(data);
            } catch (err) {
                console.error("Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const recruitmentLink = settings.recruitment_link || "https://forms.gle/recruitment-example";

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 relative">
            <style dangerouslySetInnerHTML={{ __html: tiptapStyles }} />
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <header className="mb-16 md:mb-20">
                    <Reveal>
                        <div className="flex items-center space-x-3 text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] font-black text-[10px] mb-4">
                            <Briefcase size={16} />
                            <span>Careers at Sriracha Tech</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-[0.9] mb-8">
                            ร่วมเป็นส่วนหนึ่ง <br />
                            <span className="text-primary-600">ของทีมเรา</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-800 pl-6">
                            วิทยาลัยเทคโนโลยีศรีราชา เปิดรับสมัครบุคลากรตามตำแหน่งและคุณสมบัติ ดังนี้
                        </p>
                    </Reveal>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
                    {/* Jobs List */}
                    <div className="lg:col-span-8 order-2 lg:order-1">
                        <div className="space-y-6">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-[2rem] animate-pulse"></div>
                                ))
                            ) : jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <Reveal key={job.id} delay={0.1}>
                                        <div className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-600/10 hover:-translate-y-1 transition-all duration-500">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50 dark:border-slate-800/50">
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors tracking-tight leading-tight uppercase">
                                                        {job.title}
                                                    </h2>
                                                </div>
                                                <div className="text-left md:text-right">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">จำนวนที่รับ</p>
                                                    <p className="text-3xl font-black text-primary-600">{job.amount} <span className="text-sm text-slate-400 uppercase">อัตรา</span></p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                                <div className="space-y-4">
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                                        <GraduationCap size={14} className="mr-2" /> วุฒิการศึกษา
                                                    </h3>
                                                    <p className="text-slate-700 dark:text-slate-300 font-bold text-lg">{job.education_level}</p>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                                        <ClipboardList size={14} className="mr-2" /> รายละเอียด & คุณสมบัติ
                                                    </h3>
                                                    <div className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed tiptap prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job.qualifications }}></div>
                                                </div>
                                            </div>

                                            <a
                                                href={recruitmentLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full md:w-auto inline-flex items-center justify-center space-x-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
                                            >
                                                <span>สมัครตำแหน่งนี้</span>
                                                <ArrowRight size={16} />
                                            </a>
                                        </div>
                                    </Reveal>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    <Users size={64} className="mx-auto text-slate-200 mb-6" />
                                    <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">ขณะนี้ยังไม่มีตำแหน่งงานว่าง</h3>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Fix: Outermost container must be sticky, Reveal inside */}
                    <aside className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-32 self-start z-10">
                        <Reveal delay={0.4}>
                            <div className="bg-gradient-to-br from-primary-600 to-blue-800 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl shadow-primary-600/20 border border-white/10 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>

                                <div className="relative z-10">
                                    <h3 className="text-xl md:text-2xl font-black uppercase mb-6 flex items-center">
                                        <Sparkles size={20} className="mr-3 text-yellow-300 shrink-0" />
                                        สนใจร่วมงานกับเรา
                                    </h3>

                                    {/* Important Notice */}
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 mb-8">
                                        <div className="flex items-start space-x-3">
                                            <AlertCircle size={18} className="shrink-0 text-yellow-300 mt-0.5" />
                                            <p className="text-[13px] md:text-sm font-bold leading-relaxed italic text-white/90">
                                                หากมีประสบการณ์สอนหรือผลงานวิชาการ และ/หรือมีใบประกอบวิชาชีพครู จะพิจารณาเป็นพิเศษ
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:space-y-5 mb-8">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Mail size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary-200">Email Address</p>
                                                <p className="font-bold text-sm truncate">{settings.contact_email || "technosriracha@gmail.com"}</p>
                                            </div>
                                        </div>
                                        <a href={`https://line.me/ti/p/${settings.line_id || '@technosri'}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 hover:text-green-300 transition-colors">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                                <i className="fab fa-line text-lg"></i>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary-200">Line Official</p>
                                                <p className="font-bold text-sm">{settings.line_id || "@technosri"}</p>
                                            </div>
                                        </a>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary-200">Contact Number</p>
                                                <p className="font-bold text-sm">{settings.contact_phone || "038-351-468"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={recruitmentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-white text-primary-600 py-5 rounded-2xl text-center font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-xl"
                                    >
                                        สมัครงานออนไลน์
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    </aside>
                </div>
            </div>
        </main>
    );
}
