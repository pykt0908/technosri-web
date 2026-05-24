import { useState } from "react";
import Reveal from "../components/Reveal";

interface LogoVariant {
    name: string;
    filename: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    description: string;
}

export default function CollegeEmblem() {
    const [downloading, setDownloading] = useState<string | null>(null);

    const logoVariants: LogoVariant[] = [
        {
            name: "ตราสัญลักษณ์สีมาตรฐาน (โปร่งใส)",
            filename: "LOGO_SERIRACHA_COLOR_TRANERENT.png",
            bgColor: "bg-slate-50 dark:bg-slate-900/40",
            textColor: "text-slate-800 dark:text-slate-200",
            accentColor: "border-primary-500/20 hover:border-primary-500 hover:shadow-primary-500/10",
            description: "ตราสัญลักษณ์สีสันออริจินัล เหมาะสำหรับพื้นหลังสีขาวหรือสีสว่างทุกรูปแบบ"
        },
        {
            name: "ตราสัญลักษณ์สีขาว (โปร่งใส)",
            filename: "LOGO_SERIRACHA_WHITE_TRANERENT.png",
            bgColor: "bg-slate-900",
            textColor: "text-white",
            accentColor: "border-slate-800 hover:border-slate-500 hover:shadow-white/10",
            description: "ตราสัญลักษณ์สีขาวล้วน เหมาะสำหรับพื้นหลังสีเข้ม สีน้ำเงิน หรือภาพถ่ายสีเข้ม"
        },
        {
            name: "ตราสัญลักษณ์สีน้ำเงิน (โปร่งใส)",
            filename: "LOGO_SERIRACHA_BLUE_TRANERENT.png",
            bgColor: "bg-slate-50 dark:bg-slate-900/40",
            textColor: "text-slate-800 dark:text-slate-200",
            accentColor: "border-blue-500/20 hover:border-blue-500 hover:shadow-blue-500/10",
            description: "ตราสัญลักษณ์สีน้ำเงินธีมฟ้าขาว เหมาะสำหรับเอกสารทางการและงานดีไซน์ร่วมสมัย"
        },
        {
            name: "ตราสัญลักษณ์สีแดง (โปร่งใส)",
            filename: "LOGO_SERIRACHA_RED_TRANERENT.png",
            bgColor: "bg-slate-50 dark:bg-slate-900/40",
            textColor: "text-slate-800 dark:text-slate-200",
            accentColor: "border-red-500/20 hover:border-red-500 hover:shadow-red-500/10",
            description: "ตราสัญลักษณ์สีแดงพิเศษ เหมาะสำหรับการสื่อสารที่ดึงดูดสายตาและงานกิจกรรม"
        },
        {
            name: "ตราสัญลักษณ์สีทอง/เหลือง (โปร่งใส)",
            filename: "LOGO_SERIRACHA_YELLOW_TRANERENT.png",
            bgColor: "bg-slate-50 dark:bg-slate-900/40",
            textColor: "text-slate-800 dark:text-slate-200",
            accentColor: "border-yellow-500/20 hover:border-yellow-500 hover:shadow-yellow-500/10",
            description: "ตราสัญลักษณ์สีทองอร่าม เหมาะสำหรับการเฉลิมฉลอง รางวัลเกียรติยศ และพิธีการสำคัญ"
        },
        {
            name: "ตราสัญลักษณ์สีดำ (โปร่งใส)",
            filename: "LOGO_SERIRACHA_BLACK_TRANERENT.png",
            bgColor: "bg-white",
            textColor: "text-slate-800",
            accentColor: "border-slate-200 hover:border-slate-900 hover:shadow-slate-900/10",
            description: "ตราสัญลักษณ์สีดำคลาสสิก เหมาะสำหรับเอกสารขาวดำ โทรรสาร และงานพิมพ์จำกัดสี"
        }
    ];

    const handleDownload = async (filename: string) => {
        setDownloading(filename);
        try {
            const link = document.createElement("a");
            link.href = `/logo/${filename}`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setTimeout(() => setDownloading(null), 1000);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 overflow-hidden relative transition-colors duration-500">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Header Section */}
                <header className="mb-16">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-100/50 dark:bg-primary-900/20 px-4 py-1.5 rounded-full mb-6">
                            <i className="fas fa-shield-alt text-xs" aria-hidden="true"></i>
                            <span>College Emblem</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                            ตราสัญลักษณ์ <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">ประจำวิทยาลัย</span>
                        </h1>
                    </Reveal>
                </header>

                {/* Primary Emblem & Meaning Showcase */}
                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center mb-24">
                    {/* Left: Main Emblem Presentation Card */}
                    <div className="lg:col-span-5">
                        <Reveal animation="fade-right">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent dark:from-primary-950/10 pointer-events-none" />
                                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                    <img 
                                        src="/logo/LOGO_SERIRACHA_COLOR_TRANERENT.png" 
                                        alt="ตราสัญลักษณ์วิทยาลัยเทคโนโลยีศรีราชา" 
                                        className="w-full h-full object-contain filter drop-shadow-lg"
                                    />
                                </div>
                                <div className="mt-8 text-center">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">วิทยาลัยเทคโนโลยีศรีราชา</h2>
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">Sriracha Technological College</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Right: Symbolism Detail */}
                    <div className="lg:col-span-7 space-y-6">
                        <Reveal animation="fade-left" delay={0.2}>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-1.5 h-8 bg-primary-600 rounded-full shadow-lg shadow-primary-600/30"></div>
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">ความหมายของตราสัญลักษณ์</h2>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                                    ตราสัญลักษณ์ของวิทยาลัยเทคโนโลยีศรีราชาได้รับการออกแบบอย่างประณีตและแฝงด้วยความหมายอันทรงคุณค่าที่ผูกพันกับท้องถิ่นและอัตลักษณ์เฉพาะของสถาบัน
                                </p>
                                
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                                            <i className="fas fa-water text-lg"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 dark:text-white text-lg mb-1">รูปทะเลเมืองศรีราชา (เกาะลอย)</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                สื่อถึงทัศนียภาพอันงดงามและแลนด์มาร์กที่เป็นหัวใจสำคัญของอำเภอศรีราชา นั่นคือเกาะลอยและเกลียวคลื่นทะเล สะท้อนถึงจุดเริ่มต้น ถิ่นกำเนิด และความภาคภูมิใจในความเป็นสถาบันการศึกษาคู่เมืองศรีราชาที่มีความร่มเย็นและกว้างไกลดั่งมหาสมุทร
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-slate-800/60 my-4"></div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
                                            <i className="fas fa-university text-lg"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 dark:text-white text-lg mb-1">ล้อมรอบด้วยชื่อวิทยาลัย และที่ตั้ง</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                ชื่อวิทยาลัย "วิทยาลัยเทคโนโลยีศรีราชา" และที่ตั้งอันเป็นเอกลักษณ์ล้อมรอบขอบนอกตราสัญลักษณ์ แสดงถึงความเป็นอันหนึ่งอันเดียวกัน ความสามัคคีร่วมแรงร่วมใจ และเกียรติยศชื่อเสียงอันขจรขจายของสถาบันที่หยั่งรากลึกในดินแดนศรีราชา
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Grid Gallery for Variants */}
                <div className="space-y-8">
                    <Reveal>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-1.5 h-8 bg-primary-600 rounded-full shadow-lg shadow-primary-600/30"></div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">ดาวน์โหลดไฟล์ตราสัญลักษณ์วิทยาลัย</h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl">
                            เลือกดาวน์โหลดตราสัญลักษณ์ในรูปแบบไฟล์รูปภาพคุณภาพสูง (PNG พื้นหลังโปร่งใส) ตามการจับคู่สีที่เหมาะสมกับการใช้งานของคุณ:
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {logoVariants.map((logo, index) => (
                            <Reveal key={logo.filename} delay={index * 0.1} animation="fade-up">
                                <div className={`bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 ${logo.accentColor}`}>
                                    {/* Preview Block */}
                                    <div className={`aspect-[4/3] w-full rounded-2xl flex items-center justify-center p-8 mb-5 ${logo.bgColor}`}>
                                        <img 
                                            src={`/logo/${logo.filename}`} 
                                            alt={logo.name} 
                                            className="max-w-full max-h-full object-contain filter drop-shadow-md"
                                        />
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex flex-col flex-grow">
                                        <h3 className="font-black text-slate-800 dark:text-white mb-2 text-base leading-tight">
                                            {logo.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed mb-6">
                                            {logo.description}
                                        </p>
                                        
                                        {/* Download Button */}
                                        <button
                                            onClick={() => handleDownload(logo.filename)}
                                            disabled={downloading === logo.filename}
                                            className="w-full mt-auto bg-slate-50 dark:bg-slate-800 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 text-slate-700 dark:text-slate-200 py-3.5 px-6 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            {downloading === logo.filename ? (
                                                <>
                                                    <i className="fas fa-spinner animate-spin text-sm"></i>
                                                    <span>กำลังดาวน์โหลด...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-download text-sm"></i>
                                                    <span>ดาวน์โหลดไฟล์รูปภาพ (.PNG)</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Design/Usage Guidelines Card */}
                <Reveal delay={0.4}>
                    <div className="mt-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                            <i className="fas fa-info-circle text-[10rem]"></i>
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-6 shrink-0 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                            <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center">
                                <i className="fas fa-info-circle"></i>
                            </span>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white">แนวทางปฏิบัติในการใช้ตราสัญลักษณ์ (Usage Guidelines)</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Design Standards</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 text-sm">
                            <div>
                                <h4 className="font-black text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span>อัตราส่วนการย่อขยาย</span>
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    ต้องรักษาอัตราส่วนกว้างยาว (Aspect Ratio) ของภาพไว้เสมอในขณะที่ทำการปรับขนาดรูปภาพ ห้ามบีบ ยืด หรือดัดสัดส่วนรูปภาพให้ผิดรูปไปจากเดิมโดยเด็ดขาด
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-black text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span>ระยะขอบปลอดภัย (Clear Space)</span>
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    ควรเว้นระยะขอบว่าง (Margin) โดยรอบของตราสัญลักษณ์อย่างน้อย 10-15% ของขนาดภาพเสมอ เพื่อป้องกันไม่ให้ข้อความอื่นหรือขอบของหน้างานบดบังความโดดเด่นของตรา
                                </p>
                            </div>

                            <div>
                                <h4 className="font-black text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span>การจับคู่คอนทราสต์ของสีพื้นหลัง</span>
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    หลีกเลี่ยงการใช้ตราสัญลักษณ์ที่เป็นสีเข้มวางบนพื้นหลังที่ทึบสีเข้มเช่นกัน หากพื้นหลังเป็นสีเข้มให้เลือกใช้ตราสีขาว (White Variant) เพื่อความชัดเจนในการมองเห็นสูงสุด
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </main>
    );
}
