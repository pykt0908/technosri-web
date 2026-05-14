import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, ChevronRight } from "lucide-react";
import { Link } from "react-router";

export default function PDPAConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("pdpa_consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("pdpa_consent", "true");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:max-w-md z-[9999]"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl opacity-50"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mr-4">
                                    <ShieldCheck size={24} />
                                </div>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">PDPA Consent</h4>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                เว็บไซต์นี้มีการใช้คุกกี้เพื่อเพิ่มประสิทธิภาพในการใช้งาน 
                                และให้ข้อมูลข่าวสารที่ตรงกับความสนใจของคุณ 
                                การใช้งานเว็บไซต์ต่อไปถือว่าคุณยอมรับ
                                <Link to="/privacy-policy" className="text-primary-600 hover:underline mx-1 font-bold">นโยบายความเป็นส่วนตัว</Link> 
                                ของเรา
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 px-8 py-4 bg-slate-900 dark:bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-primary-700 transition-all shadow-xl shadow-slate-900/10 dark:shadow-primary-600/20"
                                >
                                    ยอมรับทั้งหมด
                                </button>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    ปิดหน้าต่าง
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
