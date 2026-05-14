import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";

const programData = {
    pvc: [
        { id: 1, name: "สาขาวิชาช่างยนต์", image: "https://images.unsplash.com/photo-1486006396193-471a6f58bc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-blue-500 to-blue-600" },
        { id: 2, name: "สาขาวิชาช่างไฟฟ้ากำลัง", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-yellow-500 to-yellow-600" },
        { id: 3, name: "สาขาวิชาเทคโนโลยีสารสนเทศ", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-indigo-500 to-indigo-600" },
        { id: 4, name: "สาขาวิชาการบัญชี", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-green-500 to-green-600" },
        { id: 5, name: "สาขาวิชาการตลาด", image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-pink-500 to-pink-600" },
        { id: 6, name: "สาขาวิชาคอมพิวเตอร์ธุรกิจ", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-purple-500 to-purple-600" },
        { id: 7, name: "สาขาวิชาช่างกลโรงงาน", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-gray-500 to-gray-600" },
        { id: 8, name: "สาขาวิชาช่างอิเล็กทรอนิกส์", image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-red-500 to-red-600" },
    ],
    pvs: [
        { id: 101, name: "สาขาวิชาเทคนิคเครื่องกล", image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-blue-600 to-blue-700" },
        { id: 102, name: "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-indigo-600 to-indigo-700" },
        { id: 103, name: "สาขาวิชาการบัญชี (ปวส.)", image: "https://images.unsplash.com/photo-1454165833767-027508496b60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-green-600 to-green-700" },
        { id: 104, name: "สาขาวิชาเทคโนโลยีสารสนเทศ", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-indigo-700 to-indigo-800" },
        { id: 105, name: "สาขาวิชาการจัดการโลจิสติกส์", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", color: "from-orange-500 to-orange-600" },
    ]
};

export default function ProgramGrid() {
    const [activeTab, setActiveTab] = useState<"pvc" | "pvs">("pvc");

    return (
        <section className="py-24 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center mb-16">
                    <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">Sriracha Technology College Curriculum</span>
                    <h2 className="text-4xl md:text-6xl font-black mb-10 uppercase tracking-tight dark:text-white">หลักสูตรที่เปิดสอน</h2>
                    <div className="flex justify-center space-x-3 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit mx-auto border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab("pvc")}
                            className={`px-10 py-3.5 rounded-xl font-bold transition-all text-sm uppercase tracking-widest ${activeTab === "pvc"
                                    ? "bg-white dark:bg-gray-700 text-primary-600 shadow-xl scale-105 border border-gray-200 dark:border-gray-600"
                                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                        >
                            ปวช.
                        </button>
                        <button
                            onClick={() => setActiveTab("pvs")}
                            className={`px-10 py-3.5 rounded-xl font-bold transition-all text-sm uppercase tracking-widest ${activeTab === "pvs"
                                    ? "bg-white dark:bg-gray-700 text-primary-600 shadow-xl scale-105 border border-gray-200 dark:border-gray-600"
                                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                        >
                            ปวส.
                        </button>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="wait">
                        {programData[activeTab].map((item, index) => (
                            <motion.div
                                key={`${activeTab}-${item.id}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-black text-5xl select-none">
                                            {item.name.substring(0, 2)}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="mb-4">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest ${activeTab === "pvc" ? "bg-orange-500" : "bg-purple-600"}`}>
                                            {activeTab === "pvc" ? "ปวช." : "ปวส."}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-primary-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center text-primary-500 font-bold text-sm">
                                        <span className="mr-2">ดูรายละเอียดหลักสูตร</span>
                                        <i className="fas fa-arrow-right text-xs transform group-hover:translate-x-2 transition-transform"></i>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
