import { useState, useEffect } from "react";
import { 
    Image as ImageIcon, Plus, Edit2, Trash2, 
    Save, X, Loader2, Link as LinkIcon, ExternalLink,
    Move, GripVertical, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import toast from "react-hot-toast";

interface Carousel {
    id: number;
    image_path: string;
    link_url: string | null;
    link_target: "_self" | "_blank";
    sort_order: number;
    is_active: boolean;
}

export default function AdminCarousel() {
    const [carousels, setCarousels] = useState<Carousel[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{show: boolean, data?: Carousel}>({show: false});
    const [isSaving, setIsSaving] = useState(false);
    const [isReorderMode, setIsReorderMode] = useState(false);
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetchCarousels();
    }, []);

    const fetchCarousels = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/carousels`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setCarousels(data);
        } catch (err) {
            toast.error("โหลดข้อมูลล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async () => {
        setIsUpdatingOrder(true);
        const token = localStorage.getItem("admin_token");
        const orders = carousels.map((item, index) => ({
            id: item.id,
            sort_order: index + 1
        }));

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/carousels/reorder`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ orders })
            });

            if (res.ok) {
                toast.success("บันทึกลำดับเรียบร้อยแล้ว");
                setIsReorderMode(false);
            } else {
                throw new Error();
            }
        } catch (err) {
            toast.error("บันทึกลำดับล้มเหลว");
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
                ? `${import.meta.env.VITE_API_URL}/api/carousels/${modal.data.id}` 
                : `${import.meta.env.VITE_API_URL}/api/carousels`;
            
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
                toast.success("บันทึกสำเร็จ");
                setModal({show: false});
                setPreviewImage(null);
                fetchCarousels();
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

    const deleteCarousel = async (id: number) => {
        if (!confirm("ยืนยันการลบภาพสไลด์นี้?")) return;
        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/carousels/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            toast.success("ลบสำเร็จ");
            fetchCarousels();
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
                        <ImageIcon size={10} className="mr-2" /> Carousel Management
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการภาพสไลด์หน้าแรก</h1>
                    <p className="text-sm text-slate-500 mt-1">ตั้งค่าแบนเนอร์ประชาสัมพันธ์ที่แสดงผลในหน้าหลักของเว็บไซต์</p>
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
                        {isReorderMode ? "บันทึกลำดับใหม่" : "จัดลำดับภาพ"}
                    </button>
                    <button 
                        onClick={() => {
                            setPreviewImage(null);
                            setModal({show: true});
                        }}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center"
                    >
                        <Plus className="mr-2" size={16} /> เพิ่มภาพสไลด์
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="py-20 text-center animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">กำลังโหลดข้อมูล...</div>
            ) : isReorderMode ? (
                <Reorder.Group axis="y" values={carousels} onReorder={setCarousels} className="space-y-4">
                    {carousels.map((item) => (
                        <Reorder.Item 
                            key={item.id} 
                            value={item}
                            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center shadow-sm cursor-grab active:cursor-grabbing hover:border-primary-500/50 transition-colors"
                        >
                            <GripVertical className="text-slate-300 mr-6" />
                            <div className="w-32 h-16 rounded-lg overflow-hidden mr-6 border border-slate-200 dark:border-slate-700">
                                <img src={`${import.meta.env.VITE_API_URL}/storage/${item.image_path}`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 dark:text-white truncate max-w-md">{item.link_url || "ไม่มีลิงก์เชื่อมโยง"}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Target: {item.link_target}</p>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {carousels.map((item) => (
                        <motion.div 
                            layout
                            key={item.id} 
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-xl transition-all relative group"
                        >
                            <div className="aspect-[21/9] rounded-[2rem] overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
                                <img src={`${import.meta.env.VITE_API_URL}/storage/${item.image_path}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                <div className="absolute inset-4 flex justify-end items-start opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                                    <button onClick={() => setModal({show: true, data: item})} className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-primary-600 hover:text-white transition-all shadow-lg"><Edit2 size={16} /></button>
                                    <button onClick={() => deleteCarousel(item.id)} className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="px-4 pb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                        {item.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order: {item.sort_order}</span>
                                </div>
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 truncate">
                                    <LinkIcon size={14} className="mr-2 shrink-0" />
                                    <span className="truncate">{item.link_url || "No link attached"}</span>
                                    {item.link_target === '_blank' && <ExternalLink size={10} className="ml-2 text-slate-400" />}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Carousel Modal */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal({show: false})} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xl">{modal.data ? 'แก้ไขภาพสไลด์' : 'เพิ่มภาพสไลด์ใหม่'}</h3>
                                <button onClick={() => setModal({show: false})} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                {/* Image Upload Preview */}
                                <div className="relative aspect-[21/9] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden group border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors">
                                    {previewImage || modal.data?.image_path ? (
                                        <img src={previewImage || `${import.meta.env.VITE_API_URL}/storage/${modal.data?.image_path}`} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                                            <ImageIcon size={48} className="mb-4 opacity-20" />
                                            <p className="text-xs font-black uppercase tracking-widest mb-1">คลิกเพื่อเลือกไฟล์รูปภาพ</p>
                                            <p className="text-[10px] font-bold text-primary-500/60 uppercase tracking-tighter">ขนาดที่แนะนำ: 1920 x 820 px (21:9)</p>
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
                                <div className="flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-4 italic">
                                    <AlertCircle size={12} className="mr-2 text-primary-500" /> 
                                    Recommended Size: 1920 x 820 px (21:9)
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 italic">URL เชื่อมโยง (Link URL)</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                                <LinkIcon size={18} />
                                            </div>
                                            <input 
                                                name="link_url" 
                                                defaultValue={modal.data?.link_url || ''} 
                                                type="text" 
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold transition-all shadow-inner" 
                                                placeholder="เช่น https://www.google.com (ถ้ามี)" 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 italic text-center">ต้องการเปิดลิงก์แบบไหน?</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: '_self', label: 'เปิดในหน้าเดิม', icon: <ImageIcon size={18} /> },
                                                { id: '_blank', label: 'เปิดใน Tab ใหม่', icon: <ExternalLink size={18} /> }
                                            ].map((option) => (
                                                <label key={option.id} className="relative cursor-pointer group">
                                                    <input 
                                                        type="radio" 
                                                        name="link_target" 
                                                        value={option.id}
                                                        defaultChecked={(modal.data?.link_target || '_self') === option.id}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] text-slate-500 transition-all peer-checked:bg-primary-50 peer-checked:dark:bg-primary-900/20 peer-checked:border-primary-500 peer-checked:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                        <div className="mb-2 transition-transform group-hover:scale-110 group-active:scale-95">
                                                            {option.icon}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{option.label}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Hidden is_active field to maintain compatibility with API if needed */}
                                    <input type="hidden" name="is_active" value="1" />
                                </div>

                                <button disabled={isSaving} className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center justify-center shadow-xl shadow-primary-600/20 text-sm">
                                    {isSaving ? <Loader2 className="animate-spin mr-3" size={20} /> : <Save className="mr-3" size={20} />} บันทึกภาพสไลด์
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
