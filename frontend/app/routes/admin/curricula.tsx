import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
    Plus, Search, Edit2, Trash2, BookOpen, 
    ChevronRight, Filter, FileText, Download,
    GraduationCap, AlertCircle, Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Curriculum {
    id: number;
    name: string;
    level: string;
    status: string;
    document_path: string | null;
    image: string | null;
    created_at: string;
}

export default function CurriculumList() {
    const navigate = useNavigate();
    const [curricula, setCurricula] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLevel, setFilterLevel] = useState("all");

    const fetchCurricula = async () => {
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/curricula`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setCurricula(data);
        } catch (err) {
            toast.error("โหลดข้อมูลไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurricula();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("ยืนยันการลบหลักสูตรนี้?")) return;

        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/curricula/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("ลบหลักสูตรสำเร็จ");
                fetchCurricula();
            }
        } catch (err) {
            toast.error("ลบไม่สำเร็จ");
        }
    };

    const filteredData = curricula.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === "all" || item.level === filterLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 gap-6">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <BookOpen size={10} className="mr-2" /> Curriculum Management
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการหลักสูตรสถาบัน</h1>
                    <p className="text-sm text-slate-500 mt-1">บริหารจัดการข้อมูลหลักสูตร ปวช. และ ปวส. ที่เปิดสอนทั้งหมด</p>
                </div>
                <Link 
                    to="/admin/curricula-create" 
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center"
                >
                    <Plus size={16} className="mr-2" /> เพิ่มหลักสูตรใหม่
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: "หลักสูตรทั้งหมด", count: curricula.length, icon: <BookOpen />, color: "bg-blue-600" },
                    { label: "ระดับ ปวช.", count: curricula.filter(c => c.level === "ปวช.").length, icon: <GraduationCap />, color: "bg-orange-500" },
                    { label: "ระดับ ปวส.", count: curricula.filter(c => c.level === "ปวส.").length, icon: <GraduationCap />, color: "bg-purple-600" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-current/10`}>
                            {stat.icon && <stat.icon.type size={20} />}
                        </div>
                        <div>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.1em] mb-0.5">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="ค้นหาชื่อหลักสูตร..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <button 
                        onClick={() => setFilterLevel("all")}
                        className={`whitespace-nowrap px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filterLevel === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary-500'}`}
                    >
                        ทั้งหมด
                    </button>
                    <button 
                        onClick={() => setFilterLevel("ปวช.")}
                        className={`whitespace-nowrap px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filterLevel === 'ปวช.' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-orange-500'}`}
                    >
                        ปวช.
                    </button>
                    <button 
                        onClick={() => setFilterLevel("ปวส.")}
                        className={`whitespace-nowrap px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filterLevel === 'ปวส.' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-purple-500'}`}
                    >
                        ปวส.
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ข้อมูลหลักสูตร</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">ระดับ</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">เอกสาร</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">เครื่องมือ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-8 py-10"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden mr-5 shadow-sm border border-slate-200 dark:border-slate-700">
                                                <img 
                                                    src={item.image ? `${import.meta.env.VITE_API_URL}/storage/${item.image}` : "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=100&q=80"} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1 group-hover:text-primary-600 transition-colors">
                                                    {item.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    Created: {new Date(item.created_at).toLocaleDateString('th-TH')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.level === 'ปวช.' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                                            {item.level}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {item.document_path ? (
                                            <a 
                                                href={`${import.meta.env.VITE_API_URL}/storage/${item.document_path}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="inline-flex items-center p-3 bg-slate-50 dark:bg-slate-800 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                title="เปิดดูเอกสาร"
                                            >
                                                <FileText size={20} />
                                            </a>
                                        ) : (
                                            <span className="text-slate-300 opacity-50"><AlertCircle size={20} className="mx-auto" /></span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <Link 
                                                to={`/admin/curricula-edit/${item.id}`}
                                                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit2 size={20} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-8 py-24 text-center">
                                    <div className="mb-6 opacity-10"><BookOpen size={80} className="mx-auto" /></div>
                                    <h3 className="text-xl font-bold text-slate-400">ไม่พบข้อมูลหลักสูตรที่ค้นหา</h3>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
