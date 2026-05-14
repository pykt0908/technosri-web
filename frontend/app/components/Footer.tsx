import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { NavLink } from "react-router";
import { useSettings } from "../hooks/useSettings";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { settings } = useSettings();

    return (
        <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 border-t border-slate-900" id="contact">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center space-x-5 mb-8">
                            <div className="bg-white p-2.5 rounded-xl shadow-xl shadow-white/5">
                                <img src="/logo_sriracha.png" alt="Sriracha Technological College Logo" className="h-12 w-auto" width="48" height="48" />
                            </div>
                            <div className="border-l border-slate-800 pl-5">
                                <h2 className="text-xl font-black text-white leading-tight tracking-tight uppercase">วิทยาลัยเทคโนโลยีศรีราชา</h2>
                                <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mt-1">Sriracha Technological College</p>
                            </div>
                        </div>
                        <p className="text-slate-400 mb-10 max-w-sm text-sm leading-relaxed font-medium">
                            "มุ่งเน้นความเป็นเลิศทางนวัตกรรมและเทคโนโลยี สร้างความพร้อมให้นักศึกษาสู่ตลาดแรงงานระดับสากล ด้วยมาตรฐานการศึกษาระดับคุณภาพ"
                        </p>
                        <div className="flex space-x-3">
                            <a href="https://www.facebook.com/technosriracha38/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary-600 hover:border-primary-500 transition-all text-white group shadow-sm" aria-label="Facebook วิทยาลัยเทคโนโลยีศรีราชา">
                                <i className="fab fa-facebook-f text-lg group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                            </a>
                            <a href={`https://line.me/ti/p/${settings.line_id || '@technosri'}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-[#00b900] hover:border-[#00b900] transition-all text-white group shadow-sm" aria-label="Line วิทยาลัยเทคโนโลยีศรีราชา">
                                <i className="fab fa-line text-2xl group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                            </a>
                            <a href="https://technosriracha.ac.th/" className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-white hover:text-black transition-all group shadow-sm" aria-label="เว็บไซต์สถาบัน">
                                <i className="fas fa-globe text-lg group-hover:scale-110 transition-transform" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-bold mb-8 uppercase tracking-widest text-sm border-b border-slate-800 pb-4 inline-block">เมนูนำทาง</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li>
                                <NavLink to="/" className="text-slate-400 hover:text-primary-500 transition-colors flex items-center group">
                                    <ChevronRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> หน้าแรก
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className="text-slate-400 hover:text-primary-500 transition-colors flex items-center group">
                                    <ChevronRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> เกี่ยวกับเรา
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/programs" className="text-slate-400 hover:text-primary-500 transition-colors flex items-center group">
                                    <ChevronRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> หลักสูตรที่เปิดสอน
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact" className="text-slate-400 hover:text-primary-500 transition-colors flex items-center group">
                                    <ChevronRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> ติดต่อสถาบัน
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information Section */}
                    <div className="lg:col-span-4">
                        <h3 className="text-white font-bold mb-8 uppercase tracking-widest text-sm border-b border-slate-800 pb-4 inline-block">ข้อมูลการติดต่อ</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center text-primary-500 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <MapPin size={18} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-100 mb-1">ที่ตั้งสถาบัน</p>
                                    <p className="text-slate-400 leading-relaxed">{settings.contact_address || "12/19 หมู่ที่ 2 ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี 20230"}</p>
                                </div>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center text-primary-500 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <Phone size={18} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-100 mb-1">เบอร์โทรศัพท์</p>
                                    <p className="text-slate-400">{settings.contact_phone || "038-351-468"}</p>
                                </div>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center text-primary-500 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <Mail size={18} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-100 mb-1">อีเมลติดต่อ</p>
                                    <p className="text-slate-400">{settings.contact_email || "technosriracha@gmail.com"}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-slate-400">
                    <div className="flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
                        <p>© {currentYear} Sriracha Technological College.</p>
                        <span className="hidden md:inline text-slate-800">|</span>
                        <p className="text-primary-700 font-bold uppercase tracking-widest text-[10px]">All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6 mt-6 md:mt-0 text-[11px] font-bold uppercase tracking-widest">
                        <NavLink to="/privacy-policy" className="hover:text-primary-500 transition-colors">Privacy Policy</NavLink>
                        <NavLink to="/terms-of-service" className="hover:text-primary-500 transition-colors">Legal Terms</NavLink>
                        <NavLink to="/sitemap" className="hover:text-primary-500 transition-colors">Sitemap</NavLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}
