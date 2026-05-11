import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "หน้าแรก", href: "/", icon: "fas fa-home" },
        { name: "เกี่ยวกับเรา", href: "/about", icon: "fas fa-info-circle" },
        { name: "หลักสูตร", href: "/programs", icon: "fas fa-graduation-cap" },
        { name: "บุคลากร", href: "/staff", icon: "fas fa-users" },
        { name: "ร่วมงานกับเรา", href: "/join-us", icon: "fas fa-briefcase" },
        { name: "ติดต่อเรา", href: "/contact", icon: "fas fa-envelope" },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav className={`fixed z-50 flex items-center transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] left-0 right-0 mx-auto ${scrolled ? "nav-pill" : "nav-full dark:bg-gray-950/90 dark:border-gray-800"}`} id="navbar">
                <div className="flex items-center w-full max-w-[1440px] mx-auto relative h-full">
                    {/* Left: Logo */}
                    <div className="flex-1 flex items-center">
                        <NavLink to="/" className="flex items-center space-x-3" aria-label="กลับสู่หน้าหลัก วิทยาลัยเทคโนโลยีศรีราชา" onClick={() => setIsMenuOpen(false)}>
                            <img src="/logo_sriracha.png" alt="โลโก้วิทยาลัยเทคโนโลยีศรีราชา" className="h-10 w-auto" width="40" height="40" />
                            <div className="flex flex-col leading-none">
                                <span className="font-black text-sm tracking-tight text-primary-600 whitespace-nowrap uppercase">วิทยาลัยเทคโนโลยีศรีราชา</span>
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
                                    `text-[0.8rem] font-bold transition-colors flex items-center space-x-2 ${
                                        isActive ? "text-primary-600" : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
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
                        <NavLink 
                        to="/#enroll" 
                        className="hidden sm:flex bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-primary-700 transition-all items-center space-x-3 group shadow-lg shadow-primary-500/20"
                        aria-label="สมัครเรียนออนไลน์ ปีการศึกษา 2568"
                    >
                        <i className="fas fa-clipboard-check text-base" aria-hidden="true"></i>
                        <span>สมัครเรียน</span>
                        <i className="fas fa-qrcode text-base opacity-70" aria-hidden="true"></i>
                    </NavLink>
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
                                    `text-4xl font-black uppercase transition-all flex items-center space-x-4 ${
                                        isActive ? "text-primary-600 translate-x-4" : "text-gray-300 dark:text-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
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
                        <NavLink 
                            to="/#enroll" 
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full bg-primary-600 text-white py-4 px-8 rounded-2xl text-xl font-black text-center flex items-center justify-between shadow-xl group hover:bg-primary-700 transition-all"
                        >
                            <i className="fas fa-clipboard-check text-2xl" aria-hidden="true"></i>
                            <span className="flex-1">สมัครเรียน</span>
                            <i className="fas fa-qrcode text-2xl opacity-80" aria-hidden="true"></i>
                        </NavLink>
                        <div className="mt-8 flex justify-center space-x-8 text-gray-400">
                            <a href="#" className="text-2xl hover:text-primary-600 transition-colors"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="text-2xl hover:text-primary-600 transition-colors"><i className="fab fa-line"></i></a>
                            <a href="#" className="text-2xl hover:text-primary-600 transition-colors"><i className="fab fa-tiktok"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
