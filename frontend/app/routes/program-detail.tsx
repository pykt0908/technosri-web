import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
    ChevronLeft, Download, FileText, GraduationCap,
    Calendar, Share2, BookOpen, Layers, CheckCircle2
} from "lucide-react";
import Reveal from "../components/Reveal";
import toast from "react-hot-toast";

interface Curriculum {
    id: number;
    name: string;
    slug: string;
    level: string;
    description: string;
    image: string | null;
    document_path: string | null;
    created_at: string;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
}

export default function ProgramDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState<Curriculum | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/curricula/v/${slug}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setProgram(data);

                // Set SEO Meta Tags
                if (data.meta_title) {
                    document.title = `${data.meta_title} | วิทยาลัยเทคโนโลยีศรีราชา`;
                } else {
                    document.title = `${data.name} - หลักสูตร${data.level} | วิทยาลัยเทคโนโลยีศรีราชา`;
                }

                if (data.meta_description) {
                    const metaDescription = document.querySelector('meta[name="description"]');
                    if (metaDescription) {
                        metaDescription.setAttribute("content", data.meta_description);
                    }
                }
            } catch (err) {
                toast.error("ไม่พบข้อมูลหลักสูตร");
                navigate("/programs");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [slug, navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!program) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-24">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -z-10 overflow-hidden"></div>

            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumbs / Back */}
                <Reveal>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-xs font-black text-gray-400 hover:text-primary-600 transition-all group mb-8"
                    >
                        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        ย้อนกลับ
                    </button>
                </Reveal>

                <div className="space-y-12">
                    {/* Header Section */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-10">
                        <Reveal>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${program.level === 'ปวช.' ? 'bg-orange-500 text-white' : 'bg-purple-600 text-white'}`}>
                                    {program.level === 'ปวช.' ? 'ระดับ ปวช.' : 'ระดับ ปวส.'}
                                </span>
                                {program.document_path && (
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}/storage/${program.document_path}`}
                                        target="_blank"
                                        className="flex items-center px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
                                    >
                                        <Download size={14} className="mr-2" /> โหลดเอกสาร
                                    </a>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                                {program.name}
                            </h1>
                        </Reveal>
                    </div>

                    {/* Featured Image */}
                    <Reveal delay={0.2}>
                        <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 relative">
                            {program.image ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/storage/${program.image}`}
                                    alt={program.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-6xl select-none uppercase">
                                    {program.name.substring(0, 2)}
                                </div>
                            )}
                        </div>
                    </Reveal>

                    {/* Rich Text Content */}
                    <Reveal delay={0.3}>
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-400 leading-relaxed">
                            <style>{`
                                .program-content {
                                    white-space: pre-wrap;
                                }
                                .program-content p {
                                    min-height: 1.5rem;
                                    margin-bottom: 1.25rem;
                                }
                                .program-content ul { list-style-type: none !important; padding-left: 0 !important; }
                                .program-content li { position: relative; padding-left: 1.5rem !important; margin-bottom: 0.5rem; }
                                .program-content li::before { content: "•"; color: #1ea2ff; font-weight: bold; position: absolute; left: 0; }
                                
                                /* Bootstrap-style Striped Table (Horizontal lines only) */
                                .program-content table {
                                    width: 100% !important;
                                    border-collapse: collapse !important;
                                    margin: 1.5rem 0 !important;
                                    border: none !important;
                                }
                                .program-content td p, .program-content th p {
                                    margin-bottom: 0 !important;
                                }
                                .program-content th {
                                    background-color: #f8fafc !important;
                                    padding: 12px 16px !important;
                                    font-weight: 700 !important;
                                    text-align: left !important;
                                    border: none !important;
                                    border-bottom: 2px solid #cbd5e1 !important;
                                    color: #0f172a !important;
                                    font-size: 0.85rem !important;
                                }
                                .dark .program-content th {
                                    background-color: #1e293b !important;
                                    border-bottom-color: #334155 !important;
                                    color: #f1f5f9 !important;
                                }
                                .program-content td {
                                    padding: 12px 16px !important;
                                    border: none !important;
                                    border-bottom: 1px solid #e2e8f0 !important;
                                    color: #33415b !important;
                                    font-size: 0.9rem !important;
                                    vertical-align: top !important;
                                }
                                .dark .program-content td {
                                    border-bottom-color: #1e293b !important;
                                    color: #cbd5e1 !important;
                                }
                                .program-content tr:nth-child(even) {
                                    background-color: #f8fafc !important;
                                }
                                .dark .program-content tr:nth-child(even) {
                                    background-color: rgba(30, 41, 59, 0.5) !important;
                                }
                                .program-content tr:hover {
                                    background-color: #f1f5f9 !important;
                                }
                                .dark .program-content tr:hover {
                                    background-color: rgba(30, 41, 59, 0.8) !important;
                                }
                                .program-content hr {
                                    border: none !important;
                                    border-top: 1px solid #cbd5e1 !important;
                                    margin: 1.5rem 0 !important;
                                    opacity: 1 !important;
                                }
                                .dark .program-content hr {
                                    border-top-color: #334155 !important;
                                }
                            `}</style>
                            <div className="program-content" dangerouslySetInnerHTML={{ __html: program.description }} />
                        </div>
                    </Reveal>

                    {/* Footer Actions */}
                    <Reveal delay={0.4}>
                        <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <Share2 size={24} className="text-gray-400 mb-4" />
                            <h4 className="text-sm font-bold text-gray-500 mb-2">แชร์หลักสูตรนี้</h4>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("คัดลอกลิงก์เรียบร้อย");
                                }}
                                className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                            >
                                คัดลอกลิงก์เพื่อส่งต่อ
                            </button>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
