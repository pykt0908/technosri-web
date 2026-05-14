import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link as TiptapLink } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import toast from "react-hot-toast";
import { 
    Bold, Italic, List, ListOrdered, Quote, Undo, Redo, 
    Link as LinkIcon, Image as ImageIcon, Save,
    ChevronLeft, Globe, Underline as UnderlineIcon,
    Tag, Table as TableIcon, PlusSquare, MinusSquare, AlertCircle, Link2, Loader2,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Calendar, FileText, X, Download,
    GraduationCap, Minus, Trash2, LayoutGrid
} from "lucide-react";

const FONT_FAMILIES = [
    { label: "ค่าเริ่มต้น", value: "" },
    { label: "Sarabun", value: "Sarabun, sans-serif" },
    { label: "Prompt", value: "Prompt, sans-serif" },
    { label: "Kanit", value: "Kanit, sans-serif" },
    { label: "Anuphan", value: "Anuphan, sans-serif" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Courier New", value: "'Courier New', monospace" },
];

const MenuBar = ({ editor, imageInputRef }: { editor: any, imageInputRef: React.RefObject<HTMLInputElement> }) => {
    const [uploading, setUploading] = useState(false);
    const [, setUpdate] = useState(0);

    useEffect(() => {
        if (!editor) return;
        const onUpdate = () => setUpdate(s => s + 1);
        editor.on('selectionUpdate', onUpdate);
        editor.on('transaction', onUpdate);
        return () => {
            editor.off('selectionUpdate', onUpdate);
            editor.off('transaction', onUpdate);
        };
    }, [editor]);

    if (!editor) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const token = localStorage.getItem("admin_token");
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/news/upload-image`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                editor.chain().focus().setImage({ src: data.url }).run();
                toast.success("อัปโหลดรูปภาพสำเร็จ");
            } else {
                toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setUploading(false);
        }
    };

    const setLink = () => {
        const url = window.prompt('URL ลิงก์');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const isImageSelected = editor.isActive('image');

    const btnClass = (active: boolean) =>
        `p-2 rounded-md transition-all flex items-center justify-center text-sm ${active ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`;

    const Divider = () => <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />;

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
            <div className="flex flex-wrap items-center gap-1 p-2">
                <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                {/* Typography Group */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                    <select
                        value={editor.isActive('heading', { level: 1 }) ? 1 : editor.isActive('heading', { level: 2 }) ? 2 : editor.isActive('heading', { level: 3 }) ? 3 : editor.isActive('heading', { level: 4 }) ? 4 : 0}
                        onChange={(e) => {
                            const level = parseInt(e.target.value);
                            if (level === 0) editor.chain().focus().setParagraph().run();
                            else editor.chain().focus().toggleHeading({ level: level as 1|2|3|4 }).run();
                        }}
                        className="px-2 py-1 text-xs font-bold bg-transparent text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer border-r border-slate-200 dark:border-slate-600"
                    >
                        <option value={0}>ปกติ</option>
                        <option value={1}>H1</option>
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                        <option value={4}>H4</option>
                    </select>
                    <select
                        value={editor.getAttributes('textStyle')?.fontFamily || ""}
                        onChange={(e) => {
                            if (!e.target.value) editor.chain().focus().unsetFontFamily().run();
                            else editor.chain().focus().setFontFamily(e.target.value).run();
                        }}
                        className="px-2 py-1 text-xs font-bold bg-transparent text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
                    >
                        {FONT_FAMILIES.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                </div>

                <Divider />

                {/* Formatting Group */}
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="หนา"><Bold size={15} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="เอียง"><Italic size={15} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="ขีดเส้นใต้"><UnderlineIcon size={15} /></button>
                
                <Divider />

                {/* Alignment Group */}
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="ชิดซ้าย"><AlignLeft size={15} /></button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="กึ่งกลาง"><AlignCenter size={15} /></button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="ชิดขวา"><AlignRight size={15} /></button>
                
                <Divider />

                {/* Media & Insert Group */}
                <div className="flex items-center gap-1">
                    <button type="button" onClick={setLink} className={btnClass(editor.isActive('link'))} title="แทรกลิงก์"><LinkIcon size={15} /></button>
                    <button type="button" onClick={() => imageInputRef.current?.click()} className={btnClass(false)} title="แทรกรูปภาพ">
                        {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
                        className="px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-primary-100 dark:border-primary-800" 
                        title="แทรกตาราง"
                    >
                        <TableIcon size={14} /> <span>ตาราง</span>
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)} title="แทรกเส้นคั่น"><Minus size={15} /></button>
                </div>

                <Divider />

                {/* History Group */}
                <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="ย้อนกลับ"><Undo size={15} /></button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="ทำซ้ำ"><Redo size={15} /></button>
            </div>

            {/* Contextual Table Controls */}
            {editor.isActive('table') && (
                <div className="flex flex-wrap items-center gap-1 p-2 bg-primary-50 dark:bg-primary-900/10 border-t border-primary-100 dark:border-primary-900/30 overflow-x-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 mr-2 flex items-center gap-1">
                        <LayoutGrid size={12} /> จัดการตาราง:
                    </span>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-md shadow-sm border border-primary-200 dark:border-primary-800">
                        <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors" title="เพิ่มแถวบน">+ แถวบน</button>
                        <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors" title="เพิ่มแถวล่าง">+ แถวล่าง</button>
                        <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className="px-2 py-1 hover:bg-red-500 hover:text-white rounded text-[10px] font-bold text-red-500 transition-colors" title="ลบแถว">- แถว</button>
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-md shadow-sm border border-primary-200 dark:border-primary-800">
                        <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors" title="เพิ่มคอลัมน์ซ้าย">+ คอลัมน์ซ้าย</button>
                        <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors" title="เพิ่มคอลัมน์ขวา">+ คอลัมน์ขวา</button>
                        <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className="px-2 py-1 hover:bg-red-500 hover:text-white rounded text-[10px] font-bold text-red-500 transition-colors" title="ลบคอลัมน์">- คอลัมน์</button>
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-md shadow-sm border border-primary-200 dark:border-primary-800">
                        <button type="button" onClick={() => editor.chain().focus().mergeCells().run()} className="px-2 py-1 hover:bg-primary-600 hover:text-white rounded text-[10px] font-bold text-primary-600 transition-colors" title="ผสานเซลล์ที่เลือก">ผสานเซลล์</button>
                        <button type="button" onClick={() => editor.chain().focus().splitCell().run()} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors" title="แยกเซลล์ที่ผสานไว้">แยกเซลล์</button>
                    </div>
                    <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="ml-auto flex items-center gap-1 px-3 py-1 rounded bg-red-50 dark:bg-red-900/20 text-red-600 text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm" title="ลบตารางนี้"><Trash2 size={12} /> ลบตาราง</button>
                </div>
            )}

            <AnimatePresence>
                {isImageSelected && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-primary-600 text-white flex items-center gap-4 px-4 py-2"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest border-r border-primary-500 pr-4 mr-2">Image Options</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()} className="px-3 py-1 bg-primary-700 hover:bg-white hover:text-primary-600 rounded text-[10px] font-bold transition-all uppercase">Small (25%)</button>
                            <button onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()} className="px-3 py-1 bg-primary-700 hover:bg-white hover:text-primary-600 rounded text-[10px] font-bold transition-all uppercase">Medium (50%)</button>
                            <button onClick={() => editor.chain().focus().updateAttributes('image', { width: '75%' }).run()} className="px-3 py-1 bg-primary-700 hover:bg-white hover:text-primary-600 rounded text-[10px] font-bold transition-all uppercase">Large (75%)</button>
                            <button onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()} className="px-3 py-1 bg-primary-700 hover:bg-white hover:text-primary-600 rounded text-[10px] font-bold transition-all uppercase">Full (100%)</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function CurriculumEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [level, setLevel] = useState("ปวช.");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [document, setDocument] = useState<File | null>(null);
    const [existingDoc, setExistingDoc] = useState<string | null>(null);
    const [slug, setSlug] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Refs for file inputs
    const editorImageRef = useRef<HTMLInputElement>(null);
    const featuredImageRef = useRef<HTMLInputElement>(null);
    const documentRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        width: {
                            default: '100%',
                            renderHTML: attributes => ({
                                style: `width: ${attributes.width}; height: auto; transition: width 0.3s ease;`,
                            }),
                        },
                    };
                },
            }).configure({ HTMLAttributes: { class: 'rounded-xl max-w-full h-auto my-6 mx-auto block cursor-pointer ring-primary-500 transition-all focus:ring-4' } }),
            TiptapLink.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary-600 underline font-medium' } }),
            Underline,
            TextStyle,
            FontFamily,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            Table.configure({ resizable: true, HTMLAttributes: { class: 'border-collapse table-fixed w-full border border-slate-200 dark:border-slate-700 my-4' } }),
            TableRow,
            TableHeader.configure({ HTMLAttributes: { class: 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 font-bold text-left' } }),
            TableCell.configure({ HTMLAttributes: { class: 'border border-slate-200 dark:border-slate-700 p-2' } }),
        ],
        content: '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert focus:outline-none max-w-none min-h-[500px] p-10 leading-relaxed tiptap-editor',
            },
        },
    });

    useEffect(() => {
        const fetchCurriculum = async () => {
            const token = localStorage.getItem("admin_token");
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/curricula/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setName(data.name);
                setSlug(data.slug || "");
                setMetaTitle(data.meta_title || "");
                setMetaDescription(data.meta_description || "");
                setMetaKeywords(data.meta_keywords || "");
                setLevel(data.level);
                setExistingDoc(data.document_path);
                if (data.image) {
                    setImagePreview(`${import.meta.env.VITE_API_URL}/storage/${data.image}`);
                }
                if (editor && data.description) {
                    editor.commands.setContent(data.description);
                }
            } catch (err) {
                toast.error("ไม่พบข้อมูลหลักสูตร");
                navigate("/admin/curricula");
            } finally {
                setLoading(false);
            }
        };

        if (editor) {
            fetchCurriculum();
        }
    }, [id, editor, navigate]);

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .replace(/[^\u0E00-\u0E7Fa-z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        // Only auto-generate slug if it was empty or matches the old name's slug
        if (!slug || slug === generateSlug(name)) {
            setSlug(generateSlug(val));
        }
    };

    const handleUpdate = async () => {
        if (!name || !editor?.getHTML()) {
            toast.error("กรุณาระบุชื่อหลักสูตรและรายละเอียด");
            return;
        }

        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", name);
        formData.append("slug", slug);
        formData.append("level", level);
        formData.append("description", editor.getHTML());
        formData.append("status", "active");
        formData.append("meta_title", metaTitle);
        formData.append("meta_description", metaDescription);
        formData.append("meta_keywords", metaKeywords);
        if (image) formData.append("image", image);
        if (document) formData.append("document", document);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/curricula/${id}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
                body: formData
            });

            if (res.ok) {
                toast.success("อัปเดตหลักสูตรสำเร็จ");
                navigate("/admin/curricula");
            } else {
                const data = await res.json();
                toast.error(data.message || "อัปเดตไม่สำเร็จ");
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">กำลังโหลดข้อมูล...</div>;

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <style>{`
                .tiptap-editor ul { list-style-type: disc !important; margin-left: 1.5rem !important; padding-left: 0.5rem !important; }
                .tiptap-editor ol { list-style-type: decimal !important; margin-left: 1.5rem !important; padding-left: 0.5rem !important; }
                .tiptap-editor blockquote { border-left: 4px solid #3b82f6 !important; padding-left: 1rem !important; font-style: italic !important; color: #64748b !important; margin: 1.5rem 0 !important; }
                .tiptap-editor table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 0; overflow: hidden; }
                .tiptap-editor table td, .tiptap-editor table th { min-width: 1em; border: 2px solid #ced4da; padding: 3px 5px; vertical-align: top; box-sizing: border-box; position: relative; }
                .tiptap-editor table th { font-weight: bold; text-align: left; background-color: #f8f9fa; }
                .tiptap-editor hr { border: none; border-top: 2px solid #e2e8f0; margin: 2rem 0; }
                .dark .tiptap-editor table td, .dark .tiptap-editor table th { border-color: #4a5568; }
                .dark .tiptap-editor table th { background-color: #2d3748; }
            `}</style>

            <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start">
                    <button onClick={() => navigate(-1)} className="mt-1 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg mr-6 text-slate-500 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                            <GraduationCap size={10} className="mr-2" /> Academic Management
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">แก้ไขหลักสูตร</h1>
                        <p className="text-sm text-slate-500 mt-1">อัปเดตข้อมูลและรายละเอียดหลักสูตรที่เปิดสอน</p>
                    </div>
                </div>
                <button 
                    onClick={handleUpdate} 
                    disabled={isSaving}
                    className="mt-6 md:mt-0 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold text-xs hover:bg-primary-700 transition-all shadow-md shadow-primary-600/20 flex items-center disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                    บันทึกการแก้ไข
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อหลักสูตร</span>
                        </div>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={handleNameChange}
                            className="w-full px-8 py-6 text-2xl font-bold bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white outline-none" 
                        />
                    </div>

                    {/* SEO & URL Settings */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO & URL Settings</span>
                            <div className="flex items-center text-[9px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase tracking-tighter">Search Engine Optimization</div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <Link2 size={12} className="mr-2" /> URL Slug (Custom URL)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={slug} 
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="curriculum-slug"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <Globe size={12} className="mr-2" /> Meta Title (SEO Title)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={metaTitle} 
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        placeholder="ระบุชื่อหัวข้อสำหรับ SEO..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                    <FileText size={12} className="mr-2" /> Meta Description
                                </label>
                                <textarea 
                                    rows={2}
                                    value={metaDescription} 
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    placeholder="ระบุคำบรรยายสั้นๆ สำหรับแสดงบน Google..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-medium resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                    <Tag size={12} className="mr-2" /> Meta Keywords
                                </label>
                                <input 
                                    type="text" 
                                    value={metaKeywords} 
                                    onChange={(e) => setMetaKeywords(e.target.value)}
                                    placeholder="keyword1, keyword2, keyword3"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>

                        <style>{`
                            .tiptap-editor {
                                white-space: pre-wrap !important;
                            }
                            .tiptap-editor p {
                                min-height: 1.5rem;
                                margin-bottom: 1.25rem;
                            }
                            .tiptap-editor table {
                                width: 100% !important;
                                border-collapse: collapse !important;
                                margin: 1.5rem 0 !important;
                                border: none !important;
                            }
                            .tiptap-editor td p, .tiptap-editor th p {
                                margin-bottom: 0 !important;
                            }
                            .tiptap-editor th {
                                background-color: #f8fafc !important;
                                padding: 10px 14px !important;
                                font-weight: 700 !important;
                                text-align: left !important;
                                border-bottom: 2px solid #cbd5e1 !important;
                                color: #0f172a !important;
                            }
                            .dark .tiptap-editor th {
                                background-color: #1e293b !important;
                                border-bottom-color: #334155 !important;
                            }
                            .tiptap-editor td {
                                padding: 10px 14px !important;
                                border-bottom: 1px solid #e2e8f0 !important;
                            }
                            .dark .tiptap-editor td {
                                border-bottom-color: #1e293b !important;
                            }
                            .tiptap-editor tr:nth-child(even) {
                                background-color: #f8fafc !important;
                            }
                            .dark .tiptap-editor tr:nth-child(even) {
                                background-color: rgba(30, 41, 59, 0.5) !important;
                            }
                            .tiptap-editor hr {
                                border-top: 1px solid #cbd5e1 !important;
                                margin: 1.5rem 0 !important;
                                opacity: 1 !important;
                            }
                            .dark .tiptap-editor hr {
                                border-top-color: #334155 !important;
                            }
                        `}</style>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
                            <MenuBar editor={editor} imageInputRef={editorImageRef} />
                            <EditorContent editor={editor} />
                        </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Tag size={14} className="mr-2" /> ระดับการศึกษา
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-2">
                                {['ปวช.', 'ปวส.'].map((l) => (
                                    <button 
                                        key={l}
                                        onClick={() => setLevel(l)}
                                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${level === l ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-transparent border-slate-200 text-slate-500 hover:border-primary-200'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <ImageIcon size={14} className="mr-2" /> รูปภาพประกอบ
                            </h3>
                        </div>
                        <div className="p-6">
                            <div onClick={() => featuredImageRef.current?.click()} className="aspect-[16/10] bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group">
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" /> : <PlusSquare className="text-slate-300 mb-2" size={32} />}
                            </div>
                            <input type="file" ref={featuredImageRef} className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
                            }} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <FileText size={14} className="mr-2" /> ไฟล์เอกสารหลักสูตร
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {existingDoc && !document && (
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center text-[10px] font-bold text-slate-500">
                                        <FileText size={16} className="mr-2 text-primary-500" /> ไฟล์เดิม
                                    </div>
                                    <a href={`${import.meta.env.VITE_API_URL}/storage/${existingDoc}`} target="_blank" className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><Download size={14} /></a>
                                </div>
                            )}
                            <div 
                                onClick={() => documentRef.current?.click()}
                                className={`w-full p-4 rounded-xl border flex items-center cursor-pointer transition-all ${document ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary-200'}`}
                            >
                                <FileText size={20} className="mr-3 shrink-0" />
                                <span className="text-xs font-bold truncate">{document ? document.name : "เปลี่ยนไฟล์เอกสาร"}</span>
                            </div>
                            <input type="file" ref={documentRef} className="hidden" accept=".pdf,.doc,.docx,.zip" onChange={(e) => setDocument(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
