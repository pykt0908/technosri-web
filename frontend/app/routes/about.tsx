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
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black mb-6 dark:text-white">ประวัติความเป็นมา</h2>
                <div className="aspect-video rounded-3xl overflow-hidden mb-8 shadow-2xl">
                    <img src="/images/img-6.jpg" alt="History" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        วิทยาลัยเทคโนโลยีศรีราชา (รหัสสถานศึกษา 1320100117) เดิมชื่อโรงเรียนบุญจิตพาณิชยการ ได้รับอนุญาตจากสำนักงานคณะกรรมการการศึกษาเอกชน เมื่อวันที่ 23 มิถุนายน พ.ศ. 2521 และเปิดสอนครั้งแรกเมื่อวันที่ 20 พฤษภาคม พ.ศ. 2521 โดยมีนายล้วน บุญจิตสิทธิ์ศักดิ์ เป็นผู้ก่อตั้งและผู้จัดการ
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        ต่อมาได้รับอนุญาตให้เปลี่ยนชื่อเป็น "วิทยาลัยเทคโนโลยีศรีราชา (Sriracha Technological College)" เมื่อวันที่ 2 กันยายน พ.ศ. 2554 โดยมีนายสมาน บุญจิตสิทธิ์ศักดิ์ เป็นผู้รับใบอนุญาต และนางบุญนภัส รินทร์คำ เป็นผู้อำนวยการ ตั้งแต่วันที่ 1 พฤษภาคม พ.ศ. 2567 เป็นต้นมา
                    </p>
                </div>
            </div>

            <div className="pt-12 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-black mb-10 dark:text-white flex items-center">
                    <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center mr-4">
                        <i className="fas fa-clock-rotate-left text-sm"></i>
                    </span>
                    ลำดับเหตุการณ์สำคัญ (Timeline)
                </h3>

                <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {[
                        {
                            year: "2521",
                            title: "ก่อตั้งโรงเรียนบุญจิตรพาณิชยาการ",
                            detail: "ได้รับอนุญาตวันที่ 23 มิ.ย. 2521 และเปิดสอน 20 พ.ค. 2521 โดยมีนายล้วน บุญจิตสิทธิ์ศักดิ์ เป็นเจ้าของและผู้จัดการ และนายสมาน บุญจิตสิทธิ์ศักดิ์ เป็นครูใหญ่"
                        },
                        {
                            year: "2545",
                            title: "แต่งตั้งครูใหญ่",
                            detail: "วันที่ 4 มี.ค. 2545 แต่งตั้งนางสาวหนึ่งฤทัย บุญจิตสิทธิ์ศักดิ์ เป็นครูใหญ่โรงเรียนเทคโนโลยีศรีราชา"
                        },
                        {
                            year: "2554",
                            title: 'เปลี่ยนชื่อเป็น "วิทยาลัยเทคโนโลยีศรีราชา"',
                            detail: "วันที่ 2 ก.ย. 2554 ได้รับอนุญาตเปลี่ยนชื่อเป็น SRIRACHA TECHNOLOGICAL COLLEGE โดยมีนายสมานฯ เป็นผู้รับใบอนุญาต นายเขมวิทย์ฯ เป็นผู้จัดการ และนางหนึ่งฤทัย อิทเศียร เป็นผู้อำนวยการ"
                        },
                        {
                            year: "2559",
                            title: "ปรับความจุนักเรียนและจำนวนห้องเรียน",
                            detail: "วันที่ 25 ต.ค. 2559 อนุญาตเปลี่ยนแปลงงรายละเอียดความจุนักเรียน ปวช./ปวส. รอบเช้า-บ่าย รวม 96 ห้อง ห้องละ 45 คน รวมความจุ 4,320 คน"
                        },
                        {
                            year: "2567",
                            title: "แต่งตั้งผู้อำนวยการวิทยาลัยคนปัจจุบัน",
                            detail: "วันที่ 1 พ.ค. 2567 แต่งตั้งนางบุญนภัส รินทร์คำ เป็นผู้อำนวยการวิทยาลัย ตามคำสั่งที่ 002/2567"
                        }
                    ].map((item, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary-600 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-500">
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                            </div>
                            {/* Content */}
                            <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1">
                                <div className="flex items-center justify-between space-x-2 mb-2">
                                    <div className="font-black text-primary-600">พ.ศ. {item.year}</div>
                                </div>
                                <div className="text-slate-900 dark:text-white font-black mb-2">{item.title}</div>
                                <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.detail}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ),
    location: (
        <div className="space-y-6">
            <h2 className="text-3xl font-black mb-6 dark:text-white">ขนาดและที่ตั้ง</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-primary-50 dark:bg-gray-900 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4 text-primary-600">พื้นที่วิทยาลัย</h3>
                    <p className="text-gray-600 dark:text-gray-400">พื้นที่ทั้งหมด 4 ไร่ 2 งาน ประกอบด้วยอาคารเรียน 3 หลัง อาคารหอประชุม 1 หลัง และห้องปฏิบัติการทางวิชาชีพหลากหลายสาขา</p>
                </div>
                <div className="bg-primary-50 dark:bg-gray-900 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4 text-primary-600">ข้อมูลการติดต่อ</h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                        <p className="flex items-start"><i className="fas fa-map-marker-alt mt-1 mr-3 text-primary-500"></i> 12/19 หมู่ที่ 2 ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี 20230</p>
                        <p className="flex items-center"><i className="fas fa-phone mr-3 text-primary-500"></i> 038-352440</p>
                        <p className="flex items-center"><i className="fas fa-fax mr-3 text-primary-500"></i> 038-351785</p>
                        <p className="flex items-center"><i className="fas fa-envelope mr-3 text-primary-500"></i> technosriracha@gmail.com</p>
                        <p className="flex items-center"><i className="fas fa-globe mr-3 text-primary-500"></i> www.technosriracha.ac.th</p>
                    </div>
                </div>
            </div>
            <div className="h-80 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3885.8991177944304!2d100.9122696!3d13.105577!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102b9c0490daf0d%3A0x64d7370ddd52cff!2z4Lin4Li04LiX4Lii4Liy4Lil4Lix4Lii4LmA4LiX4LiE4LmC4LiZ4LmC4Lil4Lii4Li14Lio4Lij4Li14Lij4Liy4LiK4Liy!5e0!3m2!1sth!2sth!4v1778541533024!5m2!1sth!2sth"
                    className="w-full h-full border-none"
                    allowFullScreen
                    loading="lazy"
                    title="College Location Map"
                ></iframe>
            </div>
        </div>
    ),
    curriculum: (
        <div className="space-y-8">
            <h2 className="text-3xl font-black mb-6 dark:text-white">หลักสูตรการเรียนการสอน</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                วิทยาลัยเปิดสอนหลักสูตรประกาศนียบัตรวิชาชีพ (ปวช.) และประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) ครอบคลุมสาขาหลักที่ตอบโจทย์ตลาดงานปัจจุบัน
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    "การบัญชี",
                    "การตลาด",
                    "โลจิสติกส์",
                    "เทคโนโลยีธุรกิจดิจิทัล",
                    "อุตสาหกรรมไฟฟ้า",
                    "อุตสาหกรรมยานยนต์",
                    "เมคคาทรอนิกส์และหุ่นยนต์"
                ].map((dept, i) => (
                    <div key={i} className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-primary-500/30 transition-all">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <i className="fas fa-check text-xs"></i>
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{dept}</span>
                    </div>
                ))}
            </div>
        </div>
    ),
    philosophy: (
        <div className="space-y-16">
            <div>
                <h2 className="text-3xl font-black mb-10 dark:text-white border-l-4 border-primary-600 pl-6">ปรัชญาและอัตลักษณ์</h2>

                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-12 rounded-[2rem] shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-600 mb-6">College Philosophy</h3>
                        <p className="text-3xl md:text-4xl font-black leading-tight text-slate-900 dark:text-white">
                            "ทักษะเยี่ยม เปี่ยมคุณธรรม <br className="hidden md:block" /> ลำเลิศวิชา พัฒนาสังคม"
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05]">
                        <i className="fas fa-quote-right text-9xl"></i>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-12 p-10 bg-slate-50 dark:bg-gray-900/50 rounded-[2rem] border border-slate-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="shrink-0">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 mb-2">Vision 2028</h4>
                            <div className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">วิสัยทัศน์</div>
                        </div>
                        <div className="h-px w-12 bg-primary-200 dark:bg-primary-900 hidden md:block"></div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium leading-relaxed max-w-2xl">
                            มุ่งผลิตและพัฒนากำลังคนอาชีวศึกษาที่มีคุณภาพ ควบคู่คุณธรรม สอดคล้องต่อความต้องการตลาดแรงงาน สู่มาตรฐานสากลภายในปีการศึกษา 2571
                        </p>
                    </div>
                </div>

                <div className="md:col-span-6 p-10 border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i className="fas fa-landmark text-lg"></i>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">College Identity</h4>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">อัตลักษณ์วิทยาลัย</div>
                    <p className="text-primary-600 font-bold text-xl">เป็นเรียนรู้ สู่อาชีพ</p>
                </div>

                <div className="md:col-span-6 p-10 border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i className="fas fa-user-graduate text-lg"></i>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Learner Identity</h4>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">อัตลักษณ์ผู้เรียน</div>
                    <p className="text-slate-600 dark:text-slate-400 font-bold text-xl">บุคลิกภาพดี</p>
                </div>
            </div>
        </div>
    ),
    culture: (
        <div className="space-y-12">
            <h2 className="text-3xl font-black mb-6 dark:text-white border-l-4 border-primary-600 pl-6">วัฒนธรรมองค์กร</h2>
            <div className="bg-slate-50 dark:bg-gray-900/50 p-12 rounded-[3rem] border border-slate-100 dark:border-gray-800 relative overflow-hidden">
                <p className="text-2xl md:text-3xl font-black text-center text-slate-900 dark:text-white leading-relaxed relative z-10">
                    "ซื่อสัตย์ มีวินัย ใฝ่ความรู้ สู้งาน <br /> เชี่ยวชาญจริง ไม่นิ่งดูดาย"
                </p>
                <div className="absolute -bottom-8 -right-8 opacity-[0.03] dark:opacity-[0.05]">
                    <i className="fas fa-users text-[12rem]"></i>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["ซื่อสัตย์", "มีวินัย", "ใฝ่ความรู้", "สู้งาน", "เชี่ยวชาญจริง", "ไม่นิ่งดูดาย"].map((item) => (
                    <div key={item} className="p-4 text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                        <span className="font-bold text-primary-600">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    ),
    identity: (
        <div className="space-y-12">
            <h2 className="text-3xl font-black mb-10 dark:text-white border-l-4 border-primary-600 pl-6">สีและต้นไม้ประจำวิทยาลัย</h2>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="flex items-start space-x-6">
                        <div className="w-20 h-20 rounded-2xl shrink-0 shadow-lg border-4 border-white dark:border-gray-800" style={{ backgroundColor: "#1ea2ff" }}></div>
                        <div>
                            <h4 className="text-xl font-black dark:text-white mb-2">สีฟ้า</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                <span className="font-bold text-slate-700 dark:text-slate-300">HEX #1ea2ff</span><br />
                                หมายถึง ความบริบูรณ์ด้วยความรู้
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-6">
                        <div className="w-20 h-20 rounded-2xl bg-white shrink-0 shadow-lg border-2 border-slate-100 dark:border-gray-800"></div>
                        <div>
                            <h4 className="text-xl font-black dark:text-white mb-2">สีขาว</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                <span className="font-bold text-slate-700 dark:text-slate-300">HEX #FFFFFF</span><br />
                                หมายถึง ผู้มีคุณธรรม และจริยธรรมอันดีงาม
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md">
                        <img src="/images/flower.jpg" alt="ต้นราชพฤกษ์" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-2xl font-black dark:text-white mb-2">ต้นราชพฤกษ์</h4>
                    <p className="text-primary-600 font-bold mb-4">สัญลักษณ์แห่งความเจริญรุ่งเรือง</p>
                    <p className="text-slate-500 text-sm italic">"ต้นไม้ประจำวิทยาลัยที่เป็นสิริมงคล แสดงถึงความงอกงามและความสำเร็จของศิษย์ทุกคน"</p>
                </div>
            </div>
        </div>
    ),
};

export default function AboutPage() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for sticky header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <main className="pt-24 pb-24 md:pt-32 md:pb-32 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">About Sriracha Technology College</span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-none mb-10 md:mb-16 dark:text-white">เกี่ยวกับเรา</h1>
                </Reveal>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Left Sidebar - Table of Contents */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 md:top-32 space-y-3">
                            <div className="hidden lg:block mb-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Table of Contents</h3>
                                <div className="h-1 w-12 bg-primary-500"></div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => scrollToSection(cat.id)}
                                        className="flex flex-col lg:flex-row items-center lg:items-start space-y-2 lg:space-y-0 lg:space-x-4 px-4 md:px-6 py-4 rounded-2xl font-bold transition-all text-center lg:text-left bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 group"
                                    >
                                        <i className={`${cat.icon} text-lg text-primary-500 group-hover:scale-110 transition-transform`}></i>
                                        <span className="text-[0.7rem] sm:text-xs md:text-base leading-tight group-hover:text-primary-600 transition-colors">{cat.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area - All Sections */}
                    <div className="lg:col-span-8 space-y-24 md:space-y-32">
                        {categories.map((cat) => (
                            <div key={cat.id} id={cat.id} className="scroll-mt-32">
                                <Reveal animation="fade-in">
                                    {content[cat.id]}
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
