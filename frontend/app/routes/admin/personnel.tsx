import { useState, useEffect } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { 
    Users, Plus, GripVertical, Edit2, Trash2, 
    ChevronDown, ChevronUp, Image as ImageIcon,
    Save, X, Loader2, UserPlus, FolderPlus
} from "lucide-react";
import toast from "react-hot-toast";

interface Personnel {
    id: number;
    department_id: number;
    name: string;
    nickname: string | null;
    position: string | null;
    image: string | null;
    sort_order: number;
}

interface Department {
    id: number;
    name: string;
    sort_order: number;
    personnel?: Personnel[];
}

export default function AdminPersonnel() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedDepts, setExpandedDepts] = useState<number[]>([]);
    
    // Modals state
    const [deptModal, setDeptModal] = useState<{show: boolean, data?: Department}>({show: false});
    const [staffModal, setStaffModal] = useState<{show: boolean, deptId?: number, data?: Personnel}>({show: false});
    
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const resDepts = await fetch(`${import.meta.env.VITE_API_URL}/api/departments`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const depts = await resDepts.json();
            
            const resStaff = await fetch(`${import.meta.env.VITE_API_URL}/api/personnel`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const allStaff = await resStaff.json();
            
            const merged = depts.map((d: any) => ({
                ...d,
                personnel: allStaff.filter((s: any) => s.department_id === d.id)
            }));
            
            setDepartments(merged);
            if (merged.length > 0 && expandedDepts.length === 0) {
                setExpandedDepts([merged[0].id]);
            }
        } catch (err) {
            toast.error("โหลดข้อมูลล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedDepts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleReorderDepts = async (newOrder: Department[]) => {
        setDepartments(newOrder);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/departments/reorder`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ order: newOrder.map(d => d.id) })
            });
            if (!res.ok) {
                const err = await res.json();
                console.error("Dept reorder failed:", err);
                toast.error("บันทึกลำดับไม่สำเร็จ");
            }
        } catch (err) {
            console.error("Dept reorder connection failed:", err);
            toast.error("บันทึกลำดับไม่สำเร็จ");
        }
    };

    const handleReorderStaff = async (deptId: number, newStaffOrder: Personnel[]) => {
        const newDepts = departments.map(d => d.id === deptId ? { ...d, personnel: newStaffOrder } : d);
        setDepartments(newDepts);
        
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/personnel/reorder`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ order: newStaffOrder.map(s => s.id) })
            });
            if (!res.ok) {
                const err = await res.json();
                console.error("Staff reorder failed:", err);
                toast.error("บันทึกลำดับไม่สำเร็จ");
            }
        } catch (err) {
            console.error("Staff reorder connection failed:", err);
            toast.error("บันทึกลำดับไม่สำเร็จ");
        }
    };

    const deleteDept = async (id: number) => {
        if (!confirm("ยืนยันการลบสาขาและบุคลากรทั้งหมดในสาขานี้?")) return;
        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/departments/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            toast.success("ลบสำเร็จ");
            fetchData();
        } catch (err) {
            toast.error("ลบไม่สำเร็จ");
        }
    };

    const deleteStaff = async (id: number) => {
        if (!confirm("ยืนยันการลบบุคลากร?")) return;
        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/personnel/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            toast.success("ลบสำเร็จ");
            fetchData();
        } catch (err) {
            toast.error("ลบไม่สำเร็จ");
        }
    };

    const handleDeptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        
        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        try {
            const url = deptModal.data 
                ? `${import.meta.env.VITE_API_URL}/api/departments/${deptModal.data.id}` 
                : `${import.meta.env.VITE_API_URL}/api/departments`;
            
            const method = deptModal.data ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name })
            });
            
            if (res.ok) {
                toast.success("บันทึกสำเร็จ");
                setDeptModal({show: false});
                fetchData();
            } else {
                toast.error("เกิดข้อผิดพลาดในการบันทึก");
            }
        } catch (err) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStaffSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (staffModal.deptId) formData.append('department_id', staffModal.deptId.toString());
        
        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        try {
            const url = staffModal.data 
                ? `${import.meta.env.VITE_API_URL}/api/personnel/${staffModal.data.id}` 
                : `${import.meta.env.VITE_API_URL}/api/personnel`;
            
            const res = await fetch(url, {
                method: "POST", // Both use POST for multipart
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            
            if (res.ok) {
                toast.success("บันทึกสำเร็จ");
                setStaffModal({show: false});
                fetchData();
            } else {
                toast.error("เกิดข้อผิดพลาดในการบันทึก");
            }
        } catch (err) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <div className="flex justify-between items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <Users size={10} className="mr-2" /> Organizational Structure
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการบุคลากร</h1>
                    <p className="text-sm text-slate-500 mt-1">บริหารจัดการสาขาและรายชื่อบุคลากรภายในวิทยาลัย</p>
                </div>
                <button 
                    onClick={() => setDeptModal({show: true})}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold text-xs hover:bg-primary-700 transition-all shadow-md flex items-center"
                >
                    <Plus className="mr-2" size={16} /> เพิ่มสาขา/ฝ่าย
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">กำลังโหลดข้อมูล...</div>
            ) : (
                <Reorder.Group axis="y" values={departments} onReorder={handleReorderDepts} className="space-y-4">
                    {departments.map((dept) => (
                        <Reorder.Item key={dept.id} value={dept}>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
                                <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 group">
                                    <div className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-500 transition-colors mr-4">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(dept.id)}>
                                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                                            {dept.name}
                                            <span className="ml-3 px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] text-slate-500">
                                                {dept.personnel?.length || 0} คน
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => setStaffModal({show: true, deptId: dept.id})} className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"><UserPlus size={18} /></button>
                                        <button onClick={() => setDeptModal({show: true, data: dept})} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                        <button onClick={() => deleteDept(dept.id)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        <button onClick={() => toggleExpand(dept.id)} className="ml-2 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">{expandedDepts.includes(dept.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedDepts.includes(dept.id) && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="p-4 bg-white dark:bg-slate-900">
                                                {dept.personnel && dept.personnel.length > 0 ? (
                                                    <Reorder.Group axis="y" values={dept.personnel} onReorder={(newOrder) => handleReorderStaff(dept.id, newOrder)} className="space-y-2">
                                                        {dept.personnel.map((staff) => (
                                                            <Reorder.Item key={staff.id} value={staff}>
                                                                <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 group/item">
                                                                    <div className="cursor-grab active:cursor-grabbing text-slate-300 group-hover/item:text-slate-400 mr-4"><GripVertical size={16} /></div>
                                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 mr-4 border-2 border-white dark:border-slate-800 shadow-sm">
                                                                        {staff.image ? <img src={`${import.meta.env.VITE_API_URL}/storage/${staff.image}`} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Users size={20} /></div>}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-bold text-slate-800 dark:text-white">{staff.name} {staff.nickname ? <span className="text-primary-600 font-medium ml-1">({staff.nickname})</span> : ""}</p>
                                                                        <p className="text-xs text-slate-500">{staff.position || "ไม่มีตำแหน่ง"}</p>
                                                                    </div>
                                                                    <div className="flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                        <button onClick={() => setStaffModal({show: true, deptId: dept.id, data: staff})} className="p-2 text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"><Edit2 size={16} /></button>
                                                                        <button onClick={() => deleteStaff(staff.id)} className="p-2 text-red-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"><Trash2 size={16} /></button>
                                                                    </div>
                                                                </div>
                                                            </Reorder.Item>
                                                        ))}
                                                    </Reorder.Group>
                                                ) : (
                                                    <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">ยังไม่มีบุคลากรในสาขานี้</p>
                                                        <button onClick={() => setStaffModal({show: true, deptId: dept.id})} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all">เพิ่มบุคลากรคนแรก</button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}

            {/* Department Modal */}
            <AnimatePresence>
                {deptModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeptModal({show: false})} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{deptModal.data ? 'แก้ไขสาขา/ฝ่าย' : 'เพิ่มสาขา/ฝ่ายใหม่'}</h3>
                                <button onClick={() => setDeptModal({show: false})} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleDeptSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ชื่อสาขา/ฝ่าย</label>
                                    <input name="name" defaultValue={deptModal.data?.name} required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white" placeholder="เช่น แผนกคอมพิวเตอร์" />
                                </div>
                                <button disabled={isSaving} className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center">{isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}บันทึกข้อมูล</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Personnel Modal */}
            <AnimatePresence>
                {staffModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setStaffModal({show: false})} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{staffModal.data ? 'แก้ไขบุคลากร' : 'เพิ่มบุคลากรใหม่'}</h3>
                                <button onClick={() => setStaffModal({show: false})} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleStaffSubmit} className="p-8 space-y-6">
                                <div className="flex justify-center mb-6">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden">
                                            {staffModal.data?.image ? <img src={`${import.meta.env.VITE_API_URL}/storage/${staffModal.data.image}`} className="w-full h-full object-cover" alt="" /> : <><ImageIcon className="text-slate-300 mb-1" size={24} /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">เลือกรูป</span></>}
                                        </div>
                                        <input name="image" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ชื่อ-นามสกุล</label>
                                        <input name="name" defaultValue={staffModal.data?.name} required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white text-sm" placeholder="เช่น นายสมชาย มั่นคง" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ชื่อเล่น</label>
                                        <input name="nickname" defaultValue={staffModal.data?.nickname || ""} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white text-sm" placeholder="เช่น ชาย" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ตำแหน่ง</label>
                                        <input name="position" defaultValue={staffModal.data?.position || ""} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white text-sm" placeholder="เช่น หัวหน้าแผนก" />
                                    </div>
                                </div>
                                <button disabled={isSaving} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center shadow-lg shadow-primary-600/20">{isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}บันทึกข้อมูลบุคลากร</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
