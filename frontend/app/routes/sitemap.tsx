import { Link } from "react-router";
import { ChevronRight, FileText } from "lucide-react";
import Reveal from "../components/Reveal";

export default function Sitemap() {
    const siteMapData = [
        {
            group: "Main Navigation",
            links: [
                { name: "หน้าแรก (Home)", path: "/" },
                { name: "เกี่ยวกับวิทยาลัย (About)", path: "/about" },
                { name: "ข่าวสารและกิจกรรม (News & Events)", path: "/news" },
                { name: "ร่วมงานกับเรา (Careers)", path: "/join-us" },
                { name: "ติดต่อสอบถาม (Contact)", path: "/contact" },
            ]
        },
        {
            group: "Academic & Programs",
            links: [
                { name: "หลักสูตรที่เปิดสอน (Curricula)", path: "/programs" },
                { name: "ข้อมูลบุคลากร (Personnel)", path: "/personnel" },
            ]
        },
        {
            group: "Legal & Information",
            links: [
                { name: "นโยบายความเป็นส่วนตัว (Privacy Policy)", path: "/privacy-policy" },
                { name: "เงื่อนไขการใช้งาน (Terms of Service)", path: "/terms-of-service" },
                { name: "แผนผังเว็บไซต์ (Sitemap)", path: "/sitemap" },
            ]
        }
    ];

    return (
        <div className="pt-[10rem] pb-32 bg-white dark:bg-gray-950 min-h-screen">
            <div className="max-w-[800px] mx-auto px-6">
                <Reveal animation="fade-up">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">แผนผังเว็บไซต์</h1>
                    <p className="text-slate-500 mb-16 border-b border-slate-100 dark:border-slate-800 pb-8 uppercase tracking-[0.2em] text-[10px] font-black">Sitemap & Structure</p>
                </Reveal>

                <div className="space-y-16">
                    {siteMapData.map((section, idx) => (
                        <div key={idx} className="relative">
                            <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.3em] mb-8 flex items-center">
                                <span className="w-8 h-[1px] bg-primary-600 mr-4 opacity-30"></span>
                                {section.group}
                            </h2>
                            <div className="grid grid-cols-1 gap-1 pl-12">
                                {section.links.map((link, lIdx) => (
                                    <Link 
                                        key={lIdx} 
                                        to={link.path}
                                        className="group py-3 flex items-center justify-between border-b border-slate-50 dark:border-slate-900 hover:border-primary-500/20 transition-all"
                                    >
                                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary-600 font-medium transition-colors">
                                            {link.name}
                                        </span>
                                        <ChevronRight size={14} className="text-slate-300 dark:text-slate-700 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        © Sriracha Technological College Site Structure Management
                    </p>
                </div>
            </div>
        </div>
    );
}
