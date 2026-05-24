import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router";
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
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Calendar, FileText, X,
    GraduationCap, Minus, LayoutGrid, RowsIcon, Columns, Trash2, Plus
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

const HEADINGS = [
    { label: "ปกติ", level: 0 },
    { label: "หัวข้อ 1", level: 1 },
    { label: "หัวข้อ 2", level: 2 },
    { label: "หัวข้อ 3", level: 3 },
    { label: "หัวข้อ 4", level: 4 },
];

const MenuBar = ({ editor, imageInputRef }: { editor: any, imageInputRef: React.RefObject<HTMLInputElement | null> }) => {
    const [uploading, setUploading] = useState(false);

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

export default function NewsCreate() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [status, setStatus] = useState("draft");
    const [publishedAt, setPublishedAt] = useState("");
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const [metaTitle, setMetaTitle] = useState("");
    const [metaDesc, setMetaDesc] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const editorImageRef = useRef<HTMLInputElement>(null);

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        
        const newFiles = Array.from(files);
        setGalleryImages(prev => [...prev, ...newFiles]);
        
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    useEffect(() => {
        return () => {
            galleryPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [galleryPreviews]);

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .replace(/[^\u0E00-\u0E7Fa-z0-9 ]/g, '') // Keep Thai, English, Numbers
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        // Auto-generate slug if it's empty or was auto-generated from previous title
        if (!slug || slug === generateSlug(title)) {
            setSlug(generateSlug(val));
        }
    };

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
                class: 'prose prose-slate dark:prose-invert focus:outline-none max-w-none min-h-[600px] p-10 leading-relaxed tiptap-editor',
            },
        },
    });

    const handleSave = async () => {
        setValidationErrors({});
        if (!title || !editor?.getHTML()) {
            toast.error("กรุณาระบุหัวข้อและเนื้อหาข่าว");
            return;
        }

        const token = localStorage.getItem("admin_token");
        const formData = new FormData();
        formData.append("title", title);
        formData.append("slug", slug);
        formData.append("content", editor.getHTML());
        formData.append("status", status);
        if (publishedAt) {
            formData.append("published_at", publishedAt);
        }
        formData.append("meta_title", metaTitle);
        formData.append("meta_description", metaDesc);
        formData.append("meta_keywords", metaKeywords);
        
        if (featuredImage) {
            formData.append("featured_image", featuredImage);
        }

        if (galleryImages.length > 0) {
            galleryImages.forEach(file => {
                formData.append("gallery_images[]", file);
            });
        }

        const loadingToast = toast.loading("กำลังบันทึกข้อมูลข่าวสาร...");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/news`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("สร้างข่าวสารสำเร็จ", { id: loadingToast });
                navigate("/admin/news");
            } else if (res.status === 422) {
                console.log("Validation Errors:", data);
                toast.error("ข้อมูลไม่ถูกต้อง", { id: loadingToast });
                setValidationErrors(data.errors || {});
            } else {
                toast.error(data.message || "บันทึกไม่สำเร็จ", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ", { id: loadingToast });
        }
    };

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
                .tiptap-editor { white-space: pre-wrap !important; }
                .tiptap-editor p { min-height: 1.5rem; margin-bottom: 1.25rem; }
                .tiptap-editor table { width: 100% !important; border-collapse: collapse !important; margin: 1.5rem 0 !important; border: none !important; }
                .tiptap-editor td p, .tiptap-editor th p { margin-bottom: 0 !important; }
                .tiptap-editor th { background-color: #f8fafc !important; padding: 10px 14px !important; font-weight: 700 !important; text-align: left !important; border-bottom: 2px solid #cbd5e1 !important; color: #0f172a !important; }
                .dark .tiptap-editor th { background-color: #1e293b !important; border-bottom-color: #334155 !important; }
                .tiptap-editor td { padding: 10px 14px !important; border-bottom: 1px solid #e2e8f0 !important; }
                .dark .tiptap-editor td { border-bottom-color: #1e293b !important; }
                .tiptap-editor tr:nth-child(even) { background-color: #f8fafc !important; }
                .dark .tiptap-editor tr:nth-child(even) { background-color: rgba(30, 41, 59, 0.5) !important; }
                .tiptap-editor hr { border-top: 1px solid #cbd5e1 !important; margin: 1.5rem 0 !important; opacity: 1 !important; }
                .dark .tiptap-editor hr { border-top-color: #334155 !important; }
            `}</style>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start">
                    <button onClick={() => navigate(-1)} className="mt-1 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg mr-6 text-slate-500 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                            <Tag size={10} className="mr-2" /> News Management
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">เขียนข่าวสารใหม่</h1>
                        <p className="text-sm text-slate-500 mt-1">สร้างเนื้อหาใหม่เพื่อประกาศให้บุคลากรและนักศึกษาได้รับทราบ</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 mt-6 md:mt-0">
                    <button onClick={() => setStatus(status === 'published' ? 'draft' : 'published')} className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold border transition-all ${status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${status === 'published' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                        สถานะ: {status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-600/20 flex items-center">
                        <Save size={16} className="mr-2" /> บันทึกข้อมูล
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">หัวข้อข่าวสาร</span>
                        </div>
                        <input type="text" placeholder="พิมพ์หัวข้อข่าวที่นี่..." value={title} onChange={handleTitleChange} className="w-full px-8 py-6 text-2xl font-bold bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white outline-none" />
                        {validationErrors.title && <p className="px-8 pb-4 text-xs text-red-500 font-bold italic">{validationErrors.title[0]}</p>}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เนื้อหาข่าวสาร</span>
                        </div>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
                            <MenuBar editor={editor} imageInputRef={editorImageRef} />
                            <EditorContent editor={editor} />
                        </div>
                        {validationErrors.content && <p className="px-8 pb-4 text-xs text-red-500 font-bold italic">{validationErrors.content[0]}</p>}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {/* Published Date Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Calendar size={14} className="mr-2" /> วันที่เผยแพร่
                            </h3>
                        </div>
                        <div className="p-6">
                            <input 
                                type="date" 
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Featured Image Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <ImageIcon size={14} className="mr-2" /> รูปภาพหน้าปก
                            </h3>
                        </div>
                        <div className="p-6">
                            <div onClick={() => document.getElementById('featured-upload-v3')?.click()} className="aspect-[16/9] bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" /> : <div className="text-center"><PlusSquare className="mx-auto text-slate-300 mb-2" size={32} /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">เลือกไฟล์รูปภาพ</span></div>}
                            </div>
                            <input type="file" id="featured-upload-v3" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) { setFeaturedImage(file); setImagePreview(URL.createObjectURL(file)); }
                            }} />
                            {validationErrors.featured_image && <p className="text-[10px] text-red-500 font-bold mt-2 italic">{validationErrors.featured_image[0]}</p>}
                        </div>
                    </div>

                    {/* Gallery Images Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <LayoutGrid size={14} className="mr-2 text-primary-500" /> คลังรูปภาพประกอบ (Gallery)
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div 
                                onClick={() => document.getElementById('gallery-upload-v3')?.click()} 
                                className="py-8 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-all group"
                            >
                                <PlusSquare className="text-slate-300 group-hover:text-primary-500 transition-colors mb-2" size={32} />
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest transition-colors">อัปโหลดรูปภาพหลายไฟล์</span>
                                <span className="text-[8px] text-slate-400 mt-1 font-semibold">คลิกเพื่อเลือกหลายไฟล์พร้อมกัน</span>
                            </div>
                            <input 
                                type="file" 
                                id="gallery-upload-v3" 
                                className="hidden" 
                                accept="image/*" 
                                multiple 
                                onChange={handleGalleryChange} 
                            />

                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2.5 pt-2">
                                    {galleryPreviews.map((previewUrl, idx) => (
                                        <div key={idx} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative group border border-slate-100 dark:border-slate-700 shadow-sm animate-fade-in">
                                            <img src={previewUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt={`Preview ${idx + 1}`} />
                                            <button 
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)} 
                                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/85 hover:bg-red-600 text-white flex items-center justify-center active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                                                title="ลบรูปภาพนี้"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO & URL Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Link2 size={14} className="mr-2" /> URL & SEO
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Custom Slug</label>
                                <input 
                                    type="text" 
                                    placeholder="เช่น stc-new-building"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${validationErrors.slug ? 'border-red-300' : 'border-slate-100 dark:border-slate-700'} rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary-500 outline-none`}
                                />
                                {validationErrors.slug && <p className="text-[10px] text-red-500 font-bold mt-1 italic">{validationErrors.slug[0]}</p>}
                            </div>
                            <div className="pt-2 space-y-5 border-t border-slate-100 dark:border-slate-800">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEO Title</label>
                                    <input 
                                        type="text" 
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-medium outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEO Description</label>
                                    <textarea 
                                        rows={3}
                                        value={metaDesc}
                                        onChange={(e) => setMetaDesc(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-medium outline-none resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
