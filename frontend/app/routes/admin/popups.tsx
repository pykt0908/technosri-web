import { useState, useEffect } from "react";
import { 
    Image as ImageIcon, Plus, Edit2, Trash2, 
    Save, X, Loader2, Link as LinkIcon, ExternalLink,
    Move, GripVertical, AlertCircle, Sparkles, Sliders
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import toast from "react-hot-toast";

interface HomePopup {
    id: number;
    title: string | null;
    image_path: string;
    link_url: string | null;
    link_target: "_self" | "_blank";
    sort_order: number;
    is_active: boolean;
    popup_size: "sm" | "md" | "lg";
    frequency: "once" | "always";
}

export default function AdminPopups() {
    const [popups, setPopups] = useState<HomePopup[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{show: boolean, data?: HomePopup}>({show: false});
    const [isSaving, setIsSaving] = useState(false);
    const [isReorderMode, setIsReorderMode] = useState(false);
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetchPopups();
    }, []);

    const fetchPopups = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/popups`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setPopups(data);
        } catch (err) {
            toast.error("โหลดข้อมูลล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async () => {
        setIsUpdatingOrder(true);
        const token = localStorage.getItem("admin_token");
        const orders = popups.map((item, index) => ({
            id: item.id,
            sort_order: index + 1
        }));

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/popups/reorder`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ orders })
            });

            if (res.ok) {
                toast.success("บันทึกการเรียงลำดับเรียบร้อยแล้ว");
                setIsReorderMode(false);
            } else {
                throw new Error();
            }
        } catch (err) {
            toast.error("บันทึกการเรียงลำดับล้มเหลว");
        } finally {
            setIsUpdatingOrder(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        try {
            const url = modal.data 
                ? `${import.meta.env.VITE_API_URL}/api/popups/${modal.data.id}` 
                : `${import.meta.env.VITE_API_URL}/api/popups`;
            
            // Laravel needs _method=PUT for multipart/form-data updates
            if (modal.data) {
                formData.append('_method', 'PUT');
            }

            const res = await fetch(url, {
                method: "POST", // Use POST even for updates due to file upload
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: formData
            });

            if (res.ok) {
                toast.success("บันทึกป๊อปอัปสำเร็จ");
                setModal({show: false});
                setPreviewImage(null);
                fetchPopups();
            } else {
                const errData = await res.json();
                toast.error(errData.message || "เกิดข้อผิดพลาด");
            }
        } catch (err) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setIsSaving(false);
        }
    };

    const deletePopup = async (id: number) => {
        if (!confirm("ยืนยันการลบป๊อปอัปนี้?")) return;
        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/popups/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            toast.success("ลบป๊อปอัปสำเร็จ");
            fetchPopups();
        } catch (err) {
            toast.error("ลบไม่สำเร็จ");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 gap-6">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <Sliders size={10} className="mr-2" /> Popup Management
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการป๊อปอัปหน้าแรก</h1>
                    <p className="text-sm text-slate-500 mt-1">สามารถกำหนดป๊อปอัปแจ้งเตือนหรือแบนเนอร์ประชาสัมพันธ์ที่จะเด้งขึ้นมาในหน้าแรก และเรียงลำดับลำดับก่อนหลังการแสดงผลได้</p>
                </div>
                
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => {
                            if (isReorderMode) handleReorder();
                            else setIsReorderMode(true);
                        }}
                        disabled={isUpdatingOrder}
                        className={`px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center shadow-sm ${
                            isReorderMode 
                            ? "bg-green-600 text-white hover:bg-green-700" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                    >
                        {isUpdatingOrder ? <Loader2 size={14} className="animate-spin mr-2" /> : isReorderMode ? <Save size={14} className="mr-2" /> : <Move size={14} className="mr-2" />}
                        {isReorderMode ? "บันทึกลำดับใหม่" : "จัดลำดับป๊อปอัป"}
                    </button>
                    <button 
                        onClick={() => {
                            setPreviewImage(null);
                            setModal({show: true});
                        }}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center"
                    >
                        <Plus className="mr-2" size={16} /> เพิ่มป๊อปอัป
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="py-20 text-center animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">กำลังโหลดข้อมูล...</div>
            ) : isReorderMode ? (
                <Reorder.Group axis="y" values={popups} onReorder={setPopups} className="space-y-4">
                    {popups.map((item) => (
                        <Reorder.Item 
                            key={item.id} 
                            value={item}
                            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center shadow-sm cursor-grab active:cursor-grabbing hover:border-primary-500/50 transition-colors"
                        >
                            <GripVertical className="text-slate-300 mr-6" />
                            <div className="w-24 h-16 rounded-lg overflow-hidden mr-6 border border-slate-200 dark:border-slate-700 bg-slate-50 flex items-center justify-center">
                                <img src={`${import.meta.env.VITE_API_URL}/storage/${item.image_path}`} className="h-full w-auto object-contain" alt="" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 dark:text-white truncate max-w-md">{item.title || "ไม่มีหัวข้อ"}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Size: {item.popup_size.toUpperCase()} | Frequency: {item.frequency.toUpperCase()}</p>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            ) : popups.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 py-20 text-center">
                    <AlertCircle size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                    <p className="text-slate-500 font-bold">ยังไม่มีข้อมูลป๊อปอัปหน้าแรก</p>
                    <p className="text-xs text-slate-400 mt-1">คุณสามารถเพิ่มป๊อปอัปใหม่ได้โดยการคลิกที่ปุ่มด้านขวาบน</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popups.map((item) => (
                        <motion.div 
                            layout
                            key={item.id} 
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-xl transition-all relative group flex flex-col justify-between"
                        >
                            <div>
                                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 border border-slate-100 dark:border-slate-800 bg-slate-50 flex items-center justify-center relative">
                                    <img src={`${import.meta.env.VITE_API_URL}/storage/${item.image_path}`} className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-700" alt="" />
                                    <div className="absolute inset-4 flex justify-end items-start opacity-0 group-hover:opacity-100 transition-opacity space-x-2 z-10">
                                        <button onClick={() => setModal({show: true, data: item})} className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-primary-600 hover:text-white transition-all shadow-lg"><Edit2 size={16} /></button>
                                        <button onClick={() => deletePopup(item.id)} className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <div className="px-4 pb-4">
                                    <h3 className="font-bold text-slate-800 dark:text-white text-base truncate mb-2">{item.title || "ป๊อปอัปไม่มีหัวข้อ"}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.is_active ? 'bg-green-50 text-green-600 border border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30' : 'bg-slate-50 text-slate-400 border border-slate-100 dark:bg-slate-800/50 dark:text-slate-500 dark:border-slate-800'}`}>
                                            {item.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
                                            Size: {item.popup_size}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30">
                                            {item.frequency === 'once' ? 'Show Once' : 'Show Always'}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-slate-400 border border-slate-100 dark:border-slate-800 ml-auto">
                                            Order: {item.sort_order}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 pb-4">
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 truncate">
                                    <LinkIcon size={14} className="mr-2 shrink-0" />
                                    <span className="truncate">{item.link_url || "ไม่มีลิงก์ปลายทาง"}</span>
                                    {item.link_target === '_blank' && <ExternalLink size={10} className="ml-2 text-slate-400" />}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            {/* Popup Modal */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[100] overflow-y-auto flex justify-center items-start p-4">
                        <div onClick={() => setModal({show: false})} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 z-10 my-8">
                            <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xl">{modal.data ? 'แก้ไขป๊อปอัป' : 'เพิ่มป๊อปอัปใหม่'}</h3>
                                <button onClick={() => setModal({show: false})} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24} /></button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-10 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Image Upload & Status */}
                                    <div className="space-y-5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic mb-1">รูปภาพป๊อปอัป (Image)</label>
                                        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden group border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors w-full">
                                            {previewImage || modal.data?.image_path ? (
                                                <img src={previewImage || `${import.meta.env.VITE_API_URL}/storage/${modal.data?.image_path}`} className="w-full h-full object-contain p-2" alt="" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                                                    <ImageIcon size={36} className="mb-2 opacity-20" />
                                                    <p className="text-xs font-black uppercase tracking-widest mb-1">คลิกเพื่อเลือกไฟล์รูปภาพ</p>
                                                    <p className="text-[9px] font-bold text-primary-500/60 uppercase tracking-tighter">รองรับ JPG, PNG, WEBP (สูงสุด 5MB)</p>
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                name="image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                required={!modal.data}
                                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                            />
                                        </div>
                                        <div className="flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic -mt-2">
                                            <AlertCircle size={10} className="mr-1.5 text-primary-500" /> 
                                            Size: fits sm, md, or lg.
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic text-center">เปิดลิงก์แบบไหน?</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { id: '_self', label: 'หน้าเดิม', icon: <ImageIcon size={14} /> },
                                                        { id: '_blank', label: 'Tab ใหม่', icon: <ExternalLink size={14} /> }
                                                    ].map((option) => (
                                                        <label key={option.id} className="relative cursor-pointer group">
                                                            <input 
                                                                type="radio" 
                                                                name="link_target" 
                                                                value={option.id}
                                                                defaultChecked={(modal.data?.link_target || '_self') === option.id}
                                                                className="peer sr-only"
                                                            />
                                                            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.2rem] text-slate-500 transition-all peer-checked:bg-primary-50 peer-checked:dark:bg-primary-900/20 peer-checked:border-primary-500 peer-checked:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                <div className="mb-0.5 transition-transform group-hover:scale-105">
                                                                    {option.icon}
                                                                </div>
                                                                <span className="text-[8px] font-black uppercase tracking-widest">{option.label}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic text-center">สถานะการใช้งาน</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { id: '1', label: 'เปิดใช้งาน', icon: <Sparkles size={14} className="text-green-500" /> },
                                                        { id: '0', label: 'ปิดชั่วคราว', icon: <X size={14} className="text-rose-500" /> }
                                                    ].map((option) => (
                                                        <label key={option.id} className="relative cursor-pointer group">
                                                            <input 
                                                                type="radio" 
                                                                name="is_active" 
                                                                value={option.id}
                                                                defaultChecked={modal.data ? (modal.data.is_active ? '1' : '0') === option.id : '1' === option.id}
                                                                className="peer sr-only"
                                                            />
                                                            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.2rem] text-slate-500 transition-all peer-checked:bg-primary-50 peer-checked:dark:bg-primary-900/20 peer-checked:border-primary-500 peer-checked:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                <div className="mb-0.5 transition-transform group-hover:scale-105">
                                                                    {option.icon}
                                                                </div>
                                                                <span className="text-[8px] font-black uppercase tracking-widest">{option.label}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Title, URL, Size, Frequency */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">หัวข้อป๊อปอัป (Title)</label>
                                            <input 
                                                name="title" 
                                                defaultValue={modal.data?.title || ''} 
                                                type="text" 
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all shadow-inner text-xs" 
                                                placeholder="เช่น ประกาศรับสมัครรอบโควตาพิเศษ (ถ้ามี)" 
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">URL เชื่อมโยง (Link URL)</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                                    <LinkIcon size={14} />
                                                </div>
                                                <input 
                                                    name="link_url" 
                                                    defaultValue={modal.data?.link_url || ''} 
                                                    type="text" 
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all shadow-inner text-xs" 
                                                    placeholder="เช่น https://admission.technosri.ac.th (ถ้ามี)" 
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">ขนาดหน้าต่าง (Popup Size)</label>
                                            <select 
                                                name="popup_size" 
                                                defaultValue={modal.data?.popup_size || 'md'}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all appearance-none cursor-pointer text-xs"
                                            >
                                                <option value="sm">ขนาดเล็ก (Small - 400px)</option>
                                                <option value="md">ขนาดกลาง (Medium - 600px)</option>
                                                <option value="lg">ขนาดใหญ่ (Large - 900px)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 italic">ความถี่การแสดงผล (Show Frequency)</label>
                                            <select 
                                                name="frequency" 
                                                defaultValue={modal.data?.frequency || 'once'}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all appearance-none cursor-pointer text-xs"
                                            >
                                                <option value="once">แสดงครั้งเดียวต่อเซสชัน (Once per session)</option>
                                                <option value="always">แสดงทุกครั้งที่โหลดหน้าแรก (Always on home load)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button disabled={isSaving} className="w-full py-4 bg-primary-600 text-white rounded-[1.2rem] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center justify-center shadow-xl shadow-primary-600/20 text-xs mt-6">
                                    {isSaving ? <Loader2 className="animate-spin mr-3" size={18} /> : <Save className="mr-3" size={18} />} บันทึกป๊อปอัป
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
