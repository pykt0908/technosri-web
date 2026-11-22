import { useState, useEffect } from "react";
import { 
    Camera, Plus, Edit2, Trash2, Save, X, Loader2, 
    ExternalLink, Search, Calendar, Eye, Sparkles, 
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface ActivityAlbum {
    id: number;
    title: string;
    description: string | null;
    cover_image: string | null;
    google_photo_url: string;
    event_date: string | null;
    category?: string | null;
    status: "draft" | "published";
    views: number;
    sort_order: number;
    created_at: string;
}

export default function AdminGallery() {
    const [albums, setAlbums] = useState<ActivityAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [modal, setModal] = useState<{ show: boolean; data?: ActivityAlbum }>({ show: false });
    const [isSaving, setIsSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Form inputs
    const [formTitle, setFormTitle] = useState("");
    const [formGoogleUrl, setFormGoogleUrl] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formEventDate, setFormEventDate] = useState("");
    const [formStatus, setFormStatus] = useState<"draft" | "published">("published");
    const [formSortOrder, setFormSortOrder] = useState<number>(0);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/activity-albums`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setAlbums(data);
        } catch (err) {
            toast.error("โหลดข้อมูลอัลบั้มล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setFormTitle("");
        setFormGoogleUrl("");
        setFormDescription("");
        setFormEventDate(new Date().toISOString().split("T")[0]);
        setFormStatus("published");
        setFormSortOrder(0);
        setCoverFile(null);
        setPreviewImage(null);
        setModal({ show: true });
    };

    const handleOpenEditModal = (album: ActivityAlbum) => {
        setFormTitle(album.title);
        setFormGoogleUrl(album.google_photo_url);
        setFormDescription(album.description || "");
        setFormEventDate(album.event_date ? album.event_date.split("T")[0] : "");
        setFormStatus(album.status);
        setFormSortOrder(album.sort_order || 0);
        setCoverFile(null);
        setPreviewImage(album.cover_image ? `${import.meta.env.VITE_API_URL}/storage/${album.cover_image}` : null);
        setModal({ show: true, data: album });
    };

    const handleCloseModal = () => {
        setModal({ show: false });
        setCoverFile(null);
        setPreviewImage(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle.trim()) {
            toast.error("กรุณากรอกชื่อกิจกรรม/อัลบั้ม");
            return;
        }
        if (!formGoogleUrl.trim()) {
            toast.error("กรุณากรอกลิงก์ Google Photos");
            return;
        }

        setIsSaving(true);
        const token = localStorage.getItem("admin_token");
        const formData = new FormData();
        formData.append("title", formTitle.trim());
        formData.append("google_photo_url", formGoogleUrl.trim());
        formData.append("description", formDescription.trim());
        if (formEventDate) {
            formData.append("event_date", formEventDate);
        }
        formData.append("status", formStatus);
        formData.append("sort_order", formSortOrder.toString());

        if (coverFile) {
            formData.append("cover_image", coverFile);
        }

        try {
            const isEdit = Boolean(modal.data);
            const url = isEdit 
                ? `${import.meta.env.VITE_API_URL}/api/admin/activity-albums/${modal.data!.id}`
                : `${import.meta.env.VITE_API_URL}/api/admin/activity-albums`;

            if (isEdit) {
                formData.append("_method", "PUT");
            }

            const res = await fetch(url, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: formData
            });

            if (res.ok) {
                toast.success(isEdit ? "อัปเดตอัลบั้มภาพสำเร็จ" : "สร้างอัลบั้มภาพกิจกรรมสำเร็จ");
                handleCloseModal();
                fetchAlbums();
            } else {
                const errData = await res.json().catch(() => ({}));
                toast.error(errData.message || "บันทึกข้อมูลไม่สำเร็จ");
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบอัลบั้มภาพกิจกรรมนี้?")) return;

        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/activity-albums/${id}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (res.ok) {
                toast.success("ลบอัลบั้มภาพเรียบร้อยแล้ว");
                setAlbums(prev => prev.filter(a => a.id !== id));
            } else {
                toast.error("ลบไม่สำเร็จ");
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการลบ");
        }
    };

    const filteredAlbums = albums.filter(album => {
        const matchSearch = searchTerm.trim() === "" ||
            album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (album.description && album.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                        <Camera className="text-primary-500" size={26} />
                        จัดการอัลบั้มภาพกิจกรรม (Google Photos)
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        สร้างและจัดการลิงก์อัลบั้มรูปภาพกิจกรรมจาก Google Photos ให้นักเรียนและผู้ปกครองเข้าชมได้สะดวก
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                    <Plus size={18} />
                    <span>เพิ่มอัลบั้มภาพใหม่</span>
                </button>
            </div>

            {/* Filter / Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ค้นหาชื่อกิจกรรม..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                </div>

                <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Sparkles size={14} className="text-primary-500" />
                    <span>ทั้งหมด {albums.length} อัลบั้ม</span>
                </div>
            </div>

            {/* Albums List / Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="animate-spin mb-3 text-primary-500" size={32} />
                        <span className="text-xs font-bold">กำลังโหลดรายการอัลบั้มภาพ...</span>
                    </div>
                ) : filteredAlbums.length === 0 ? (
                    <div className="py-20 text-center">
                        <Camera className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={48} />
                        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">ไม่พบอัลบั้มภาพกิจกรรม</h3>
                        <p className="text-xs text-slate-400 mt-1">กดปุ่ม "เพิ่มอัลบั้มภาพใหม่" ด้านบนเพื่อเริ่มเพิ่มอัลบั้มแรก</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                                    <th className="py-4 px-6 w-20">หน้าปก</th>
                                    <th className="py-4 px-6">ชื่อกิจกรรม / อัลบั้ม</th>
                                    <th className="py-4 px-6">วันที่กิจกรรม</th>
                                    <th className="py-4 px-6">สถานะ</th>
                                    <th className="py-4 px-6">เข้าชม</th>
                                    <th className="py-4 px-6 text-center w-28">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                                {filteredAlbums.map((album) => (
                                    <tr key={album.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                        {/* Cover Image */}
                                        <td className="py-3 px-6">
                                            <div className="w-16 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200/60 dark:border-slate-700 shrink-0">
                                                {album.cover_image ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}/storage/${album.cover_image}`}
                                                        alt={album.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <Camera size={18} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Title & Link */}
                                        <td className="py-3 px-6">
                                            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">
                                                {album.title}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <a
                                                    href={album.google_photo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline"
                                                    title={album.google_photo_url}
                                                >
                                                    <span>เปิดดูอัลบั้ม Google Photos</span>
                                                    <ExternalLink size={11} />
                                                </a>
                                            </div>
                                        </td>

                                        {/* Event Date */}
                                        <td className="py-3 px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {album.event_date ? new Date(album.event_date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                album.status === "published"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400 border border-green-500/20"
                                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                            }`}>
                                                {album.status === "published" ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
                                            </span>
                                        </td>

                                        {/* Views */}
                                        <td className="py-3 px-6 text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1 font-bold">
                                                <Eye size={13} className="text-slate-400" />
                                                {album.views || 0}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-6">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(album)}
                                                    className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                                    title="แก้ไขข้อมูล"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(album.id)}
                                                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                                    title="ลบอัลบั้ม"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Dialog for Create/Edit */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-2">
                                    <Camera className="text-primary-500" size={20} />
                                    <span>{modal.data ? "แก้ไขอัลบั้มภาพกิจกรรม" : "เพิ่มอัลบั้มภาพกิจกรรมใหม่"}</span>
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Modal Form Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        ชื่องาน / กิจกรรม <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="เช่น กิจกรรมวันไหว้ครู ประจำปีการศึกษา 2567"
                                        className="w-full text-xs font-medium px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                {/* Google Photos URL */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            ลิงก์อัลบั้ม Google Photos <span className="text-red-500">*</span>
                                        </label>
                                        {formGoogleUrl && (
                                            <a
                                                href={formGoogleUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                            >
                                                ทดสอบเปิดลิงก์ <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        required
                                        value={formGoogleUrl}
                                        onChange={(e) => setFormGoogleUrl(e.target.value)}
                                        placeholder="https://photos.app.goo.gl/..."
                                        className="w-full text-xs font-mono px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                        กด "แชร์" ในอัลบั้ม Google Photos แล้วนำลิงก์ (Share link) มาวางที่นี่
                                    </p>
                                </div>

                                {/* Event Date */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        วันที่จัดกิจกรรม
                                    </label>
                                    <input
                                        type="date"
                                        value={formEventDate}
                                        onChange={(e) => setFormEventDate(e.target.value)}
                                        className="w-full text-xs font-medium px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                {/* Cover Image Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        รูปภาพหน้าปกอัลบั้ม (Cover Image)
                                    </label>
                                    <div 
                                        onClick={() => document.getElementById("album-cover-upload")?.click()}
                                        className="relative aspect-[16/9] w-full rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                                    >
                                        {previewImage ? (
                                            <>
                                                <img src={previewImage} alt="Cover preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                                    คลิกเพื่อเปลี่ยนรูปภาพ
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="text-slate-400 group-hover:text-primary-500 mb-2 transition-colors" size={32} />
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">คลิกเพื่ออัปโหลดรูปหน้าปก</span>
                                                <span className="text-[10px] text-slate-400 mt-1">รองรับ JPG, PNG, WebP สูงสุด 10MB</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="album-cover-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        คำอธิบายสั้นๆ (ถ้ามี)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        placeholder="ระบุรายละเอียดกิจกรรมสั้นๆ หรือสถานที่จัดงาน..."
                                        className="w-full text-xs font-medium p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        สถานะการเผยแพร่
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="published"
                                                checked={formStatus === "published"}
                                                onChange={() => setFormStatus("published")}
                                                className="text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">เผยแพร่ทันที (Published)</span>
                                        </label>
                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="draft"
                                                checked={formStatus === "draft"}
                                                onChange={() => setFormStatus("draft")}
                                                className="text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-xs font-bold text-slate-500">ฉบับร่าง (Draft)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-primary-500/25 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                <span>กำลังบันทึก...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                <span>บันทึกข้อมูล</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
