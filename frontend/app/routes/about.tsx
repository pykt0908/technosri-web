import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../components/Reveal";

const categories = [
    { id: "history", title: "ประวัติความเป็นมา", icon: "fas fa-history" },
    { id: "location", title: "ขนาดและที่ตั้ง", icon: "fas fa-map-marked-alt" },
    { id: "curriculum", title: "หลักสูตรการเรียนการสอน", icon: "fas fa-graduation-cap" },
    { id: "philosophy", title: "ปรัชญาและอัตลักษณ์", icon: "fas fa-lightbulb" },
    { id: "culture", title: "วัฒนธรรมองค์กร", icon: "fas fa-users" },
    { id: "identity", title: "สีและต้นไม้ประจำวิทยาลัย", icon: "fas fa-leaf" },
];

const content: Record<string, JSX.Element> = {
    history: (
        <div className="space-y-6">
            <h2 className="text-3xl font-black mb-6 dark:text-white">ประวัติความเป็นมา</h2>
            <div className="aspect-video rounded-3xl overflow-hidden mb-8">
                <img src="https://images.unsplash.com/photo-1523240915679-7f2171db6b0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="History" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                วิทยาลัยเทคโนโลยีศรีราชา (STC) ก่อตั้งขึ้นด้วยความมุ่งมั่นที่จะพัฒนาเยาวชนในพื้นที่ชายฝั่งทะเลตะวันออกให้มีความรู้ความสามารถทางด้านเทคโนโลยีและวิชาชีพ เพื่อรองรับการขยายตัวของภาคอุตสาหกรรมในพื้นที่
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                ตลอดระยะเวลาที่ผ่านมา เราได้มุ่งพัฒนาการเรียนการสอนอย่างต่อเนื่อง จนได้รับการยอมรับว่าเป็นหนึ่งในสถาบันอาชีวศึกษาชั้นนำที่มีมาตรฐานการเรียนการสอนระดับสากล
            </p>
        </div>
    ),
    location: (
        <div className="space-y-6">
            <h2 className="text-3xl font-black mb-6 dark:text-white">ขนาดและที่ตั้ง</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-primary-50 dark:bg-gray-900 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4 text-primary-600">พื้นที่วิทยาลัย</h3>
                    <p className="text-gray-600 dark:text-gray-400">ตั้งอยู่บนเนื้อที่กว่า 20 ไร่ ประกอบด้วยอาคารเรียนที่ทันสมัย ห้องปฏิบัติการเฉพาะทาง และสิ่งอำนวยความสะดวกครบครัน</p>
                </div>
                <div className="bg-primary-50 dark:bg-gray-900 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4 text-primary-600">ที่ตั้ง</h3>
                    <p className="text-gray-600 dark:text-gray-400">84 ม.5 ถ.สุขุมวิท ต.ทุ่งศุขลา อ.ศรีราชา จ.ชลบุรี 20230 ใกล้กับนิคมอุตสาหกรรมแหลมฉบัง</p>
                </div>
            </div>
            <div className="h-80 rounded-3xl overflow-hidden">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m1!2s!2z4Lin4Li04LiX4Lii4Liy4Lil4Lix4Lii4LmA4LiX4LiE4LiZ4Li04LiE4Lio4Lij4Li14Lio4Lij4Liy4LiK4Liy!5e0!3m2!1sth!2sth!4v1715400000000!5m2!1sth!2sth"
                    className="w-full h-full border-none"
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    ),
    curriculum: (
        <div className="space-y-6">
            <h2 className="text-3xl font-black mb-6 dark:text-white">หลักสูตรการเรียนการสอน</h2>
            <div className="space-y-4">
                <div className="group p-6 bg-white dark:bg-gray-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                    <h3 className="text-xl font-black mb-2 dark:text-white">ระดับประกาศนียบัตรวิชาชีพ (ปวช.)</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">หลักสูตร 3 ปี มุ่งเน้นการสร้างพื้นฐานทักษะวิชาชีพที่แข็งแกร่ง</p>
                </div>
                <div className="group p-6 bg-white dark:bg-gray-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                    <h3 className="text-xl font-black mb-2 dark:text-white">ระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">หลักสูตร 2 ปี ต่อยอดความรู้สู่ความเป็นมืออาชีพและเชี่ยวชาญเฉพาะทาง</p>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mt-6">
                ครอบคลุมสาขาวิชาช่างอุตสาหกรรม พาณิชยกรรม และเทคโนโลยีสารสนเทศ ด้วยรูปแบบการเรียนที่เน้นการปฏิบัติจริงในสถานประกอบการจำลอง
            </p>
        </div>
    ),
    philosophy: (
        <div className="space-y-12">
            <h2 className="text-3xl font-black mb-6 dark:text-white">ปรัชญาและอัตลักษณ์</h2>
            <div className="relative p-12 bg-primary-600 rounded-[3rem] text-white overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-80">ปรัชญาวิทยาลัย</h3>
                <p className="text-4xl md:text-5xl font-black leading-tight italic">
                    "ทักษะเยี่ยม เปี่ยมคุณธรรม นำนวัตกรรม"
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                    <h4 className="text-primary-500 font-bold mb-4">วิสัยทัศน์</h4>
                    <p className="text-gray-600 dark:text-gray-400">เป็นสถาบันอาชีวศึกษาชั้นนำในการผลิตกำลังคนที่มีทักษะขั้นสูงและสมรรถนะตรงตามความต้องการของภาคอุตสาหกรรม</p>
                </div>
                <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                    <h4 className="text-primary-500 font-bold mb-4">อัตลักษณ์</h4>
                    <p className="text-gray-600 dark:text-gray-400">สุภาพ สะอาด ประหยัด ขยัน กตัญญู</p>
                </div>
            </div>
        </div>
    ),
    culture: (
        <div className="space-y-6">
            <h2 className="text-3xl font-black mb-6 dark:text-white">วัฒนธรรมองค์กร</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                วิทยาลัยเทคโนโลยีศรีราชา ยึดมั่นในวัฒนธรรมการอยู่ร่วมกันแบบครอบครัว "พี่สอนน้อง เพื่อนช่วยเพื่อน" สร้างบรรยากาศการเรียนรู้ที่อบอุ่นและปลอดภัย
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8">
                {["ความเป็นพี่น้อง", "วินัยและความรับผิดชอบ", "ความคิดสร้างสรรค์", "ความกตัญญู", "ความขยันอดทน", "จิตอาสา"].map((item) => (
                    <div key={item} className="p-4 text-center bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
                        <span className="font-bold text-primary-600">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    ),
    identity: (
        <div className="space-y-8">
            <h2 className="text-3xl font-black mb-6 dark:text-white">สีและต้นไม้ประจำวิทยาลัย</h2>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-primary-900 border-4 border-white shadow-xl"></div>
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-100 shadow-xl ml-[-2rem]"></div>
                    <div className="ml-4">
                        <h4 className="text-xl font-bold dark:text-white">สีกรมท่า - ขาว</h4>
                        <p className="text-gray-500 text-sm">สีประจำวิทยาลัย</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl">
                        <img src="https://images.unsplash.com/photo-1596722511432-675115903284?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Tree" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold dark:text-white">ต้นนนทรี</h4>
                        <p className="text-gray-500 text-sm">ต้นไม้ประจำวิทยาลัย</p>
                    </div>
                </div>
            </div>
            <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-[3rem] mt-12">
                <p className="text-gray-600 dark:text-gray-300 italic text-center">
                    "นนทรีแผ่กิ่งก้านสาขาเปรียบดังศิษย์ STC ที่เติบโตและมีความรู้แผ่ขยายไปสร้างประโยชน์แก่สังคม"
                </p>
            </div>
        </div>
    ),
};

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState("history");

    return (
        <main className="pt-24 pb-24 md:pt-32 md:pb-32 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">About Sriracha Technology College</span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none mb-10 md:mb-16 dark:text-white">เกี่ยวกับเรา</h1>
                </Reveal>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Left Sidebar Tabs */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 md:top-32 grid grid-cols-2 lg:grid-cols-1 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`flex flex-col lg:flex-row items-center lg:items-start space-y-3 lg:space-y-0 lg:space-x-4 px-4 md:px-6 py-4 md:py-5 rounded-2xl font-bold transition-all text-center lg:text-left ${activeTab === cat.id
                                            ? "bg-primary-600 text-white shadow-xl shadow-primary-500/30 scale-[1.02] z-10"
                                            : "bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    <i className={`${cat.icon} text-xl md:text-xl ${activeTab === cat.id ? "text-white" : "text-primary-500"}`}></i>
                                    <span className="text-[0.7rem] sm:text-xs md:text-base leading-tight">{cat.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="bg-white dark:bg-gray-950 min-h-[400px]"
                            >
                                {content[activeTab]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
