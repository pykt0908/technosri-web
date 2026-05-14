import { useState, useEffect } from "react";
import { 
    Briefcase, Plus, Edit2, Trash2, 
    Save, X, Loader2, AlertCircle, CheckCircle2, 
    Users, GraduationCap, ClipboardList, ToggleLeft, ToggleRight,
    Bold, Italic, List as ListIcon, ListOrdered, Undo, Redo,
    GripVertical, Move
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import toast from "react-hot-toast";

interface JobPosting {
    id: number;
    title: string;
    amount: string;
    education_level: string;
    qualifications: string;
    is_active: boolean;
    sort_order: number;
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
    .tiptap li {
        margin-bottom: 0.5rem !important;
    }
`;

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;
    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${editor.isActive('bold') ? 'bg-primary-100 text-primary-600' : 'text-slate-500'}`}><Bold size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${editor.isActive('italic') ? 'bg-primary-100 text-primary-600' : 'text-slate-500'}`}><Italic size={16} /></button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center" />
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${editor.isActive('bulletList') ? 'bg-primary-100 text-primary-600' : 'text-slate-500'}`}><ListIcon size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${editor.isActive('orderedList') ? 'bg-primary-100 text-primary-600' : 'text-slate-500'}`}><ListOrdered size={16} /></button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center" />
            <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><Undo size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><Redo size={16} /></button>
        </div>
    );
};

export default function AdminJobs() {
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{show: boolean, data?: JobPosting}>({show: false});
    const [isSaving, setIsSaving] = useState(false);
    const [isReorderMode, setIsReorderMode] = useState(false);
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-5 text-slate-800 dark:text-slate-200',
            },
        },
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (modal.show && editor) {
            editor.commands.setContent(modal.data?.qualifications || '');
        }
    }, [modal.show, editor, modal.data]);

    const fetchJobs = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job-postings`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setJobs(data);
        } catch (err) {
            toast.error("โหลดข้อมูลล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async () => {
        setIsUpdatingOrder(true);
        const token = localStorage.getItem("admin_token");
        const orders = jobs.map((job, index) => ({
            id: job.id,
            sort_order: index + 1
        }));

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job-postings/reorder`, {
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
        const payload = {
            title: formData.get('title'),
            amount: formData.get('amount'),
            education_level: formData.get('education_level'),
            qualifications: editor?.getHTML() || '',
            is_active: modal.data ? modal.data.is_active : true,
            sort_order: modal.data ? modal.data.sort_order : 0
        };

        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        try {
            const url = modal.data 
                ? `${import.meta.env.VITE_API_URL}/api/job-postings/${modal.data.id}` 
                : `${import.meta.env.VITE_API_URL}/api/job-postings`;
            
            const res = await fetch(url, {
                method: modal.data ? "PUT" : "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("บันทึกสำเร็จ");
                setModal({show: false});
                fetchJobs();
            } else {
                toast.error("เกิดข้อผิดพลาด");
            }
        } catch (err) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleStatus = async (job: JobPosting) => {
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job-postings/${job.id}/toggle`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("อัปเดตสถานะสำเร็จ");
                fetchJobs();
            }
        } catch (err) {
            toast.error("ล้มเหลว");
        }
    };

    const deleteJob = async (id: number) => {
        if (!confirm("ยืนยันการลบประกาศนี้?")) return;
        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/job-postings/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            toast.success("ลบสำเร็จ");
            fetchJobs();
        } catch (err) {
            toast.error("ลบไม่สำเร็จ");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <style dangerouslySetInnerHTML={{ __html: tiptapStyles }} />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 gap-6">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <Briefcase size={10} className="mr-2" /> Recruitment Management
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการการรับสมัครงาน</h1>
                    <p className="text-sm text-slate-500 mt-1">บริหารจัดการประกาศรับสมัครบุคลากรและตำแหน่งงานว่าง</p>
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
                        {isReorderMode ? "บันทึกลำดับใหม่" : "จัดลำดับประกาศ"}
                    </button>
                    {isReorderMode && (
                        <button 
                            onClick={() => { setIsReorderMode(false); fetchJobs(); }}
                            className="px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                        >
                            ยกเลิก
                        </button>
                    )}
                    <button 
                        onClick={() => setModal({show: true})}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center"
                    >
                        <Plus className="mr-2" size={16} /> เพิ่มตำแหน่งงาน
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">กำลังโหลดข้อมูล...</div>
            ) : isReorderMode ? (
                <Reorder.Group axis="y" values={jobs} onReorder={setJobs} className="space-y-4">
                    {jobs.map((job) => (
                        <Reorder.Item 
                            key={job.id} 
                            value={job}
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center shadow-sm cursor-grab active:cursor-grabbing hover:border-primary-500/50 transition-colors"
                        >
                            <GripVertical className="text-slate-300 mr-6" />
                            <div className="flex-1">
                                <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{job.title}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ลำดับปัจจุบัน: {job.sort_order}</p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${job.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                {job.is_active ? 'เปิดรับ' : 'ปิดรับ'}
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <motion.div 
                            layout
                            key={job.id} 
                            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all relative group flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center ${job.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                    {job.is_active ? <CheckCircle2 size={12} className="mr-2" /> : <AlertCircle size={12} className="mr-2" />}
                                    {job.is_active ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setModal({show: true, data: job})} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => deleteJob(job.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-400 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 leading-tight uppercase tracking-tight">{job.title}</h3>
                            
                            <div className="space-y-4 mb-8 flex-1">
                                <div className="flex items-center text-sm text-slate-500">
                                    <Users size={16} className="mr-3 text-primary-500 shrink-0" />
                                    <span className="font-bold text-slate-800 dark:text-slate-200 mr-2 uppercase text-[10px] tracking-widest">จำนวน:</span> {job.amount} อัตรา
                                </div>
                                <div className="flex items-start text-sm text-slate-500">
                                    <GraduationCap size={16} className="mr-3 mt-1 text-primary-500 shrink-0" />
                                    <div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-widest">การศึกษา:</span>
                                        <p className="mt-1 leading-relaxed font-medium">{job.education_level}</p>
                                    </div>
                                </div>
                                <div className="flex items-start text-sm text-slate-500">
                                    <ClipboardList size={16} className="mr-3 mt-1 text-primary-500 shrink-0" />
                                    <div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-widest">คุณสมบัติ:</span>
                                        <div 
                                            className="mt-1 leading-relaxed line-clamp-3 italic prose prose-sm dark:prose-invert tiptap font-medium"
                                            dangerouslySetInnerHTML={{ __html: job.qualifications }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                    ลำดับ: {job.sort_order}
                                </span>
                                <button 
                                    onClick={() => toggleStatus(job)}
                                    className={`flex items-center text-[10px] font-black uppercase tracking-widest transition-colors ${job.is_active ? 'text-slate-400 hover:text-red-500' : 'text-primary-600 hover:text-primary-700'}`}
                                >
                                    {job.is_active ? (
                                        <><ToggleRight size={24} className="mr-2" /> ปิดรับ</>
                                    ) : (
                                        <><ToggleLeft size={24} className="mr-2" /> เปิดรับ</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Job Modal */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal({show: false})} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xl">{modal.data ? 'แก้ไขประกาศ' : 'เพิ่มประกาศรับสมัครงาน'}</h3>
                                <button onClick={() => setModal({show: false})} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">ตำแหน่งที่ต้องการ</label>
                                        <input name="title" defaultValue={modal.data?.title} required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold" placeholder="เช่น อาจารย์สาขาคอมพิวเตอร์กราฟิก" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">จำนวนอัตรา</label>
                                        <input name="amount" defaultValue={modal.data?.amount} required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold" placeholder="เช่น 2 อัตรา" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">ระดับการศึกษาและสาขา</label>
                                        <input name="education_level" defaultValue={modal.data?.education_level} required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-white font-bold" placeholder="เช่น ปริญญาตรี สาขาวิทยาการคอมพิวเตอร์" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">คุณสมบัติ</label>
                                        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500">
                                            <MenuBar editor={editor} />
                                            <EditorContent editor={editor} className="bg-slate-50 dark:bg-slate-800 tiptap" />
                                        </div>
                                    </div>
                                </div>
                                <button disabled={isSaving} className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center justify-center shadow-xl shadow-primary-600/20 text-sm">
                                    {isSaving ? <Loader2 className="animate-spin mr-3" size={20} /> : <Save className="mr-3" size={20} />} บันทึกข้อมูลประกาศ
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
