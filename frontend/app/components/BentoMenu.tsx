import { NavLink } from "react-router";
import Reveal from "./Reveal";
import { useSettings } from "../hooks/useSettings";

export default function BentoMenu() {
    const { settings } = useSettings();

    const enrollmentUrl = settings.enrollment_link || "https://admission.technosri.ac.th";

    return (
        <section className="bg-primary-900 py-32 relative overflow-hidden">
            <Reveal animation="reveal" className="relative z-10">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-400/10 rounded-full blur-[100px]"></div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Large Item */}
                        <Reveal animation="zoom-in" className="col-span-2 row-span-1 md:row-span-2">
                            <a href={enrollmentUrl} target="_blank" rel="noopener noreferrer" className="bento-card min-h-[400px] h-full rounded-2xl relative overflow-hidden group block" aria-label="สมัครเรียนออนไลน์">
                                <img src="/images/img-2.jpg" alt="Enroll" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" width="800" height="400" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-primary-400/20"></div>
                                <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center text-3xl">
                                            <i className="fas fa-user-plus" aria-hidden="true"></i>
                                        </div>
                                        <i className="fas fa-external-link-alt text-white/50 group-hover:text-white transition-colors text-2xl" aria-hidden="true"></i>
                                    </div>
                                    <div className="text-white">
                                        <h2 className="text-4xl font-black mb-4 uppercase">สมัครเรียน</h2>
                                    </div>
                                </div>
                            </a>
                        </Reveal>

                        {/* Square Items */}
                        <Reveal animation="zoom-in" delay={0.2}>
                            <NavLink to="/programs" className="bento-card min-h-[200px] h-full rounded-2xl relative overflow-hidden group block" aria-label="ดูหลักสูตรที่เปิดสอน">
                                <img src="/images/img-5.jpg" alt="Programs" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" width="400" height="200" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-primary-400/20"></div>
                                <div className="relative z-10 p-8 h-full flex flex-col items-start justify-top text-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xl mb-4">
                                        <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                                    </div>
                                    <span className="font-black text-xl text-white uppercase">หลักสูตร</span>
                                </div>
                            </NavLink>
                        </Reveal>

                        <Reveal animation="zoom-in" delay={0.3}>
                            <NavLink to="/news" className="bento-card min-h-[200px] h-full rounded-2xl relative overflow-hidden group block" aria-label="ติดตามข่าวสารล่าสุด">
                                <img src="/images/img-3.jpg" alt="News" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" width="400" height="200" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-primary-400/20"></div>
                                <div className="relative z-10 p-8 h-full flex flex-col items-start justify-top text-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xl mb-4">
                                        <i className="fas fa-newspaper" aria-hidden="true"></i>
                                    </div>
                                    <span className="font-black text-xl text-white uppercase">ข่าวสาร</span>
                                </div>
                            </NavLink>
                        </Reveal>

                        {/* Wide Item */}
                        <Reveal animation="zoom-in" delay={0.4} className="col-span-2">
                            <NavLink to="/contact" className="bento-card min-h-[240px] rounded-2xl relative overflow-hidden group block" aria-label="ติดต่อสถาบัน">
                                <img src="/images/img-4.jpg" alt="Contact" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000" width="800" height="240" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-primary-400/20"></div>
                                <div className="relative z-10 p-8 flex items-center justify-between">
                                    <div className="flex items-center space-x-6 text-white">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xl">
                                            <i className="fas fa-comments" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xl uppercase">ติดต่อเรา</h3>
                                        </div>
                                    </div>
                                    <i className="fas fa-chevron-right text-white/50 group-hover:text-white transition-all group-hover:translate-x-2" aria-hidden="true"></i>
                                </div>
                            </NavLink>
                        </Reveal>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
