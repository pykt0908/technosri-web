import { useState, useEffect } from "react";
import { Users, Mail, Phone, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function Staff() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [filteredDepts, setFilteredDepts] = useState<Department[]>([]);
    const [selectedDeptId, setSelectedDeptId] = useState<number | "all">("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/departments`);
                const data = await res.json();
                setDepartments(data);
                setFilteredDepts(data);
            } catch (err) {
                console.error("Failed to fetch staff data");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    useEffect(() => {
        if (selectedDeptId === "all") {
            setFilteredDepts(departments);
        } else {
            setFilteredDepts(departments.filter(d => d.id === selectedDeptId));
        }
    }, [selectedDeptId, departments]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <header className="mb-16">
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

                {/* Filter Bar */}
                <Reveal delay={0.2}>
                    <div className="flex flex-wrap items-center gap-3 mb-16 p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white dark:border-slate-800 w-fit">
                        <button
                            onClick={() => setSelectedDeptId("all")}
                            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                selectedDeptId === "all" 
                                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" 
                                : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                        >
                            ทั้งหมด
                        </button>
                        {departments.map(dept => (
                            dept.personnel.length > 0 && (
                                <button
                                    key={dept.id}
                                    onClick={() => setSelectedDeptId(dept.id)}
                                    className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                        selectedDeptId === dept.id 
                                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" 
                                        : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                                    }`}
                                >
                                    {dept.name}
                                </button>
                            )
                        ))}
                    </div>
                </Reveal>

                <div className="space-y-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDeptId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-24"
                        >
                            {filteredDepts.map((dept) => (
                                dept.personnel.length > 0 && (
                                    <section key={dept.id}>
                                        <div className="flex items-center mb-10">
                                            <div className="w-1.5 h-10 bg-primary-600 rounded-full mr-4 shadow-lg shadow-primary-600/30"></div>
                                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                                                {dept.name}
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                            {dept.personnel.map((staff, staffIndex) => (
                                                <div key={staff.id} className="group h-full">
                                                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-900/30 transition-all duration-500 flex flex-col h-full overflow-hidden">
                                                        {/* Photo Area */}
                                                        <div className="aspect-[4/5] relative bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-t-[2rem]">
                                                            {staff.image ? (
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}/storage/${staff.image}`}
                                                                    alt={staff.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                                    <Users size={48} strokeWidth={1} />
                                                                    <span className="text-[10px] font-bold mt-2 uppercase tracking-widest">No Image</span>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        </div>

                                                        {/* Text Content */}
                                                        <div className="p-5 flex flex-col flex-1 items-center text-center">
                                                            <h3 className="text-base font-black text-primary-900 dark:text-white mb-1 tracking-tight">
                                                                {staff.name}
                                                            </h3>
                                                            <p className="text-[14px] font-bold text-slate-400 mb-5 italic">
                                                                {staff.nickname ? `(${staff.nickname})` : ""}
                                                            </p>

                                                            {/* Position Pill */}
                                                            <div className="mt-auto w-full px-4 py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-800/50">
                                                                <span className="text-[14px] font-black uppercase tracking-tight block leading-tight">
                                                                    {staff.position || "บุคลากร"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
