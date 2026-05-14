import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    BookOpen, GraduationCap, Download, FileText,
    ChevronRight, ArrowRight, Book, Layers
} from "lucide-react";
import Reveal from "../components/Reveal";

interface Curriculum {
    id: number;
    name: string;
    slug: string;
    level: string;
    description: string;
    image: string | null;
    document_path: string | null;
}

export default function Programs() {
    const [curricula, setCurricula] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ปวช.");

    useEffect(() => {
        const fetchCurricula = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/curricula`);
                const data = await res.json();
                setCurricula(data);
            } catch (err) {
                console.error("Failed to fetch curricula");
            } finally {
                setLoading(false);
            }
        };
        fetchCurricula();
    }, []);

    const filteredData = curricula.filter(item => item.level === activeTab);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-20 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 relative">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>

                <Reveal>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-50 px-6 py-2 rounded-full border border-primary-100 mb-6 shadow-sm">
                            <GraduationCap size={14} />
                            <span>Academic Programs</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-none">
                            หลักสูตรที่ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">เปิดสอน</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                            วิทยาลัยเทคโนโลยีศรีราชา เปิดสอนหลักสูตร ปวช. และ ปวส. ดังนี้
                        </p>
                    </div>
                </Reveal>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-16">
                    <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-[2rem] flex items-center shadow-inner">
                        {["ปวช.", "ปวส."].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-12 py-4 rounded-[1.5rem] text-sm font-black transition-all duration-500 ${activeTab === tab ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ระดับ {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-900 h-[400px] rounded-[3rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <Reveal key={item.id} delay={index * 0.1}>
                                    <div className="group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-700 hover:-translate-y-4">
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            {item.image ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/storage/${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-1000"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-6xl select-none">
                                                    {item.name.substring(0, 2)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-8">
                                            <div className="mb-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${item.level === 'ปวช.' ? 'bg-orange-500 text-white' : 'bg-purple-600 text-white'}`}>
                                                    {item.level}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-primary-600 transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
                                                {item.document_path ? (
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL}/storage/${item.document_path}`}
                                                        target="_blank"
                                                        className="flex items-center text-xs font-bold text-gray-400 hover:text-primary-600 transition-colors"
                                                    >
                                                        <FileText size={16} className="mr-2" /> โหลดหลักสูตร
                                                    </a>
                                                ) : <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">No Document</span>}
                                                <Link to={`/programs/${item.slug}`} className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <Layers size={64} className="mx-auto text-gray-200 mb-6" />
                                <h3 className="text-xl font-bold text-gray-400">ยังไม่มีข้อมูลหลักสูตรในระดับนี้</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
