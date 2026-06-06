import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Lucide from "lucide-react";

const { 
    MapPin, 
    Bus, 
    Zap, 
    Wallet, 
    Languages, 
    Briefcase,
    Users,
    TrendingUp,
    CheckCircle2
} = Lucide;

const featuresLeft = [
    {
        title: "Lorem Ipsum",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        icon: <MapPin className="text-red-500" size={24} />,
        bgColor: "bg-red-50"
    },
    {
        title: "Lorem Ipsum",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        icon: <Bus className="text-blue-500" size={24} />,
        bgColor: "bg-blue-50"
    },
    {
        title: "Lorem Ipsum",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        icon: <Zap className="text-amber-500" size={24} />,
        bgColor: "bg-amber-50"
    }
];

const featuresRight = [
    {
        title: "Lorem Ipsum",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        icon: <Wallet className="text-yellow-500" size={24} />,
        bgColor: "bg-yellow-50"
    },
    {
        title: "Lorem Ipsum",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        icon: <Languages className="text-indigo-500" size={24} />,
        bgColor: "bg-indigo-50"
    },
    {
        title: "Lorem Ipsum",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        icon: <Briefcase className="text-slate-600" size={24} />,
        bgColor: "bg-slate-100"
    }
];

const students = [
    { src: "/images/student-1.png", x: "-35%", z: 25 },
    { src: "/images/student-2.png", x: "35%", z: 24 },
    { src: "/images/student-4.png", x: "-10%", z: 30 },
    { src: "/images/student-3.png", x: "10%", z: 20 }
];

export default function Success() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const interval = phase === 4 ? 10000 : 4000;
        const timer = setTimeout(() => {
            setPhase((prev) => (prev + 1) % 5);
        }, interval);
        return () => clearTimeout(timer);
    }, [phase]);

    // Smooth easing for a premium feel
    const smoothEase = [0.16, 1, 0.3, 1];

    return (
        <section className="py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
            {/* Optimized Background Animation - Reduced blur and simplified */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 45, 0],
                        x: [0, 50, 0],
                        y: [0, 20, 0]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-500/5 rounded-full blur-[80px] will-change-transform"
                />
                <motion.div 
                    animate={{ 
                        scale: [1.1, 1, 1.1],
                        rotate: [0, -45, 0],
                        x: [0, -50, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[80px] will-change-transform"
                />

                {/* Simplified Floating Geometric Elements */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.05 }}
                        animate={{ 
                            y: [0, -60, 0],
                            rotate: [0, 360]
                        }}
                        transition={{ 
                            duration: 20 + i * 5, 
                            repeat: Infinity, 
                            ease: "easeInOut"
                        }}
                        className="absolute text-primary-500 font-black select-none will-change-transform"
                        style={{ 
                            left: `${20 + i * 20}%`, 
                            top: `${30 + (i % 2) * 30}%`,
                            fontSize: '20px'
                        }}
                    >
                        {i % 2 === 0 ? '+' : '○'}
                    </motion.div>
                ))}
                
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center mb-24 overflow-hidden">
                    <motion.span 
                        initial={{ opacity: 0, y: 15, letterSpacing: "0.1em" }}
                        whileInView={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: smoothEase }}
                        className="text-primary-600 font-black uppercase text-xs mb-4 block"
                    >
                        Lorem Ipsum Dolor
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2, ease: smoothEase }}
                        className="text-5xl md:text-8xl font-black text-gray-950 dark:text-white mb-6 tracking-tight leading-none uppercase"
                    >
                        Lorem Ipsum Success
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.4, ease: smoothEase }}
                        className="text-gray-500 dark:text-gray-400 font-bold text-lg"
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    {/* Left Column (Top on Mobile) */}
                    <div className="lg:col-span-3 space-y-6 order-1 relative z-40">
                        {featuresLeft.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30, y: 15 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: smoothEase }}
                                className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-[2rem] shadow-lg shadow-gray-200/30 dark:shadow-none border border-gray-100 dark:border-gray-800 flex items-center space-x-6 hover:scale-105 transition-all duration-500 group min-h-[110px] will-change-transform"
                            >
                                <div className={`shrink-0 w-14 h-14 ${f.bgColor} dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-950 dark:text-white mb-1 text-lg leading-tight">{f.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed font-medium line-clamp-2">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Middle Column (Animation Sequence) */}
                    <div className="lg:col-span-6 relative h-[450px] md:h-[650px] flex items-end justify-center order-2 w-full max-w-[500px] md:max-w-[600px] lg:max-w-none mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.8, delay: 0.3, ease: smoothEase }}
                            className="relative w-full h-full flex items-end justify-center overflow-hidden will-change-transform"
                        >
                            <AnimatePresence mode="wait">
                                {phase < 4 ? (
                                    <motion.img
                                        key={`ind-${phase}`}
                                        src={students[phase].src}
                                        initial={{ opacity: 0, y: 40, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -40, scale: 1.02 }}
                                        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                                        className="absolute bottom-0 h-[90%] w-auto object-contain z-20 origin-bottom will-change-transform"
                                        alt={`Student ${phase + 1}`}
                                    />
                                ) : (
                                    <motion.div 
                                        key="group"
                                        className="relative w-full h-full flex items-end justify-center will-change-transform"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 2 }}
                                    >
                                        {students.map((stu, i) => (
                                            <motion.img
                                                key={`group-stu-${i}`}
                                                src={stu.src}
                                                initial={{ opacity: 0, y: 80, x: 0 }}
                                                animate={{ 
                                                    opacity: 1, 
                                                    y: [0, -10, 0],
                                                    x: stu.x 
                                                }}
                                                transition={{ 
                                                    opacity: { duration: 1.2, delay: i * 0.25 },
                                                    y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
                                                    x: { duration: 1.8, delay: i * 0.25, ease: smoothEase }
                                                }}
                                                className="absolute bottom-0 h-[90%] w-auto object-contain z-20 origin-bottom will-change-transform"
                                                style={{ zIndex: stu.z }}
                                                alt={`Student ${i + 1}`}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Floating Chips */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 1, ease: smoothEase }}
                            animate={{ y: [0, -10, 0] }}
                            // @ts-ignore
                            transition={{ 
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                duration: 1.2, delay: 1
                            }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 p-[2px] bg-gradient-to-br from-primary-400 via-purple-400 to-pink-400 rounded-[2rem] scale-90 md:scale-100 shadow-xl shadow-primary-500/5 will-change-transform"
                        >
                            <div className="bg-white dark:bg-gray-950 px-6 py-4 rounded-[1.9rem] flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <div className="text-primary-600 font-black text-xl leading-none">3500+</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase leading-none">Lorem Ipsum</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 1.2, ease: smoothEase }}
                            animate={{ y: [0, 10, 0] }}
                            // @ts-ignore
                            transition={{ 
                                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                                duration: 1.2, delay: 1.2
                            }}
                            className="absolute top-1/2 right-2 md:-right-6 lg:-right-12 z-50 p-[2px] bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 rounded-[2rem] scale-90 md:scale-100 shadow-xl shadow-blue-500/5 will-change-transform"
                        >
                            <div className="bg-white dark:bg-gray-950 px-6 py-4 rounded-[1.9rem] flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <div className="text-blue-600 font-black text-xl leading-none">100+</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase text-left leading-tight">Lorem<br/>Ipsum</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, x: -20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 1.4, ease: smoothEase }}
                            animate={{ y: [0, -15, 0] }}
                            // @ts-ignore
                            transition={{ 
                                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
                                duration: 1.2, delay: 1.4
                            }}
                            className="absolute bottom-4 left-2 md:-left-6 lg:-left-12 z-50 p-[2px] bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-[2rem] scale-90 md:scale-100 shadow-xl shadow-green-500/5 will-change-transform"
                        >
                            <div className="bg-white dark:bg-gray-950 px-6 py-4 rounded-[1.9rem] flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <div className="text-green-600 font-black text-xl leading-none">95%</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase text-left leading-tight">Lorem<br/>Ipsum</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column (Bottom on Mobile) */}
                    <div className="lg:col-span-3 space-y-6 order-3 relative z-40">
                        {featuresRight.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 30, y: 15 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: smoothEase }}
                                className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-[2rem] shadow-lg shadow-gray-200/30 dark:shadow-none border border-gray-100 dark:border-gray-800 flex items-center space-x-6 hover:scale-105 transition-all duration-500 group min-h-[110px] will-change-transform"
                            >
                                <div className={`shrink-0 w-14 h-14 ${f.bgColor} dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-950 dark:text-white mb-1 text-lg leading-tight">{f.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed font-medium line-clamp-2">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
