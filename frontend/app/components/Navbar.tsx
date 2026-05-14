import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error("Failed to fetch settings");
            }
        };

        window.addEventListener("scroll", handleScroll);
        fetchSettings();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "หน้าแรก", href: "/", icon: "fas fa-home" },
        { name: "เกี่ยวกับเรา", href: "/about", icon: "fas fa-info-circle" },
        { name: "หลักสูตร", href: "/programs", icon: "fas fa-graduation-cap" },
        { name: "บุคลากร", href: "/personnel", icon: "fas fa-users" },
        { name: "ร่วมงานกับเรา", href: "/join-us", icon: "fas fa-briefcase" },
        { name: "ติดต่อเรา", href: "/contact", icon: "fas fa-envelope" },
    ];

    const enrollmentUrl = settings.enrollment_link || "https://admission.technosri.ac.th";
    const enrollmentQr = settings.enrollment_qr ? `${import.meta.env.VITE_API_URL}/storage/${settings.enrollment_qr}` : null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(enrollmentUrl);
        toast.success("คัดลอกลิงก์เรียบร้อยแล้ว");
    };

    return (
        <>
            <nav className={`fixed z-50 flex items-center transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] left-0 right-0 mx-auto ${scrolled ? "nav-pill" : "nav-full dark:bg-gray-950/90 dark:border-gray-800"}`} id="navbar">
                <div className="flex items-center w-full max-w-[1440px] mx-auto relative h-full">
                    {/* Left: Logo */}
                    <div className="flex-1 flex items-center">
                        <NavLink to="/" className="flex items-center space-x-3" aria-label="กลับสู่หน้าหลัก วิทยาลัยเทคโนโลยีศรีราชา" onClick={() => setIsMenuOpen(false)}>
                            <img src="/logo_sriracha.png" alt="โลโก้วิทยาลัยเทคโนโลยีศรีราชา" className="h-10 w-auto" width="40" height="40" />
                            <div className="flex flex-col leading-none">
                                <span className="font-black text-sm tracking-tight text-primary-700 whitespace-nowrap uppercase">วิทยาลัยเทคโนโลยีศรีราชา</span>
                                <span className="text-[0.6rem] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">Sriracha Technological College</span>
                            </div>
                        </NavLink>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="hidden lg:flex flex-[3] justify-center items-center space-x-6" role="menubar">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                role="menuitem"
                                className={({ isActive }) =>
                                    `text-[0.8rem] font-bold transition-colors flex items-center space-x-2 ${isActive ? "text-primary-600" : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                                    }`
                                }
                            >
                                <i className={`${link.icon} text-xs opacity-60`} aria-hidden="true"></i>
                                <span>{link.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Right: Action Button / Mobile Toggle */}
                    <div className="flex-1 flex items-center justify-end space-x-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsEnrollModalOpen(true)}
                            className="hidden sm:flex bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-primary-700 transition-all items-center space-x-3 group shadow-lg shadow-primary-500/20"
                            aria-label="สมัครเรียนออนไลน์ ปีการศึกษา 2568"
                        >
                            <i className="fas fa-clipboard-check text-lg"></i>
                            <span>สมัครเรียน</span>
                            <i className="fas fa-qrcode opacity-70"></i>
                        </button>
                        {/* Mobile Menu Btn */}
                        <button
                            className="lg:hidden text-gray-900 dark:text-white p-2 ml-4 focus:outline-none focus:ring-2 focus:ring-primary-600 rounded-lg relative z-[60]"
                            aria-label={isMenuOpen ? "ปิดเมนูนำทาง" : "เปิดเมนูนำทาง"}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`} aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[55] bg-white dark:bg-gray-950 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-[-10px]"}`}>
                <div className="flex flex-col h-full pt-32 px-10 pb-10">
                    <div className="space-y-6">
                        {navLinks.map((link, index) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `text-4xl font-black uppercase transition-all flex items-center space-x-4 ${isActive ? "text-primary-600 translate-x-4" : "text-gray-300 dark:text-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                                    }`
                                }
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <i className={`${link.icon} text-2xl opacity-40`} aria-hidden="true"></i>
                                <span>{link.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                setIsEnrollModalOpen(true);
                            }}
                            className="w-full bg-primary-600 text-white py-4 px-8 rounded-2xl text-xl font-black text-center flex items-center justify-between shadow-xl group hover:bg-primary-700 transition-all"
                        >
                            <i className="fas fa-clipboard-check text-2xl"></i>
                            <span className="flex-1 text-center">สมัครเรียน</span>
                            <i className="fas fa-qrcode text-2xl opacity-80"></i>
                        </button>
                        <div className="mt-8 flex justify-center space-x-8 text-gray-400">
                            <a href="https://www.facebook.com/technosriracha38/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary-600 transition-colors" aria-label="Facebook วิทยาลัยเทคโนโลยีศรีราชา">
                                <i className="fab fa-facebook-f" aria-hidden="true"></i>
                            </a>
                            <a href={`https://line.me/ti/p/${settings.line_id || '@technosri'}`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary-600 transition-colors" aria-label="Line วิทยาลัยเทคโนโลยีศรีราชา">
                                <i className="fab fa-line" aria-hidden="true"></i>
                            </a>
                            <a href="https://www.tiktok.com/@technosriracha" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary-600 transition-colors" aria-label="TikTok วิทยาลัยเทคโนโลยีศรีราชา">
                                <i className="fab fa-tiktok" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enroll Modal */}
            <AnimatePresence>
                {isEnrollModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEnrollModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center space-x-3 text-primary-600 uppercase tracking-widest font-black text-[10px]">
                                        <i className="fas fa-sparkles animate-pulse"></i>
                                    </div>
                                    <button
                                        onClick={() => setIsEnrollModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                                        aria-label="ปิดหน้าต่างสมัครเรียน"
                                    >
                                        <i className="fas fa-times text-xl" aria-hidden="true"></i>
                                    </button>
                                </div>

                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">สมัครเรียนออนไลน์</h2>
                                    <p className="text-sm text-slate-500 font-medium italic">สแกนเพื่อเข้าสู่ระบบรับสมัครนักศึกษาใหม่</p>
                                </div>

                                <div className="flex justify-center mb-10">
                                    <div className="relative group p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                                        <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm border border-slate-200">
                                            {enrollmentQr ? (
                                                <img src={enrollmentQr} alt="QR Code" className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-300">
                                                    <i className="fas fa-qrcode text-6xl opacity-30"></i>
                                                    <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">TechnoSri QR</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-primary-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-primary-500/20 m-1"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            readOnly
                                            value={enrollmentUrl}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-5 pr-24 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="absolute right-2 top-2 bottom-2 bg-primary-600 text-white px-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center space-x-2"
                                        >
                                            <i className="fas fa-copy"></i>
                                            <span className="ml-2">Copy</span>
                                        </button>
                                    </div>

                                    <a
                                        href={enrollmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                                    >
                                        <i className="fas fa-external-link-alt mr-3"></i> เปิดลิงก์รับสมัคร
                                    </a>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <i className="fas fa-check-circle text-green-500"></i>
                                    <span>วิทยาลัยเทคโนโลยีศรีราชา</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
