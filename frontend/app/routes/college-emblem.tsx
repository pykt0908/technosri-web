import { useState, useEffect } from "react";
import Reveal from "../components/Reveal";

interface LogoItem {
    name: string;
    previewPath: string;
    pngPath: string;
    svgPath?: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    description: string;
}

interface LogoCategory {
    id: "main" | "stech" | "tobe";
    title: string;
    badge: string;
    icon: string;
    description: string;
    items: LogoItem[];
}

export default function CollegeEmblem() {
    useEffect(() => {
        document.title = "ตราประจำวิทยาลัย & โลโก้ | วิทยาลัยเทคโนโลยีศรีราชา";
    }, []);

    const [activeTab, setActiveTab] = useState<"main" | "stech" | "tobe">("main");
    const [downloading, setDownloading] = useState<string | null>(null);

    const categories: Record<"main" | "stech" | "tobe", LogoCategory> = {
        main: {
            id: "main",
            title: "ตราสัญลักษณ์ประจำวิทยาลัย (Official Emblem)",
            badge: "Main Emblem",
            icon: "fas fa-shield-alt",
            description: "ตราสัญลักษณ์วงกลมทางการของวิทยาลัยเทคโนโลยีศรีราชา พร้อมความหมายและคู่สีมาตรฐาน",
            items: [
                {
                    name: "ตราสัญลักษณ์สีมาตรฐาน (พื้นขาวเต็ม)",
                    previewPath: "/logo/LOGO_SERIRACHA_COLOR_FULL.png",
                    pngPath: "/logo/LOGO_SERIRACHA_COLOR_FULL.png",
                    svgPath: "/logo/svg/LOGO_SERIRACHA_COLOR_FULL.svg",
                    bgColor: "bg-slate-50 dark:bg-slate-900/60",
                    textColor: "text-slate-800 dark:text-slate-200",
                    accentColor: "border-primary-500/20 hover:border-primary-500 hover:shadow-primary-500/10",
                    description: "ตราสัญลักษณ์สีน้ำเงินเต็มรูปแบบ พื้นขาว เหมาะสำหรับป้าย สื่อสิ่งพิมพ์ และเอกสารทั่วไป"
                },
                {
                    name: "ตราสัญลักษณ์สีมาตรฐาน (โปร่งใส)",
                    previewPath: "/logo/LOGO_SERIRACHA_COLOR_TRANERENT.png",
                    pngPath: "/logo/LOGO_SERIRACHA_COLOR_TRANERENT.png",
                    svgPath: "/logo/svg/LOGO_SERIRACHA_COLOR_TRANERENT.svg",
                    bgColor: "bg-slate-50 dark:bg-slate-900/40",
                    textColor: "text-slate-800 dark:text-slate-200",
                    accentColor: "border-blue-500/20 hover:border-blue-500 hover:shadow-blue-500/10",
                    description: "ตราสัญลักษณ์สีน้ำเงิน พื้นหลังโปร่งใส เหมาะสำหรับวางบนพื้นหลังสีสว่าง"
                },
                {
                    name: "ตราสัญลักษณ์สีทอง (Gold Variant)",
                    previewPath: "/logo/LOGO_SERIRACHA_GOLD.png",
                    pngPath: "/logo/LOGO_SERIRACHA_GOLD.png",
                    svgPath: "/logo/svg/LOGO_SERIRACHA_GOLD.svg",
                    bgColor: "bg-slate-900",
                    textColor: "text-amber-400",
                    accentColor: "border-amber-500/20 hover:border-amber-500 hover:shadow-amber-500/10",
                    description: "ตราสัญลักษณ์โทนสีทอง เหมาะสำหรับงานเฉลิมฉลอง เกียรติบัตร และงานพิธีการสำคัญ"
                },
                {
                    name: "ตราสัญลักษณ์สีเงิน (Silver Variant)",
                    previewPath: "/logo/LOGO_SERIRACHA_SILVER.png",
                    pngPath: "/logo/LOGO_SERIRACHA_SILVER.png",
                    svgPath: "/logo/svg/LOGO_SERIRACHA_SILVER.svg",
                    bgColor: "bg-slate-900",
                    textColor: "text-slate-200",
                    accentColor: "border-slate-500/20 hover:border-slate-400 hover:shadow-slate-400/10",
                    description: "ตราสัญลักษณ์โทนสีเงินเมทัลลิก เรียบหรู เหมาะสำหรับงานกราฟิกและสื่อพรีเมียม"
                },
                {
                    name: "ตราสัญลักษณ์สีขาว (White Monotone)",
                    previewPath: "/logo/LOGO_SERIRACHA_WHITE.png",
                    pngPath: "/logo/LOGO_SERIRACHA_WHITE.png",
                    svgPath: "/logo/svg/LOGO_SERIRACHA_WHITE.svg",
                    bgColor: "bg-slate-950",
                    textColor: "text-white",
                    accentColor: "border-slate-800 hover:border-slate-500 hover:shadow-white/10",
                    description: "ตราสัญลักษณ์สีขาวล้วน เหมาะสำหรับวางบนพื้นหลังสีเข้ม รูปถ่าย หรือวิดีโอ"
                },
                {
                    name: "ตราสัญลักษณ์สีดำ (โปร่งใส)",
                    previewPath: "/logo/LOGO_SERIRACHA_BLACK_TRANSPERANT.png",
                    pngPath: "/logo/LOGO_SERIRACHA_BLACK_TRANSPERANT.png",
                    svgPath: "/logo/svg/LOGO_SERIRACHA_BLACK_TRANSPERANT.svg",
                    bgColor: "bg-white",
                    textColor: "text-slate-900",
                    accentColor: "border-slate-200 hover:border-slate-900 hover:shadow-slate-900/10",
                    description: "ตราสัญลักษณ์สีดำล้วน พื้นหลังโปร่งใส เหมาะสำหรับเอกสารขาวดำและงานพิมพ์จำกัดสี"
                },
                {
                    name: "ตราสัญลักษณ์ขาว-ดำ (Black & White Fill)",
                    previewPath: "/logo/LOGO_SERIRACHA_BLACK_WHITER.png",
                    pngPath: "/logo/LOGO_SERIRACHA_BLACK_WHITER.png",
                    svgPath: "/logo/svg/LOGO_SERIRACHA_BLACK_WHITER.svg",
                    bgColor: "bg-slate-100 dark:bg-slate-900/60",
                    textColor: "text-slate-900 dark:text-slate-100",
                    accentColor: "border-slate-300 hover:border-slate-800",
                    description: "ตราสัญลักษณ์ขาว-ดำแบบมีพื้นหลังทึบ สำหรับงานสิ่งพิมพ์หรือตรายาง"
                }
            ]
        },
        stech: {
            id: "stech",
            title: "โลโก้ข้อความ S-TECH (Wordmark Logo)",
            badge: "Brand Identity",
            icon: "fas fa-font",
            description: "โลโก้อัตลักษณ์ชื่อย่อ S-TECH สไตล์โมเดิร์น สำหรับการสื่อสารแบรนด์ สื่อออนไลน์ และกิจกรรมเยาวชน",
            items: [
                {
                    name: "S-TECH สีดำมาตรฐาน (Black Standard)",
                    previewPath: "/logo/stech/png/STECH_BLACK.png",
                    pngPath: "/logo/stech/png/STECH_BLACK.png",
                    svgPath: "/logo/stech/svg/STECH_BLACK.svg",
                    bgColor: "bg-white",
                    textColor: "text-slate-900",
                    accentColor: "border-slate-200 hover:border-slate-800",
                    description: "โลโก้ S-TECH สีดำล้วน เหมาะสำหรับพื้นหลังสีขาวหรือสีสว่างทุกรูปแบบ"
                },
                {
                    name: "S-TECH สีฟ้า/น้ำเงินทูโทน (Blue & Cyan)",
                    previewPath: "/logo/stech/png/STECH_BLUE.png",
                    pngPath: "/logo/stech/png/STECH_BLUE.png",
                    svgPath: "/logo/stech/svg/STECH_BLUE.svg",
                    bgColor: "bg-white",
                    textColor: "text-sky-600",
                    accentColor: "border-sky-500/20 hover:border-sky-500",
                    description: "โทนสีฟ้าสดใส อัตลักษณ์ประจำวิทยาลัยเทคโนโลยีศรีราชา"
                },
                {
                    name: "S-TECH สีน้ำเงินร่วมสมัย (Royal Blue)",
                    previewPath: "/logo/stech/png/STECH_BLUE_WHITE.png",
                    pngPath: "/logo/stech/png/STECH_BLUE_WHITE.png",
                    svgPath: "/logo/stech/svg/STECH_BLUE_WHITE.svg",
                    bgColor: "bg-white",
                    textColor: "text-blue-600",
                    accentColor: "border-blue-500/20 hover:border-blue-500",
                    description: "เฉดสีน้ำเงินเข้มข้น เรียบเท่ เหมาะสำหรับหัวจดหมายและสื่อประชาสัมพันธ์"
                },
                {
                    name: "S-TECH สีขาวล้วน (White)",
                    previewPath: "/logo/stech/png/STECH_WHITE.png",
                    pngPath: "/logo/stech/png/STECH_WHITE.png",
                    svgPath: "/logo/stech/svg/STECH_WHITE.svg",
                    bgColor: "bg-slate-950",
                    textColor: "text-white",
                    accentColor: "border-slate-800 hover:border-slate-400",
                    description: "โลโก้ S-TECH สีขาวล้วน สำหรับวางบนพื้นหลังสีดำหรือภาพถ่ายสีเข้ม"
                },
                {
                    name: "S-TECH สีทองพรีเมียม (Gold Luxury)",
                    previewPath: "/logo/stech/png/STECH_GOLD.png",
                    pngPath: "/logo/stech/png/STECH_GOLD.png",
                    svgPath: "/logo/stech/svg/STECH_GOLD.svg",
                    bgColor: "bg-white",
                    textColor: "text-amber-500",
                    accentColor: "border-amber-500/20 hover:border-amber-500",
                    description: "การไล่ระดับสีทองประกาย สำหรับงานพิเศษ เกียรติยศ และของที่ระลึก"
                },
                {
                    name: "S-TECH สีเงินเมทัลลิก (Silver Metallic)",
                    previewPath: "/logo/stech/png/STECH_SILVER.png",
                    pngPath: "/logo/stech/png/STECH_SILVER.png",
                    svgPath: "/logo/stech/svg/STECH_SILVER.svg",
                    bgColor: "bg-slate-900",
                    textColor: "text-slate-300",
                    accentColor: "border-slate-700 hover:border-slate-400",
                    description: "สีเงินสะท้อนแสงเมทัลลิก ลุคไฮเทค ทันสมัย สไตล์นวัตกรรมอาชีวะ"
                },
                {
                    name: "S-TECH ดำเมทัลลิก (Metallic Dark)",
                    previewPath: "/logo/stech/png/STECH_METALLIC_BLACK.png",
                    pngPath: "/logo/stech/png/STECH_METALLIC_BLACK.png",
                    svgPath: "/logo/stech/svg/STECH_METALLIC_BLACK.svg",
                    bgColor: "bg-white",
                    textColor: "text-slate-800",
                    accentColor: "border-slate-300 hover:border-slate-700",
                    description: "โลโก้สีดำเทาเคลือบมิติแบบเมทัลลิก"
                },
                {
                    name: "S-TECH เทาเข้ม (Dark Slate)",
                    previewPath: "/logo/stech/png/STECH_DARK_GRAY.png",
                    pngPath: "/logo/stech/png/STECH_DARK_GRAY.png",
                    svgPath: "/logo/stech/svg/STECH_DARK_GRAY.svg",
                    bgColor: "bg-white",
                    textColor: "text-slate-700",
                    accentColor: "border-slate-200 hover:border-slate-600",
                    description: "โทนสีเทากราไฟต์ สำหรับสื่อดีไซน์ที่ต้องการความนุ่มนวลกว่าสีดำล้วน"
                },
                {
                    name: "S-TECH ลายเส้นสีดำ (Outline Black)",
                    previewPath: "/logo/stech/png/STECH_OUTLINE_BLACK.png",
                    pngPath: "/logo/stech/png/STECH_OUTLINE_BLACK.png",
                    svgPath: "/logo/stech/svg/STECH_OUTLINE_BLACK.svg",
                    bgColor: "bg-white",
                    textColor: "text-slate-900",
                    accentColor: "border-slate-200 hover:border-slate-800",
                    description: "โลโก้แบบตัดเส้นเฉพาะขอบนอก (Stroke) สีดำ โปร่งใส สไตล์โมเดิร์น"
                },
                {
                    name: "S-TECH ลายเส้นสีขาว (Outline White)",
                    previewPath: "/logo/stech/png/STECH_OUTLINE_WHITE.png",
                    pngPath: "/logo/stech/png/STECH_OUTLINE_WHITE.png",
                    svgPath: "/logo/stech/svg/STECH_OUTLINE_WHITE.svg",
                    bgColor: "bg-slate-950",
                    textColor: "text-white",
                    accentColor: "border-slate-800 hover:border-slate-400",
                    description: "โลโก้แบบตัดเส้นขอบสีขาว สำหรับใช้งานบนพื้นหลังภาพถ่ายหรือวิดีโอ"
                }
            ]
        },
        tobe: {
            id: "tobe",
            title: "ชมรม TO BE NUMBER ONE เทคโนฯศรีราชา",
            badge: "Campaign Identity",
            icon: "fas fa-medal",
            description: "ตราสัญลักษณ์ชมรม TO BE NUMBER ONE วิทยาลัยเทคโนโลยีศรีราชา เพื่อส่งเสริมกิจกรรมสร้างสรรค์และต้านยาเสพติด",
            items: [
                {
                    name: "TO BE NUMBER ONE สีมาตรฐาน (Color Original)",
                    previewPath: "/logo/tobe/png/TOBE_COLOR.png",
                    pngPath: "/logo/tobe/png/TOBE_COLOR.png",
                    svgPath: "/logo/tobe/svg/TOBE_COLOR.svg",
                    bgColor: "bg-white",
                    textColor: "text-blue-600",
                    accentColor: "border-blue-500/20 hover:border-blue-500",
                    description: "โลโก้สีสันสดใส โทนน้ำเงิน-แดง ตามเอกลักษณ์แคมเปญ TO BE NUMBER ONE ประจำวิทยาลัย"
                },
                {
                    name: "TO BE NUMBER ONE สีสด (High Contrast Blue/Red)",
                    previewPath: "/logo/tobe/png/TOBE_COLOR_ALT.png",
                    pngPath: "/logo/tobe/png/TOBE_COLOR_ALT.png",
                    svgPath: "/logo/tobe/svg/TOBE_COLOR_ALT.svg",
                    bgColor: "bg-white",
                    textColor: "text-red-600",
                    accentColor: "border-red-500/20 hover:border-red-500",
                    description: "เวอร์ชันสีสันคมชัดพิเศษ เหมาะสำหรับป้ายแบนเนอร์ เสื้อกิจกรรม และเวทีการแข่งขัน"
                },
                {
                    name: "TO BE NUMBER ONE สีดำล้วน (Monochrome Black)",
                    previewPath: "/logo/tobe/png/TOBE_BLACK.png",
                    pngPath: "/logo/tobe/png/TOBE_BLACK.png",
                    svgPath: "/logo/tobe/svg/TOBE_BLACK.svg",
                    bgColor: "bg-white",
                    textColor: "text-slate-900",
                    accentColor: "border-slate-200 hover:border-slate-900",
                    description: "เวอร์ชันสีดำ สำหรับเอกสารทางการ หนังสือเวียน และงานพิมพ์ขาวดำ"
                },
                {
                    name: "TO BE NUMBER ONE สีขาวล้วน (Monochrome White)",
                    previewPath: "/logo/tobe/png/TOBE_WHITE.png",
                    pngPath: "/logo/tobe/png/TOBE_WHITE.png",
                    svgPath: "/logo/tobe/svg/TOBE_WHITE.svg",
                    bgColor: "bg-slate-950",
                    textColor: "text-white",
                    accentColor: "border-slate-800 hover:border-slate-400",
                    description: "เวอร์ชันสีขาว สำหรับวางซ้อนทับภาพถ่ายกิจกรรม หรือพื้นหลังสีเข้ม"
                }
            ]
        }
    };

    const handleDownload = async (path: string, defaultName: string) => {
        setDownloading(path);
        try {
            const link = document.createElement("a");
            link.href = path;
            link.download = defaultName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setTimeout(() => setDownloading(null), 1000);
        }
    };

    const currentCategory = categories[activeTab];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 overflow-hidden relative transition-colors duration-500">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Header Section */}
                <header className="mb-14">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-100/50 dark:bg-primary-900/20 px-4 py-1.5 rounded-full mb-6">
                            <i className="fas fa-shield-alt text-xs" aria-hidden="true"></i>
                            <span>Brand Identity & Emblems</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                            ตราสัญลักษณ์ &amp; อัตลักษณ์ <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">
                                วิทยาลัยเทคโนโลยีศรีราชา
                            </span>
                        </h1>
                        <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold max-w-2xl text-base md:text-lg">
                            รวบรวมไฟล์ตราสัญลักษณ์ทางการ โลโก้ตัวย่อ S-TECH และตราแคมเปญกิจกรรม เพื่อให้บุคลากร นักเรียน นักศึกษา และหน่วยงานภายนอกนำไปใช้งานได้อย่างถูกต้องตามมาตรฐาน
                        </p>
                    </Reveal>
                </header>

                {/* Primary Emblem & Meaning Showcase (Always Visible) */}
                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center mb-16">
                    {/* Left: Main Emblem Presentation Card */}
                    <div className="lg:col-span-5">
                        <Reveal animation="fade-right">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent dark:from-primary-950/10 pointer-events-none" />
                                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                    <img 
                                        src="/logo/LOGO_SERIRACHA_COLOR_FULL.png" 
                                        alt="ตราสัญลักษณ์วิทยาลัยเทคโนโลยีศรีราชา" 
                                        className="w-full h-full object-contain filter drop-shadow-xl"
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
                                            <h3 className="font-black text-slate-800 dark:text-white text-lg mb-1">รูปทะเลเมืองศรีราชา (เกาะลอย &amp; เรือสำเภา)</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                สื่อถึงทัศนียภาพอันงดงามและแลนด์มาร์กที่เป็นหัวใจสำคัญของอำเภอศรีราชา นั่นคือเกาะลอยและเกลียวคลื่นทะเล พร้อมเรือสำเภาที่แล่นทะยานไปข้างหน้า สะท้อนถึงจุดเริ่มต้น ถิ่นกำเนิด และความมุ่งมั่นพัฒนาวิชาชีพที่กว้างไกลไร้ขีดจำกัดดั่งมหาสมุทร
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
                                                ชื่อวิทยาลัย "วิทยาลัยเทคโนโลยีศรีราชา" และที่ตั้ง "ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี" ล้อมรอบเป็นวงกลม แสดงถึงความเป็นอันหนึ่งอันเดียวกัน ความสามัคคี และเกียรติยศชื่อเสียงอันขจรขจายของสถาบันที่หยั่งรากลึกในดินแดนศรีราชา
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Category Navigation Tabs */}
                <div className="mb-10">
                    <Reveal>
                        <div className="flex flex-wrap gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm w-fit max-w-full">
                            {(["main", "stech", "tobe"] as const).map((catKey) => {
                                const cat = categories[catKey];
                                const isActive = activeTab === catKey;
                                return (
                                    <button
                                        key={catKey}
                                        onClick={() => setActiveTab(catKey)}
                                        className={`flex items-center space-x-2.5 px-5 py-3 rounded-xl text-xs md:text-sm font-black transition-all ${
                                            isActive
                                                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        <i className={`${cat.icon} text-sm`} aria-hidden="true"></i>
                                        <span>{cat.badge}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                            isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                        }`}>
                                            {cat.items.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Reveal>
                </div>

                {/* Active Category Header */}
                <div className="mb-8">
                    <Reveal>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-1.5 h-8 bg-primary-600 rounded-full shadow-lg shadow-primary-600/30"></div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                                {currentCategory.title}
                            </h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl text-sm md:text-base">
                            {currentCategory.description} มีให้ดาวน์โหลดทั้งไฟล์รูปภาพความละเอียดสูง (.PNG พื้นหลังโปร่งใส) และไฟล์เวกเตอร์ต้นฉบับ (.SVG):
                        </p>
                    </Reveal>
                </div>

                {/* Grid Gallery for Active Variants */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 mb-20">
                    {currentCategory.items.map((logo, index) => (
                        <Reveal key={logo.pngPath} delay={index * 0.05} animation="fade-up">
                            <div className={`bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 ${logo.accentColor}`}>
                                {/* Preview Block */}
                                <div className={`aspect-[4/3] w-full rounded-2xl flex items-center justify-center p-8 mb-5 ${logo.bgColor} relative overflow-hidden group`}>
                                    <img 
                                        src={logo.previewPath} 
                                        alt={logo.name} 
                                        className="max-w-full max-h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
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
                                    
                                    {/* Action Buttons: PNG & SVG */}
                                    <div className="mt-auto grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleDownload(logo.pngPath, logo.pngPath.split("/").pop() || "logo.png")}
                                            disabled={downloading === logo.pngPath}
                                            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 text-slate-700 dark:text-slate-200 py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            title="ดาวน์โหลดรูปภาพความละเอียดสูง (PNG)"
                                        >
                                            {downloading === logo.pngPath ? (
                                                <i className="fas fa-spinner animate-spin text-xs"></i>
                                            ) : (
                                                <i className="fas fa-file-image text-xs"></i>
                                            )}
                                            <span>ดาวน์โหลด PNG</span>
                                        </button>

                                        {logo.svgPath ? (
                                            <button
                                                onClick={() => handleDownload(logo.svgPath!, logo.svgPath!.split("/").pop() || "logo.svg")}
                                                disabled={downloading === logo.svgPath}
                                                className="w-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-primary-500/20"
                                                title="ดาวน์โหลดไฟล์เวกเตอร์ความคมชัดสูง (SVG)"
                                            >
                                                {downloading === logo.svgPath ? (
                                                    <i className="fas fa-spinner animate-spin text-xs"></i>
                                                ) : (
                                                    <i className="fas fa-vector-square text-xs"></i>
                                                )}
                                                <span>เวกเตอร์ SVG</span>
                                            </button>
                                        ) : (
                                            <div className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-400 py-3 px-3 rounded-xl text-xs font-medium text-center">
                                                PNG เท่านั้น
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Design/Usage Guidelines Card */}
                <Reveal delay={0.2}>
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                            <i className="fas fa-info-circle text-[10rem]"></i>
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-6 shrink-0 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                            <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center">
                                <i className="fas fa-info-circle"></i>
                            </span>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white">แนวทางปฏิบัติในการใช้ตราสัญลักษณ์และโลโก้ (Usage Guidelines)</h3>
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
                                    ต้องรักษาอัตราส่วนกว้างยาว (Aspect Ratio) เสมอขณะทำการย่อ-ขยาย ห้ามดึง บีบ ยืด หรือปรับแต่งฟอนต์และองค์ประกอบให้ผิดเพี้ยนไปจากไฟล์ต้นฉบับ
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-black text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span>ระยะขอบปลอดภัย (Clear Space)</span>
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    ควรเว้นระยะขอบว่าง (Margin) โดยรอบตราสัญลักษณ์อย่างน้อย 15% เสมอ เพื่อป้องกันไม่ให้ข้อความอื่นหรือขอบกระดาษ/ขอบจอ บดบังความสง่างามของตรา
                                </p>
                            </div>

                            <div>
                                <h4 className="font-black text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span>การจับคู่คอนทราสต์ของสีพื้นหลัง</span>
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    หลีกเลี่ยงการใช้ตราสัญลักษณ์สีเข้มบนพื้นหลังสีทึบ หากพื้นหลังเป็นสีเข้ม ให้เลือกใช้ไฟล์สีขาว (White Variant) หรือสีเงิน (Silver) เพื่อความชัดเจนสูงสุด
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </main>
    );
}
