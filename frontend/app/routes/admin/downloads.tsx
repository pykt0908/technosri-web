import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
    Plus, 
    Edit, 
    Trash2, 
    Upload, 
    Folder, 
    FileText,
    File, 
    ArrowUp, 
    ArrowDown, 
    Search,
    ExternalLink,
    Loader2,
    ChevronRight
} from "lucide-react";

interface Category {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
}

interface DownloadFile {
    id: number;
    download_document_id: number;
    title: string;
    file_path: string;
    file_size: string | null;
    download_count: number;
    sort_order: number;
    created_at: string;
}

interface DownloadDocument {
    id: number;
    download_category_id: number;
    title: string;
    sort_order: number;
    files: DownloadFile[];
    created_at: string;
}

export default function AdminDownloads() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    
    const [documents, setDocuments] = useState<DownloadDocument[]>([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
    
    const [searchTerm, setSearchTerm] = useState("");

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingDocuments, setLoadingDocuments] = useState(false);

    // Modals state
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryModalMode, setCategoryModalMode] = useState<"create" | "edit">("create");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [categorySlug, setCategorySlug] = useState("");
    const [savingCategory, setSavingCategory] = useState(false);

    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [docModalMode, setDocModalMode] = useState<"create" | "edit">("create");
    const [editingDoc, setEditingDoc] = useState<DownloadDocument | null>(null);
    const [docTitle, setDocTitle] = useState("");
    const [savingDoc, setSavingDoc] = useState(false);

    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [fileModalMode, setFileModalMode] = useState<"create" | "edit">("create");
    const [editingFile, setEditingFile] = useState<DownloadFile | null>(null);
    const [fileTitle, setFileTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [savingFile, setSavingFile] = useState(false);

    // Initial Fetch
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch documents when category is selected
    useEffect(() => {
        if (selectedCategoryId !== null) {
            fetchDocuments(selectedCategoryId);
        } else {
            setDocuments([]);
            setSelectedDocumentId(null);
        }
    }, [selectedCategoryId]);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/categories`);
            const data = await res.json();
            setCategories(data);
            
            if (data.length > 0 && selectedCategoryId === null) {
                setSelectedCategoryId(data[0].id);
            }
        } catch (err) {
            toast.error("ไม่สามารถโหลดหมวดหมู่ได้");
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchDocuments = async (categoryId: number) => {
        setLoadingDocuments(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/categories/${categoryId}`);
            const data = await res.json();
            const docs = data.documents || [];
            setDocuments(docs);
            
            // Auto select first document if none selected or if previously selected is not in current list
            if (docs.length > 0) {
                if (selectedDocumentId === null || !docs.some((d: any) => d.id === selectedDocumentId)) {
                    setSelectedDocumentId(docs[0].id);
                }
            } else {
                setSelectedDocumentId(null);
            }
        } catch (err) {
            toast.error("ไม่สามารถโหลดฟอร์มเอกสารได้");
        } finally {
            setLoadingDocuments(false);
        }
    };

    // Category CRUD
    const handleOpenCategoryModal = (mode: "create" | "edit", category?: Category) => {
        setCategoryModalMode(mode);
        if (mode === "edit" && category) {
            setEditingCategory(category);
            setCategoryName(category.name);
            setCategorySlug(category.slug);
        } else {
            setEditingCategory(null);
            setCategoryName("");
            setCategorySlug("");
        }
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        setSavingCategory(true);
        const token = localStorage.getItem("admin_token");
        const isEdit = categoryModalMode === "edit";
        const url = isEdit 
            ? `${import.meta.env.VITE_API_URL}/api/downloads/categories/${editingCategory?.id}`
            : `${import.meta.env.VITE_API_URL}/api/downloads/categories`;
        
        try {
            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: categoryName,
                    slug: categorySlug || undefined
                })
            });

            if (res.ok) {
                const updatedCategory = await res.json();
                toast.success(isEdit ? "แก้ไขหมวดหมู่สำเร็จ" : "เพิ่มหมวดหมู่สำเร็จ");
                setIsCategoryModalOpen(false);
                fetchCategories().then(() => {
                    if (!isEdit) {
                        setSelectedCategoryId(updatedCategory.id);
                    }
                });
            } else {
                const data = await res.json();
                toast.error(data.message || "เกิดข้อผิดพลาดในการบันทึก");
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
        } finally {
            setSavingCategory(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("คุณต้องการลบหมวดหมู่นี้และเอกสาร/ไฟล์ทั้งหมดที่อยู่ภายใต้หมวดหมู่นี้ใช่หรือไม่? การลบนี้จะไม่สามารถย้อนกลับได้")) return;

        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading("กำลังลบหมวดหมู่และข้อมูลที่เกี่ยวข้อง...");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (res.ok) {
                toast.success("ลบหมวดหมู่สำเร็จ", { id: loadingToast });
                if (selectedCategoryId === id) {
                    setSelectedCategoryId(null);
                }
                fetchCategories();
            } else {
                toast.error("ไม่สามารถลบหมวดหมู่ได้", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ", { id: loadingToast });
        }
    };

    const handleMoveCategory = async (index: number, direction: "up" | "down") => {
        const newCategories = [...categories];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newCategories.length) return;

        // Swap locally
        const temp = newCategories[index];
        newCategories[index] = newCategories[targetIndex];
        newCategories[targetIndex] = temp;
        setCategories(newCategories);

        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/categories/reorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ order: newCategories.map(c => c.id) })
            });
        } catch (err) {
            toast.error("ไม่สามารถบันทึกลำดับหมวดหมู่ใหม่ได้");
        }
    };

    // Document CRUD
    const handleOpenDocModal = (mode: "create" | "edit", doc?: DownloadDocument) => {
        setDocModalMode(mode);
        if (mode === "edit" && doc) {
            setEditingDoc(doc);
            setDocTitle(doc.title);
        } else {
            setEditingDoc(null);
            setDocTitle("");
        }
        setIsDocModalOpen(true);
    };

    const handleSaveDoc = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!docTitle.trim() || selectedCategoryId === null) return;

        setSavingDoc(true);
        const token = localStorage.getItem("admin_token");
        const isEdit = docModalMode === "edit";
        const url = isEdit 
            ? `${import.meta.env.VITE_API_URL}/api/downloads/documents/${editingDoc?.id}`
            : `${import.meta.env.VITE_API_URL}/api/downloads/documents`;
        
        try {
            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    download_category_id: selectedCategoryId,
                    title: docTitle
                })
            });

            if (res.ok) {
                const updatedDoc = await res.json();
                toast.success(isEdit ? "แก้ไขชื่อฟอร์มสำเร็จ" : "เพิ่มฟอร์มเอกสารสำเร็จ");
                setIsDocModalOpen(false);
                fetchDocuments(selectedCategoryId).then(() => {
                    if (!isEdit) {
                        setSelectedDocumentId(updatedDoc.id);
                    }
                });
            } else {
                toast.error("เกิดข้อผิดพลาดในการบันทึกฟอร์ม");
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
        } finally {
            setSavingDoc(false);
        }
    };

    const handleDeleteDoc = async (id: number) => {
        if (!confirm("คุณต้องการลบฟอร์มนี้และไฟล์แนบทั้งหมดของฟอร์มนี้ใช่หรือไม่?")) return;

        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading("กำลังลบฟอร์มและไฟล์...");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/documents/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (res.ok) {
                toast.success("ลบฟอร์มสำเร็จ", { id: loadingToast });
                if (selectedDocumentId === id) {
                    setSelectedDocumentId(null);
                }
                if (selectedCategoryId !== null) {
                    fetchDocuments(selectedCategoryId);
                }
            } else {
                toast.error("ไม่สามารถลบฟอร์มได้", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ", { id: loadingToast });
        }
    };

    const handleMoveDoc = async (index: number, direction: "up" | "down") => {
        const newDocs = [...documents];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newDocs.length) return;

        // Swap locally
        const temp = newDocs[index];
        newDocs[index] = newDocs[targetIndex];
        newDocs[targetIndex] = temp;
        setDocuments(newDocs);

        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/documents/reorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ order: newDocs.map(d => d.id) })
            });
        } catch (err) {
            toast.error("ไม่สามารถบันทึกลำดับฟอร์มใหม่ได้");
        }
    };

    // Files CRUD
    const handleOpenFileModal = (mode: "create" | "edit", file?: DownloadFile) => {
        setFileModalMode(mode);
        setSelectedFile(null);
        if (mode === "edit" && file) {
            setEditingFile(file);
            setFileTitle(file.title);
        } else {
            setEditingFile(null);
            setFileTitle("");
        }
        setIsFileModalOpen(true);
    };

    const handleSaveFile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileTitle.trim() || selectedDocumentId === null) return;
        if (fileModalMode === "create" && !selectedFile) {
            toast.error("กรุณาเลือกไฟล์รูปแบบที่ต้องการอัปโหลด");
            return;
        }

        setSavingFile(true);
        const token = localStorage.getItem("admin_token");
        const isEdit = fileModalMode === "edit";
        const url = isEdit
            ? `${import.meta.env.VITE_API_URL}/api/downloads/files/${editingFile?.id}`
            : `${import.meta.env.VITE_API_URL}/api/downloads/files`;

        const formData = new FormData();
        formData.append("download_document_id", String(selectedDocumentId));
        formData.append("title", fileTitle);
        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        if (isEdit) {
            formData.append("_method", "PUT");
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: formData
            });

            if (res.ok) {
                toast.success(isEdit ? "แก้ไขรายละเอียดไฟล์สำเร็จ" : "แนบไฟล์รูปแบบสำเร็จ");
                setIsFileModalOpen(false);
                if (selectedCategoryId !== null) {
                    fetchDocuments(selectedCategoryId);
                }
            } else {
                const data = await res.json();
                toast.error(data.message || "เกิดข้อผิดพลาดในการบันทึกไฟล์");
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
        } finally {
            setSavingFile(false);
        }
    };

    const handleDeleteFile = async (id: number) => {
        if (!confirm("คุณต้องการลบไฟล์แนบรูปแบบนี้ใช่หรือไม่?")) return;

        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading("กำลังลบไฟล์...");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/files/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (res.ok) {
                toast.success("ลบไฟล์แนบสำเร็จ", { id: loadingToast });
                if (selectedCategoryId !== null) {
                    fetchDocuments(selectedCategoryId);
                }
            } else {
                toast.error("ไม่สามารถลบไฟล์แนบได้", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ", { id: loadingToast });
        }
    };

    const handleMoveFile = async (docId: number, index: number, direction: "up" | "down") => {
        const doc = documents.find(d => d.id === docId);
        if (!doc) return;

        const newFiles = [...doc.files];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newFiles.length) return;

        // Swap locally
        const temp = newFiles[index];
        newFiles[index] = newFiles[targetIndex];
        newFiles[targetIndex] = temp;

        // Optimistically update documents state
        setDocuments(prevDocs =>
            prevDocs.map(d => d.id === docId ? { ...d, files: newFiles } : d)
        );

        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/downloads/files/reorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ order: newFiles.map(f => f.id) })
            });
        } catch (err) {
            toast.error("ไม่สามารถบันทึกลำดับไฟล์ใหม่ได้");
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedDoc = documents.find(d => d.id === selectedDocumentId);
    const files = selectedDoc ? selectedDoc.files : [];

    return (
        <div className="max-w-[1600px] mx-auto pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 dark:border-slate-800 pb-8 mb-10">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <Upload size={10} className="mr-2 animate-pulse" /> ระบบจัดการเอกสารดาวน์โหลด
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการระบบดาวน์โหลดเอกสาร</h1>
                </div>
            </header>

            {/* Split 3-Pane Dashboard Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Panel 1: Categories Management (3/12 width) */}
                <div className="xl:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-black text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950 text-primary-650 dark:text-primary-400 text-[10px] font-black mr-2">1</span>
                            <Folder className="mr-2 text-slate-400" size={16} /> หมวดหมู่ย่อย
                        </h2>
                        <button
                            onClick={() => handleOpenCategoryModal("create")}
                            className="p-1.5 bg-primary-50 hover:bg-primary-100 text-primary-600 dark:bg-primary-950/40 dark:hover:bg-primary-950/60 rounded-xl transition-all flex items-center text-[10px] font-bold"
                            title="เพิ่มหมวดหมู่ใหม่"
                        >
                            <Plus size={14} className="mr-0.5" /> เพิ่ม
                        </button>
                    </div>

                    {loadingCategories ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-primary-500" size={20} />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {categories.map((cat, index) => {
                                const isSelected = cat.id === selectedCategoryId;
                                return (
                                    <div
                                        key={cat.id}
                                        onClick={() => setSelectedCategoryId(cat.id)}
                                        className={`group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all duration-200 ${
                                            isSelected
                                                ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white border-primary-600 shadow-md shadow-primary-500/15"
                                                : "bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-350 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:-translate-x-1"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2 truncate">
                                            <Folder className={isSelected ? "text-white" : "text-slate-450 group-hover:text-primary-500"} size={15} />
                                            <div className="truncate">
                                                <p className="font-bold text-xs truncate">{cat.name}</p>
                                                <p className={`text-[9px] font-mono ${isSelected ? "text-primary-100" : "text-slate-400"}`}>/{cat.slug}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Move buttons */}
                                            <button
                                                disabled={index === 0}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveCategory(index, "up");
                                                }}
                                                className="p-0.5 text-slate-450 hover:text-white rounded disabled:opacity-20"
                                            >
                                                <ArrowUp size={12} />
                                            </button>
                                            <button
                                                disabled={index === categories.length - 1}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveCategory(index, "down");
                                                }}
                                                className="p-0.5 text-slate-455 hover:text-white rounded disabled:opacity-20"
                                            >
                                                <ArrowDown size={12} />
                                            </button>

                                            {/* Action buttons */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenCategoryModal("edit", cat);
                                                }}
                                                className="p-1 rounded hover:bg-slate-700 text-blue-500 hover:text-blue-400"
                                            >
                                                <Edit size={11} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCategory(cat.id);
                                                }}
                                                className="p-1 rounded hover:bg-slate-700 text-red-500 hover:text-red-400"
                                            >
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {categories.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-[10px] font-bold bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200">
                                    ยังไม่มีหมวดหมู่ย่อย
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Panel 2: Documents/Forms Container (4/12 width) */}
                <div className="xl:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
                    {selectedCategoryId === null ? (
                        <div className="text-center py-20 text-slate-400 text-xs font-bold">
                            เลือกหมวดหมู่เพื่อจัดการรายการฟอร์ม
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-sm font-black text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950 text-primary-650 dark:text-primary-400 text-[10px] font-black mr-2">2</span>
                                    <FileText className="mr-2 text-primary-500 animate-pulse" size={16} /> รายชื่อฟอร์ม / เอกสาร
                                </h2>
                                <button
                                    onClick={() => handleOpenDocModal("create")}
                                    className="p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all flex items-center text-[10px] font-black uppercase tracking-wider"
                                >
                                    <Plus size={14} className="mr-0.5" /> เพิ่มฟอร์ม
                                </button>
                            </div>

                            {/* Search Document Bar */}
                            <div className="mb-4 relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <Search size={14} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="ค้นหารายชื่อฟอร์มเอกสาร..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-[11px] font-bold text-slate-700 dark:text-white"
                                />
                            </div>

                            {loadingDocuments ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader2 className="animate-spin text-primary-500" size={24} />
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                                    {filteredDocuments.map((doc, index) => {
                                        const isSelected = doc.id === selectedDocumentId;
                                        return (
                                            <div
                                                key={doc.id}
                                                onClick={() => setSelectedDocumentId(doc.id)}
                                                className={`group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all duration-200 ${
                                                    isSelected
                                                        ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white border-primary-600 shadow-md shadow-primary-500/15"
                                                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-350 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:-translate-x-1"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3 truncate flex-1 min-w-0">
                                                    <FileText className={isSelected ? "text-white" : "text-slate-450"} size={16} />
                                                    <div className="truncate">
                                                        <p className={`font-bold text-xs truncate ${isSelected ? "text-white" : "text-slate-800 dark:text-slate-100 group-hover:text-primary-500 dark:group-hover:text-primary-400"}`}>{doc.title}</p>
                                                        <p className={`text-[9px] font-bold mt-0.5 ${isSelected ? "text-primary-100" : "text-slate-400"}`}>มีไฟล์แนบอยู่: {doc.files.length} รูปแบบ</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                    {/* Move buttons */}
                                                    <button
                                                        disabled={index === 0}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMoveDoc(index, "up");
                                                        }}
                                                        className="p-0.5 text-slate-400 hover:text-white rounded disabled:opacity-20"
                                                    >
                                                        <ArrowUp size={12} />
                                                    </button>
                                                    <button
                                                        disabled={index === documents.length - 1}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMoveDoc(index, "down");
                                                        }}
                                                        className="p-0.5 text-slate-400 hover:text-white rounded disabled:opacity-20"
                                                    >
                                                        <ArrowDown size={12} />
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenDocModal("edit", doc);
                                                        }}
                                                        className="p-1 rounded text-blue-500 hover:text-blue-400"
                                                        title="แก้ไขชื่อฟอร์ม"
                                                    >
                                                        <Edit size={11} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteDoc(doc.id);
                                                        }}
                                                        className="p-1 rounded text-red-500 hover:text-red-400"
                                                        title="ลบฟอร์ม"
                                                    >
                                                        <Trash2 size={11} />
                                                    </button>
                                                    <ChevronRight size={14} className="text-slate-400" />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {filteredDocuments.length === 0 && (
                                        <div className="text-center py-16 text-slate-400 text-xs font-bold">
                                            ยังไม่มีฟอร์มเอกสารในหมวดหมู่นี้
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Panel 3: Attached Form Formats/Files (5/12 width) */}
                <div className="xl:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
                    {selectedDocumentId === null ? (
                        <div className="text-center py-20 text-slate-400 text-xs font-bold">
                            เลือกรายชื่อฟอร์มตรงกลางเพื่อบริหารจัดการอัปโหลดไฟล์รูปแบบ (.pdf, .docx, .zip)
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="truncate flex-1 min-w-0 mr-4">
                                    <h2 className="text-sm font-black text-slate-800 dark:text-white flex items-center truncate">
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950 text-primary-650 dark:text-primary-400 text-[10px] font-black mr-2">3</span>
                                        ไฟล์รูปแบบของฟอร์ม:
                                    </h2>
                                    <p className="text-[11px] font-black text-primary-650 dark:text-primary-400 truncate mt-1.5 pl-7">
                                        {selectedDoc?.title}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleOpenFileModal("create")}
                                    className="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all flex items-center text-[10px] font-black uppercase tracking-wider flex-shrink-0 shadow-lg shadow-primary-500/10"
                                >
                                    <Upload size={13} className="mr-1.5" /> แนบไฟล์รูปแบบใหม่
                                </button>
                            </div>

                            {/* Files Table List */}
                            <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                <table className="w-full text-left text-[11px] border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[9px] text-slate-400 uppercase font-black tracking-widest">
                                            <th className="px-4 py-3">รายละเอียดรูปแบบ</th>
                                            <th className="px-4 py-3 text-center">สถิติ</th>
                                            <th className="px-4 py-3 text-center">เรียง</th>
                                            <th className="px-4 py-3 text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60 font-semibold">
                                        {files.map((file, index) => (
                                            <tr key={file.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/35 transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center space-x-2.5 max-w-[220px] truncate">
                                                        <File className="text-slate-400 dark:text-slate-500 flex-shrink-0" size={15} />
                                                        <div className="truncate">
                                                            <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{file.title}</p>
                                                            <a 
                                                                href={`${import.meta.env.VITE_API_URL}/storage/${file.file_path}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-[9px] text-primary-600 hover:text-primary-750 font-bold hover:underline inline-flex items-center mt-1 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-md w-fit border border-primary-100 dark:border-primary-900/60 transition-colors"
                                                            >
                                                                <ExternalLink size={9} className="mr-1" /> เปิดดูไฟล์แนบ
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-center font-mono text-[9px] text-slate-400">
                                                    <p className="font-bold text-slate-500">{file.file_size || "N/A"}</p>
                                                    <p className="mt-0.5">{file.download_count} ครั้ง</p>
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <div className="inline-flex flex-col sm:flex-row items-center gap-0.5">
                                                        <button
                                                            disabled={index === 0}
                                                            onClick={() => handleMoveFile(selectedDocumentId, index, "up")}
                                                            className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 text-slate-400 hover:text-primary-500"
                                                        >
                                                            <ArrowUp size={11} />
                                                        </button>
                                                        <button
                                                            disabled={index === files.length - 1}
                                                            onClick={() => handleMoveFile(selectedDocumentId, index, "down")}
                                                            className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 text-slate-400 hover:text-primary-500"
                                                        >
                                                            <ArrowDown size={11} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <div className="flex justify-center space-x-1">
                                                        <button
                                                            onClick={() => handleOpenFileModal("edit", file)}
                                                            className="w-7 h-7 flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                                            title="แก้ไขชื่อรูปแบบ"
                                                        >
                                                            <Edit size={11} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFile(file.id)}
                                                            className="w-7 h-7 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                            title="ลบไฟล์แนบ"
                                                        >
                                                            <Trash2 size={11} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {files.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="py-12 text-center text-slate-400 font-bold italic">
                                                    ยังไม่มีการอัปโหลดรูปแบบไฟล์แนบสำหรับฟอร์มนี้
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Category Add/Edit Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10">
                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-6 flex items-center">
                            {categoryModalMode === "edit" ? "แก้ไขหมวดหมู่เอกสาร" : "เพิ่มหมวดหมู่ใหม่"}
                        </h3>
                        <form onSubmit={handleSaveCategory} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">ชื่อหมวดหมู่</label>
                                <input
                                    type="text"
                                    required
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="เช่น เอกสารหมวดหมู่1, ใบสมัครเรียน"
                                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Slug (URL ของหมวดหมู่)</label>
                                <input
                                    type="text"
                                    value={categorySlug}
                                    onChange={(e) => setCategorySlug(e.target.value)}
                                    placeholder="หากว่างไว้ ระบบจะสร้างให้อัตโนมัติ"
                                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingCategory}
                                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex justify-center items-center"
                                >
                                    {savingCategory ? <Loader2 className="animate-spin text-white mr-2" size={14} /> : null}
                                    <span>บันทึก</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Document Add/Edit Modal */}
            {isDocModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDocModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10">
                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-6 flex items-center">
                            {docModalMode === "edit" ? "แก้ไขชื่อฟอร์มเอกสาร" : "เพิ่มฟอร์มเอกสารใหม่"}
                        </h3>
                        <form onSubmit={handleSaveDoc} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">ชื่อฟอร์ม / รายการเอกสาร</label>
                                <input
                                    type="text"
                                    required
                                    value={docTitle}
                                    onChange={(e) => setDocTitle(e.target.value)}
                                    placeholder="เช่น ใบสมัครเรียน ปวช. ประจำปีการศึกษา 2569"
                                    className="w-full bg-slate-50 dark:bg-slate-855 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsDocModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingDoc}
                                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex justify-center items-center"
                                >
                                    {savingDoc ? <Loader2 className="animate-spin text-white mr-2" size={14} /> : null}
                                    <span>บันทึก</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* File Add/Edit Modal */}
            {isFileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFileModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10">
                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-6 flex items-center">
                            {fileModalMode === "edit" ? "แก้ไขข้อมูลไฟล์รูปแบบ" : "แนบไฟล์รูปแบบใหม่"}
                        </h3>
                        <form onSubmit={handleSaveFile} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">ชื่อรูปแบบ / ฟอร์แมตไฟล์</label>
                                <input
                                    type="text"
                                    required
                                    value={fileTitle}
                                    onChange={(e) => setFileTitle(e.target.value)}
                                    placeholder="เช่น ดาวน์โหลดไฟล์ PDF, ไฟล์สำหรับ Microsoft Word (.docx)"
                                    className="w-full bg-slate-50 dark:bg-slate-855 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {fileModalMode === "create" ? (
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">เลือกไฟล์เอกสาร (จำกัดไม่เกิน 20MB)</label>
                                    <input
                                        type="file"
                                        required
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setSelectedFile(e.target.files[0]);
                                            }
                                        }}
                                        accept=".pdf,.docx,.doc,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg"
                                        className="w-full bg-slate-50 dark:bg-slate-855 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-550 dark:text-slate-400 outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">เปลี่ยนไฟล์เอกสาร (ปล่อยว่างไว้หากต้องการใช้ไฟล์เดิม)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setSelectedFile(e.target.files[0]);
                                            }
                                        }}
                                        accept=".pdf,.docx,.doc,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg"
                                        className="w-full bg-slate-50 dark:bg-slate-855 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-550 dark:text-slate-400 outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <p className="text-[9px] text-slate-450 font-bold mt-1.5 italic">ไฟล์เดิม: /storage/{editingFile?.file_path}</p>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsFileModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingFile}
                                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex justify-center items-center"
                                >
                                    {savingFile ? <Loader2 className="animate-spin text-white mr-2" size={14} /> : null}
                                    <span>บันทึก</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
