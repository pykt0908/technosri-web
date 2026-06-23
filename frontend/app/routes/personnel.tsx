import { useState, useEffect } from "react";
import { Users, Mail, Phone, Filter } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Reveal from "../components/Reveal";

interface Personnel {
    id: number;
    name: string;
    nickname: string | null;
    position: string | null;
    image: string | null;
}

interface Department {
    id: number;
    name: string;
    personnel: Personnel[];
}

// Framer Motion animation variants for staggered entrance & exit
const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        }
    }
};

const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 35,
        scale: 0.96,
        transition: {
            duration: 0.25,
            ease: "easeInOut"
        }
    },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 75,
            damping: 13
        }
    }
};

export default function Staff() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDeptId, setSelectedDeptId] = useState<number | "all">("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/departments`);
                const data = await res.json();
                setDepartments(data);
            } catch (err) {
                console.error("Failed to fetch staff data");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    // ScrollSpy effect: highlight active department as user scrolls
    useEffect(() => {
        if (departments.length === 0) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 180; // Offset for navbar

            if (window.scrollY < 200) {
                setSelectedDeptId("all");
                return;
            }

            let activeDeptId: number | "all" = "all";
            for (const dept of departments) {
                if (dept.personnel.length === 0) continue;
                const el = document.getElementById(`dept-${dept.id}`);
                if (el) {
                    const top = el.offsetTop;
                    if (scrollPosition >= top) {
                        activeDeptId = dept.id;
                    }
                }
            }
            setSelectedDeptId(activeDeptId);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [departments]);

    const scrollToSection = (id: number | "all") => {
        setSelectedDeptId(id);
        if (id === "all") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const el = document.getElementById(`dept-${id}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <header id="personnel-header" className="mb-16">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-100/50 dark:bg-primary-900/20 px-4 py-1.5 rounded-full mb-6">
                            <Users size={14} />
                            <span>Faculty & Staff</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                            คณะผู้บริหาร <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">และบุคลากร</span>
                        </h1>
                    </Reveal>
                </header>

                {/* Main Content Layout with Sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Sidebar: Categories Filter (Hidden on mobile) */}
                    <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-32 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/5 dark:shadow-none">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-2 italic">แผนกและฝ่าย</h3>
                        <div className="space-y-1.5">
                            <button
                                onClick={() => scrollToSection("all")}
                                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between ${
                                    selectedDeptId === "all" 
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/10" 
                                    : "text-slate-500 hover:bg-white dark:hover:bg-slate-900/50 hover:text-slate-800 dark:hover:text-white"
                                }`}
                            >
                                <span>ทั้งหมด</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedDeptId === "all" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                                    {departments.reduce((acc, d) => acc + d.personnel.length, 0)}
                                </span>
                            </button>
                            {departments.map(dept => (
                                dept.personnel.length > 0 && (
                                    <button
                                        key={dept.id}
                                        onClick={() => scrollToSection(dept.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-start justify-between gap-2 ${
                                            selectedDeptId === dept.id 
                                            ? "bg-primary-600 text-white shadow-md shadow-primary-600/10" 
                                            : "text-slate-500 hover:bg-white dark:hover:bg-slate-900/50 hover:text-slate-800 dark:hover:text-white"
                                        }`}
                                    >
                                        <span className="leading-snug">{dept.name}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5 ${selectedDeptId === dept.id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                                            {dept.personnel.length}
                                        </span>
                                    </button>
                                )
                            ))}
                        </div>
                    </aside>

                    {/* Personnel List (Right Column on Desktop, Full Width on Mobile) */}
                    <div className="col-span-1 md:col-span-8 lg:col-span-9 space-y-16">
                        <div className="space-y-16">
                            {departments.map((dept) => (
                                dept.personnel.length > 0 && (
                                    <section key={dept.id} id={`dept-${dept.id}`} className="scroll-mt-36">
                                        <div className="flex items-center mb-8">
                                            <div className="w-1.5 h-8 bg-primary-600 rounded-full mr-4 shadow-md shadow-primary-600/20"></div>
                                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                                                {dept.name}
                                            </h2>
                                        </div>

                                        <motion.div 
                                            variants={containerVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: false, amount: 0.05, margin: "-40px 0px" }}
                                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                                        >
                                            {dept.personnel.map((staff, idx) => {
                                                // Generate a scattered rotation angle for Polaroid styling
                                                const tilts = [-1.5, 1.2, -0.8, 1.5, -1.2, 0.8];
                                                const rotation = tilts[idx % tilts.length];

                                                return (
                                                    <motion.div
                                                        key={staff.id}
                                                        variants={cardVariants}
                                                        whileHover={{
                                                            scale: 1.04,
                                                            rotate: 0,
                                                            y: -8,
                                                            zIndex: 10,
                                                            transition: { duration: 0.25, ease: "easeOut" }
                                                        }}
                                                        style={{ rotate: rotation }}
                                                        className="group h-full origin-center"
                                                    >
                                                        <div className="bg-[#fcfcf9] dark:bg-slate-900 p-3 pb-6 sm:p-4 sm:pb-8 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full relative rounded-sm">
                                                            {/* Sticky Tape Decoration */}
                                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/35 dark:bg-slate-800/35 border-x border-slate-300/20 dark:border-slate-700/20 backdrop-blur-[1px] rotate-[-1deg] shadow-[0_1px_2px_rgba(0,0,0,0.03)] z-20 pointer-events-none"></div>

                                                            {/* Photo Area */}
                                                            <div className="aspect-[4/5] relative bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-inner">
                                                                {staff.image ? (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_API_URL}/storage/${staff.image}`}
                                                                        alt={staff.name}
                                                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                                                                        <Users size={32} strokeWidth={1.5} />
                                                                        <span className="text-[9px] font-bold mt-2 uppercase tracking-widest opacity-65">No Image</span>
                                                                    </div>
                                                                )}
                                                                {/* Photo Sheen / Matte Reflection Overlay */}
                                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:via-white/2 dark:to-white/5 pointer-events-none"></div>
                                                                <div className="absolute inset-0 bg-black/5 dark:bg-black/10 mix-blend-overlay pointer-events-none"></div>
                                                            </div>

                                                            {/* Text Content (Polaroid Caption style) */}
                                                            <div className="pt-4 pb-1 px-1 flex flex-col flex-1 items-center text-center">
                                                                <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mb-0.5 tracking-tight line-clamp-1">
                                                                    {staff.name}
                                                                </h3>
                                                                <p className="text-[12px] font-medium text-slate-400 mb-3">
                                                                    {staff.nickname ? `(${staff.nickname})` : " "}
                                                                </p>

                                                                {/* Position Badge - Styled like a tape label marker */}
                                                                <div className="mt-auto w-full px-2 py-1.5 bg-slate-800 dark:bg-slate-950 text-slate-100 rounded-sm border-t border-b border-slate-700/50 shadow-[0_1px_2px_rgba(0,0,0,0.15)] flex items-center justify-center">
                                                                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider block leading-tight truncate uppercase">
                                                                        {staff.position || "บุคลากร"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </motion.div>
                                    </section>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
