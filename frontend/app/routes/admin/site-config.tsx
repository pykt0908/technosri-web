import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface SiteSetting {
    id: number;
    key: string;
    value: string | null;
    group: string;
    label: string;
    type: string;
}

export default function AdminSettings() {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("enrollment");

    const tabs = [
        { id: "enrollment", label: "การรับสมัคร", icon: "fas fa-graduation-cap" },
        { id: "recruitment", label: "รับสมัครงาน", icon: "fas fa-briefcase" },
        { id: "contact", label: "ข้อมูลติดต่อ", icon: "fas fa-phone" },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            const data = await res.json();
            setSettings(data);
        } catch (err) {
            toast.error("โหลดข้อมูลไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    const handleValueChange = (key: string, value: string) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ settings: settings.map(s => ({ key: s.key, value: s.value })) })
            });

            if (res.ok) {
                toast.success("บันทึกการตั้งค่าเรียบร้อยแล้ว");
            } else {
                throw new Error();
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการบันทึก");
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (key: string, file: File) => {
        const formData = new FormData();
        formData.append("key", key);
        formData.append("file", file);

        const loadingToast = toast.loading("กำลังอัปโหลดรูปภาพ...");
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings/upload`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: formData
            });
            const data = await res.json();

            if (res.ok) {
                handleValueChange(key, data.path);
                toast.success("อัปโหลดสำเร็จ", { id: loadingToast });
            } else {
                const errorMsg = data.errors ? Object.values(data.errors).flat().join(", ") : (data.message || "อัปโหลดไม่สำเร็จ");
                toast.error(errorMsg, { id: loadingToast });
            }
        } catch (err) {
            toast.error("อัปโหลดไม่สำเร็จ", { id: loadingToast });
        }
    };

    const filteredSettings = settings.filter(s => s.group === activeTab);

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <header className="flex justify-between items-end mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <i className="fas fa-cog fa-spin-slow mr-2"></i> System Setting
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">การตั้งค่า</h1>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <i className="fas fa-save mr-2"></i>}
                    <span>บันทึกการตั้งค่าทั้งหมด</span>
                </button>
            </header>

            <div className="flex space-x-2 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl inline-flex">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                            ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                    >
                        <i className={`${tab.icon} mr-2`}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {loading ? (
                                <div className="py-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">กำลังโหลดข้อมูล...</div>
                            ) : filteredSettings.length > 0 ? (
                                filteredSettings.map(setting => (
                                    <div key={setting.key} className="group border-b border-slate-50 dark:border-slate-800/50 pb-8 last:border-0 last:pb-0">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="max-w-xs">
                                                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-1 uppercase tracking-tight">{setting.label}</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 mr-2">KEY:</span>
                                                    {setting.key}
                                                </p>
                                            </div>

                                            <div className="flex-1">
                                                {setting.type === 'text' || setting.type === 'textarea' ? (
                                                    <div className="relative">
                                                        {setting.type === 'textarea' ? (
                                                            <textarea
                                                                rows={3}
                                                                value={setting.value || ""}
                                                                onChange={(e) => handleValueChange(setting.key, e.target.value)}
                                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={setting.value || ""}
                                                                onChange={(e) => handleValueChange(setting.key, e.target.value)}
                                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                                            />
                                                        )}
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <i className={`fas ${setting.key.includes('link') ? 'fa-link' : 'fa-comment-alt'}`}></i>
                                                        </div>
                                                    </div>
                                                ) : setting.type === 'file' ? (
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-48 h-32 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                                            {setting.value ? (
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}/storage/${setting.value}`}
                                                                    className="w-full h-full object-cover"
                                                                    alt={setting.label}
                                                                />
                                                            ) : (
                                                                <i className="fas fa-image text-4xl text-slate-300"></i>
                                                            )}
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center space-x-2">
                                                                <label className="flex items-center space-x-2 bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-100 transition-all cursor-pointer">
                                                                    <i className="fas fa-upload mr-1"></i>
                                                                    <span>เลือกไฟล์รูปภาพ</span>
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => e.target.files && handleFileUpload(setting.key, e.target.files[0])}
                                                                    />
                                                                </label>
                                                                {setting.key === 'popup_image' && setting.value && (
                                                                    <button
                                                                        onClick={() => handleValueChange(setting.key, "")}
                                                                        className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
                                                                        title="ลบรูปภาพ"
                                                                    >
                                                                        <i className="fas fa-trash-alt"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase">PNG, JPG หรือ SVG (สูงสุด 2MB)</p>
                                                        </div>
                                                    </div>
                                                ) : setting.type === 'boolean' ? (
                                                    <button
                                                        onClick={() => handleValueChange(setting.key, setting.value === "1" ? "0" : "1")}
                                                        className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${setting.value === "1" ? "bg-primary-500" : "bg-slate-300 dark:bg-slate-700"}`}
                                                    >
                                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 transform ${setting.value === "1" ? "translate-x-6" : "translate-x-0"}`}></div>
                                                    </button>
                                                ) : setting.type === 'select' || setting.type === 'select_frequency' || setting.type === 'select_size' ? (
                                                    <select
                                                        value={setting.value || ""}
                                                        onChange={(e) => handleValueChange(setting.key, e.target.value)}
                                                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer pr-12"
                                                    >
                                                        {setting.type === 'select' ? (
                                                            <>
                                                                <option value="_self">เปิดในหน้าเดิม (_self)</option>
                                                                <option value="_blank">เปิดในแท็บใหม่ (_blank)</option>
                                                            </>
                                                        ) : setting.type === 'select_frequency' ? (
                                                            <>
                                                                <option value="once">แสดงผลเพียงครั้งเดียว (ต่อเซสชัน)</option>
                                                                <option value="always">แสดงผลทุกครั้งที่โหลดหน้าแรก</option>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <option value="sm">ขนาดเล็ก (Small)</option>
                                                                <option value="md">ขนาดกลาง (Medium)</option>
                                                                <option value="lg">ขนาดใหญ่ (Large)</option>
                                                            </>
                                                        )}
                                                    </select>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <i className="fas fa-exclamation-circle text-4xl text-slate-200 mb-4"></i>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">ไม่พบข้อมูลการตั้งค่าในหมวดนี้</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                        <i className="fas fa-info-circle"></i>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        ข้อมูลเหล่านี้จะถูกนำไปใช้ในส่วนหน้าบ้าน (Navbar, Contact, etc.) กรุณาตรวจสอบความถูกต้องก่อนบันทึก
                    </p>
                </div>
            </div>
        </div>
    );
}
