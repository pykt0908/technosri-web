import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 800);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 15) + 5;
            });
        }, 150);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0,
                        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-mono"
                >
                    {/* Background Grid/Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ 
                            backgroundImage: `radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)`,
                            backgroundSize: '40px 40px' 
                        }}
                    ></div>

                    {/* Scanning Line */}
                    <motion.div 
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-primary-500/30 blur-sm z-10"
                    ></motion.div>

                    {/* Main Tech Circle */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-primary-500/40 rounded-full"
                        ></motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-4 border border-primary-400/20 rounded-full border-t-primary-500"
                        ></motion.div>
                        
                        {/* Center Text */}
                        <div className="text-center z-20">
                            <motion.div 
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-primary-500 text-4xl font-black mb-2"
                            >
                                {Math.min(progress, 100)}%
                            </motion.div>
                            <div className="text-primary-400/60 text-[10px] tracking-[0.3em] uppercase">
                                System Syncing
                            </div>
                        </div>
                    </div>

                    {/* Sci-Fi Status Lines */}
                    <div className="absolute bottom-12 left-12 space-y-2 text-[10px] text-primary-500/40 uppercase tracking-widest hidden md:block">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                            <span>Core Integrity: 100%</span>
                        </div>
                        <div>Encryption: AES-256-GCM</div>
                        <div>Node: SRIRACHA-TECH-STC-01</div>
                    </div>

                    <div className="absolute bottom-12 right-12 text-right text-[10px] text-primary-500/40 uppercase tracking-widest hidden md:block">
                        <div>LAT: 13.1167° N</div>
                        <div>LNG: 100.9167° E</div>
                        <div>STC NEURAL NETWORK V4.0</div>
                    </div>

                    {/* Booting Text Container */}
                    <div className="mt-12 w-64">
                        <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden mb-4">
                            <motion.div 
                                className="h-full bg-primary-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            ></motion.div>
                        </div>
                        <div className="flex justify-between text-[10px] text-primary-400/80 uppercase">
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                Initializing...
                            </motion.span>
                            <span>SECURE_BOOT</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
