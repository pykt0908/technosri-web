import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

export default function HomePopup() {
    const { settings, loading, getStorageUrl } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup after a short delay if active and has image
        if (!loading && settings.popup_active === "1" && settings.popup_image) {
            const frequency = settings.popup_frequency || "once";
            const hasSeenPopup = sessionStorage.getItem("has_seen_popup");

            if (frequency === "always" || !hasSeenPopup) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    if (frequency === "once") {
                        sessionStorage.setItem("has_seen_popup", "true");
                    }
                }, 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [loading, settings]);

    if (loading || !settings.popup_image || settings.popup_active !== "1") return null;

    const sizeMap: { [key: string]: string } = {
        sm: "max-w-[400px]",
        md: "max-w-[600px]",
        lg: "max-w-[900px]"
    };

    const popupSizeClass = sizeMap[settings.popup_size || "md"] || sizeMap.md;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative ${popupSizeClass} w-full bg-white dark:bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl`}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all"
                            aria-label="Close popup"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        <div className="relative group">
                            {settings.popup_link ? (
                                <a 
                                    href={settings.popup_link} 
                                    target={settings.popup_target || "_blank"} 
                                    rel="noopener noreferrer" 
                                    className="block relative"
                                >
                                    <img 
                                        src={getStorageUrl(settings.popup_image) || ""} 
                                        alt="Promotion Popup" 
                                        className="w-full h-auto block"
                                    />
                                    <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-black uppercase tracking-widest text-[10px] border border-white/30 flex items-center">
                                            <ExternalLink size={14} className="mr-2" />
                                            ดูรายละเอียดเพิ่มเติม
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                <img 
                                    src={getStorageUrl(settings.popup_image) || ""} 
                                    alt="Information Popup" 
                                    className="w-full h-auto block"
                                />
                            )}
                        </div>
                    </motion.div>

                    {/* Backdrop click to close */}
                    <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)}></div>
                </div>
            )}
        </AnimatePresence>
    );
}
