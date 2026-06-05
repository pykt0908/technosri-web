import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

interface HomePopupData {
    id: number;
    title: string | null;
    image_path: string;
    link_url: string | null;
    link_target: "_self" | "_blank";
    sort_order: number;
    is_active: boolean;
    popup_size: "sm" | "md" | "lg";
    frequency: "once" | "always";
}

export default function HomePopup() {
    const { getStorageUrl } = useSettings();
    const [popups, setPopups] = useState<HomePopupData[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivePopups = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/popups/active`);
                const data = await res.json();
                
                // Filter popups by frequency 'once' check in sessionStorage
                const seenIds = JSON.parse(sessionStorage.getItem("seen_popup_ids") || "[]");
                const unseen = data.filter((item: HomePopupData) => {
                    if (item.frequency === "once") {
                        return !seenIds.includes(item.id);
                    }
                    return true;
                });

                setPopups(unseen);
                if (unseen.length > 0) {
                    setCurrentIndex(0);
                }
            } catch (err) {
                console.error("Failed to fetch popups:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivePopups();
    }, []);

    useEffect(() => {
        if (!loading && popups.length > 0 && currentIndex >= 0 && currentIndex < popups.length) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [loading, popups, currentIndex]);

    if (loading || popups.length === 0 || currentIndex < 0 || currentIndex >= popups.length) return null;

    const currentPopup = popups[currentIndex];

    const sizeMap: { [key: string]: string } = {
        sm: "max-w-[400px]",
        md: "max-w-[600px]",
        lg: "max-w-[900px]"
    };

    const popupSizeClass = sizeMap[currentPopup.popup_size || "md"] || sizeMap.md;

    const handleClose = () => {
        setIsOpen(false);
        
        // After closing animation completes (300ms matches Framer exit duration), advance to next popup
        setTimeout(() => {
            // Save seen status if once
            if (currentPopup.frequency === "once") {
                const seenIds = JSON.parse(sessionStorage.getItem("seen_popup_ids") || "[]");
                if (!seenIds.includes(currentPopup.id)) {
                    sessionStorage.setItem("seen_popup_ids", JSON.stringify([...seenIds, currentPopup.id]));
                }
            }

            setCurrentIndex(prev => prev + 1);
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/60 backdrop-blur-sm">
                    <div className="min-h-full flex justify-center items-center p-6 relative">
                        <div className="absolute inset-0" onClick={handleClose} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className={`relative ${popupSizeClass} w-full bg-white dark:bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl my-8 z-10`}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={handleClose}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all"
                                aria-label="Close popup"
                            >
                                <X size={20} />
                            </button>

                            {/* Content */}
                            <div className="relative group">
                                {currentPopup.link_url ? (
                                    <a 
                                        href={currentPopup.link_url} 
                                        target={currentPopup.link_target || "_blank"} 
                                        rel="noopener noreferrer" 
                                        className="block relative"
                                        onClick={() => {
                                            if (currentPopup.link_target === "_self") {
                                                handleClose();
                                            }
                                        }}
                                    >
                                        <img 
                                            src={getStorageUrl(currentPopup.image_path) || ""} 
                                            alt={currentPopup.title || "Promotion Popup"} 
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
                                        src={getStorageUrl(currentPopup.image_path) || ""} 
                                        alt={currentPopup.title || "Information Popup"} 
                                        className="w-full h-auto block"
                                    />
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
