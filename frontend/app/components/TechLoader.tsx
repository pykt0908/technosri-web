import { motion, AnimatePresence } from "framer-motion";

export default function TechLoader({ isVisible }: { isVisible: boolean }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none"
                >
                    {/* Top Progress Bar */}
                    <div className="h-[3px] bg-primary-900/10 w-full relative overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                ease: "linear" 
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent w-1/2"
                        ></motion.div>
                        <motion.div
                            className="absolute inset-0 bg-primary-500 shadow-[0_0_10px_rgba(30,162,255,0.8)]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        ></motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
