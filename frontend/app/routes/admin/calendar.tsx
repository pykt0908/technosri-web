import { useState, useEffect } from "react";
import { 
    Calendar as CalendarIcon, Plus, Edit2, Trash2, 
    Save, X, Loader2, Link as LinkIcon, ExternalLink,
    AlertCircle, MapPin, Clock, Eye, EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface CalendarEvent {
    id: number;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    location: string | null;
    color: string | null;
    link_url: string | null;
    is_active: boolean;
}

const PREDEFINED_COLORS = [
    { name: "Blue (Primary)", hex: "#1ea2ff" },
    { name: "Green (Success)", hex: "#10b981" },
    { name: "Red (Alert)", hex: "#ef4444" },
    { name: "Yellow (Warning)", hex: "#f59e0b" },
    { name: "Purple (Academic)", hex: "#8b5cf6" },
    { name: "Pink (Activity)", hex: "#ec4899" },
];

export default function AdminCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{show: boolean, data?: CalendarEvent}>({show: false});
    const [isSaving, setIsSaving] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#1ea2ff");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (modal.show) {
            setSelectedColor(modal.data?.color || "#1ea2ff");
        }
    }, [modal.show, modal.data]);

    const fetchEvents = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/calendar-events`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            toast.error("โหลดข้อมูลกิจกรรมล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const formatDatetimeLocal = (dateString?: string | null) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        
        const pad = (num: number) => num.toString().padStart(2, '0');
        
        const yyyy = date.getFullYear();
        const mm = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const hh = pad(date.getHours());
        const min = pad(date.getMinutes());
        
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    };

    const formatDateThai = (dateString: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }) + " น.";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const eventData = {
            title: formData.get("title") as string,
            description: (formData.get("description") as string) || null,
            start_date: formData.get("start_date") as string,
            end_date: (formData.get("end_date") as string) || null,
            location: (formData.get("location") as string) || null,
            color: selectedColor,
            link_url: (formData.get("link_url") as string) || null,
            is_active: formData.get("is_active") === "1" ? true : false,
        };

        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        try {
            const url = modal.data 
                ? `${import.meta.env.VITE_API_URL}/api/calendar-events/${modal.data.id}` 
                : `${import.meta.env.VITE_API_URL}/api/calendar-events`;
            
            const method = modal.data ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(eventData)
            });

            if (res.ok) {
                toast.success("บันทึกกิจกรรมสำเร็จ");
                setModal({show: false});
                fetchEvents();
            } else {
                const errData = await res.json();
                toast.error(errData.message || "เกิดข้อผิดพลาดในการบันทึก");
            }
        } catch (err) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setIsSaving(false);
        }
    };

    const deleteEvent = async (id: number) => {
        if (!confirm("ยืนยันการลบกิจกรรมนี้?")) return;
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendar-events/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("ลบกิจกรรมสำเร็จ");
                fetchEvents();
            } else {
                toast.error("ลบกิจกรรมไม่สำเร็จ");
            }
        } catch (err) {
            toast.error("การเชื่อมต่อล้มเหลว");
        }
    };

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 gap-6">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <CalendarIcon size={10} className="mr-2" /> Calendar Management
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการปฏิทินวิทยาลัย</h1>
                    <p className="text-sm text-slate-500 mt-1">เพิ่ม แก้ไข หรือลบกิจกรรมและวันสำคัญต่างๆ ของวิทยาลัยเพื่อแสดงบนหน้าเว็บไซต์</p>
                </div>
                
                <button 
                    onClick={() => {
                        setModal({show: true});
                    }}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center"
                >
                    <Plus className="mr-2" size={16} /> เพิ่มกิจกรรมใหม่
                </button>
            </header>

            {/* Search filter bar */}
            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหากิจกรรม..."
                    className="w-full max-w-md px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white"
                />
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">กำลังโหลดข้อมูล...</div>
            ) : filteredEvents.length === 0 ? (
                <div className="py-20 text-center text-slate-400 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <CalendarIcon size={48} className="mx-auto mb-4 opacity-20 text-slate-400" />
                    <p className="text-sm font-bold">ไม่พบข้อมูลกิจกรรม</p>
                    <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเพิ่มกิจกรรมใหม่</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-5 px-6 w-16 text-center">สี</th>
                                    <th className="py-5 px-6">กิจกรรม / รายละเอียด</th>
                                    <th className="py-5 px-6">เริ่ม</th>
                                    <th className="py-5 px-6">สิ้นสุด</th>
                                    <th className="py-5 px-6">สถานที่</th>
                                    <th className="py-5 px-6 text-center">สถานะ</th>
                                    <th className="py-5 px-6 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="py-5 px-6 text-center">
                                            <div 
                                                className="w-5 h-5 rounded-full mx-auto shadow-sm" 
                                                style={{ backgroundColor: event.color || "#1ea2ff" }}
                                            />
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="font-bold text-slate-800 dark:text-white leading-snug">{event.title}</div>
                                            {event.description && (
                                                <div className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-md">{event.description}</div>
                                            )}
                                            {event.link_url && (
                                                <a 
                                                    href={event.link_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center text-xs text-primary-500 hover:text-primary-600 mt-2 font-bold group"
                                                >
                                                    <LinkIcon size={12} className="mr-1" /> รายละเอียดเพิ่มเติม 
                                                    <ExternalLink size={10} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                            )}
                                        </td>
                                        <td className="py-5 px-6 font-semibold text-slate-600 dark:text-slate-300">
                                            {formatDateThai(event.start_date)}
                                        </td>
                                        <td className="py-5 px-6 font-semibold text-slate-600 dark:text-slate-300">
                                            {event.end_date ? formatDateThai(event.end_date) : "-"}
                                        </td>
                                        <td className="py-5 px-6">
                                            {event.location ? (
                                                <span className="inline-flex items-center text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <MapPin size={12} className="mr-1.5 text-slate-400" />
                                                    {event.location}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                event.is_active 
                                                ? "bg-green-50 text-green-600 border border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30" 
                                                : "bg-slate-50 text-slate-400 border border-slate-150 dark:bg-slate-800/30 dark:text-slate-500 dark:border-slate-700/50"
                                            }`}>
                                                {event.is_active ? (
                                                    <>
                                                        <Eye size={12} className="mr-1" /> Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff size={12} className="mr-1" /> Hidden
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-right whitespace-nowrap">
                                            <div className="flex justify-end items-center space-x-2">
                                                <button 
                                                    onClick={() => setModal({show: true, data: event})}
                                                    className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors border border-slate-100 dark:border-slate-750"
                                                    title="แก้ไขกิจกรรม"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteEvent(event.id)}
                                                    className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950 text-red-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors border border-slate-100 dark:border-slate-750"
                                                    title="ลบกิจกรรม"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal สำหรับ เพิ่ม/แก้ไข กิจกรรม */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal({show: false})} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
                            <div className="px-6 py-4 md:px-10 md:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xl">
                                    {modal.data ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}
                                </h3>
                                <button onClick={() => setModal({show: false})} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24} /></button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
                                {/* หัวข้อกิจกรรม */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">หัวข้อกิจกรรม (Title) *</label>
                                    <input 
                                        name="title" 
                                        defaultValue={modal.data?.title || ''} 
                                        type="text" 
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all text-sm" 
                                        placeholder="เช่น พิธีปฐมนิเทศนักศึกษาใหม่ ประจำปีการศึกษา 2569" 
                                    />
                                </div>

                                {/* รายละเอียดกิจกรรม */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">รายละเอียด (Description)</label>
                                    <textarea 
                                        name="description" 
                                        defaultValue={modal.data?.description || ''} 
                                        rows={1.5}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-semibold transition-all text-xs resize-none" 
                                        placeholder="รายละเอียดกิจกรรม วันเวลาที่แน่นอน ลำดับพิธีการ หรือคำอธิบายโดยย่อ..." 
                                    />
                                </div>

                                {/* วันเวลา เริ่ม-สิ้นสุด */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">วันที่เริ่ม (Start Date & Time) *</label>
                                        <input 
                                            name="start_date" 
                                            defaultValue={formatDatetimeLocal(modal.data?.start_date)} 
                                            type="datetime-local" 
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all text-xs" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">วันที่สิ้นสุด (End Date & Time)</label>
                                        <input 
                                            name="end_date" 
                                            defaultValue={formatDatetimeLocal(modal.data?.end_date)} 
                                            type="datetime-local" 
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all text-xs" 
                                        />
                                    </div>
                                </div>

                                {/* สถานที่ และ URL เชื่อมโยง */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">สถานที่ (Location)</label>
                                        <input 
                                            name="location" 
                                            defaultValue={modal.data?.location || ''} 
                                            type="text" 
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all text-xs" 
                                            placeholder="เช่น ห้องประชุมใหญ่ อาคาร 3 ชั้น 5"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">URL รายละเอียดเพิ่มเติม (Link URL)</label>
                                        <input 
                                            name="link_url" 
                                            defaultValue={modal.data?.link_url || ''} 
                                            type="url" 
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all text-xs" 
                                            placeholder="เช่น https://..."
                                        />
                                    </div>
                                </div>

                                {/* สีและสถานะ */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* สีสัญลักษณ์กิจกรรม */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">สีสัญลักษณ์กิจกรรม (Color)</label>
                                        <div className="flex flex-wrap gap-2 items-center h-[38px]">
                                            {PREDEFINED_COLORS.map((color) => (
                                                <button
                                                    key={color.hex}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color.hex)}
                                                    className={`w-6 h-6 rounded-full border transition-all hover:scale-115 flex items-center justify-center ${
                                                        selectedColor === color.hex 
                                                        ? "border-slate-900 dark:border-white scale-110 shadow-sm" 
                                                        : "border-transparent"
                                                    }`}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.name}
                                                >
                                                    {selectedColor === color.hex && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                                                    )}
                                                </button>
                                            ))}
                                            <div className="flex items-center space-x-1.5 border-l border-slate-200 dark:border-slate-800 pl-2 ml-1">
                                                <input 
                                                    type="color" 
                                                    value={selectedColor} 
                                                    onChange={(e) => setSelectedColor(e.target.value)}
                                                    className="w-6 h-6 bg-transparent rounded cursor-pointer border-0 p-0"
                                                />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{selectedColor}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* สถานะแสดงผล */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">การเปิดแสดงผลบนเว็บไซต์</label>
                                        <select 
                                            name="is_active" 
                                            defaultValue={modal.data ? (modal.data.is_active ? '1' : '0') : '1'}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all text-xs"
                                        >
                                            <option value="1">แสดงบนหน้าเว็บ (Active)</option>
                                            <option value="0">ซ่อนไว้ก่อน (Hidden)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* บันทึกปุ่ม */}
                                <button 
                                    disabled={isSaving} 
                                    className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center justify-center shadow-lg shadow-primary-600/10 text-xs mt-2"
                                >
                                    {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />} 
                                    {modal.data ? 'บันทึกการแก้ไข' : 'บันทึกกิจกรรม'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
