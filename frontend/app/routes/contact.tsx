import { MapPin, Phone, Mail, Share2, ExternalLink, ShieldCheck } from "lucide-react";
import Reveal from "../components/Reveal";
import { useSettings } from "../hooks/useSettings";

export default function Contact() {
    const { settings } = useSettings();

    const contactInfo = [
        {
            icon: <MapPin className="w-5 h-5" />,
            title: "ที่ตั้งสถาบัน",
            details: settings.contact_address || "12/19 หมู่ที่ 2 ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี 20230",
            subDetails: "",
            color: "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
        },
        {
            icon: <Phone className="w-5 h-5" />,
            title: "เบอร์โทรศัพท์ติดต่อ",
            details: settings.contact_phone || "038-351-468",
            subDetails: "ในวันและเวลาทำการ",
            color: "text-slate-600 bg-slate-100 dark:bg-slate-800"
        },
        {
            icon: <Mail className="w-5 h-5" />,
            title: "ช่องทางอีเมล",
            details: settings.contact_email || "technosriracha@gmail.com",
            subDetails: "สำหรับการติดต่อประสานงาน",
            color: "text-slate-600 bg-slate-100 dark:bg-slate-800"
        },
    ];

    return (
        <main className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-24 overflow-hidden relative">
            {/* Professional Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100 dark:bg-slate-900/50 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <header className="mb-16">
                    <Reveal>
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-primary-600 uppercase tracking-[0.2em] mb-4">
                            <ShieldCheck size={14} />
                            <span>Contact Us</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight uppercase mb-4 tracking-tight">
                            ช่องทางติดต่อ <br />
                            <span className="text-primary-600">วิทยาลัยเทคโนโลยีศรีราชา</span>
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
                            ท่านสามารถติดต่อเราได้ตามช่องทางอย่างเป็นทางการด้านล่างนี้
                        </p>
                    </Reveal>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Map Section */}
                    <div className="lg:col-span-7">
                        <Reveal delay={0.1}>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-800 h-full min-h-[500px]">
                                <div className="relative h-full min-h-[500px] rounded-xl overflow-hidden grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3885.8991177944304!2d100.9122696!3d13.105577!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102b9c0490daf0d%3A0x64d7370ddd52cff!2z4Lin4Li04LiX4Lii4Liy4Lil4Lix4Lii4LmA4LiX4LiE4LmC4LiZ4LmC4Lil4Lii4Li14Lio4Lij4Li14Lij4Liy4LiK4Liy!5e0!3m2!1sth!2sth!4v1778541533024!5m2!1sth!2sth"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: '500px' }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="opacity-90"
                                    ></iframe>
                                    <div className="absolute bottom-6 right-6">
                                        <a
                                            href="https://maps.app.goo.gl/rGHfSxzF6f1BzDVV7"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white dark:bg-slate-800 px-6 py-3 rounded-lg shadow-2xl text-xs font-black flex items-center space-x-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all uppercase tracking-widest"
                                        >
                                            <ExternalLink size={16} />
                                            <span>เปิดใน Google Maps</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {contactInfo.map((info, index) => (
                                <Reveal key={index} delay={0.2 + (index * 0.1)}>
                                    <div className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary-500/20 transition-all duration-500">
                                        <div className="flex items-center space-x-6">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${info.color}`}>
                                                {info.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{info.title}</h3>
                                                <p className="text-lg font-black text-slate-800 dark:text-white mb-0.5 leading-tight">{info.details}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{info.subDetails}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {/* Social Media Link Card */}
                        <Reveal delay={0.3}>
                            <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-8 text-white mt-4 border border-slate-800 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/20 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400">Social Media</h3>
                                        <p className="text-sm font-bold">ติดตามข่าวผ่านโซเชียลมีเดีย</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <a href="https://www.facebook.com/technosriracha38/" target="_blank" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-all border border-white/10 shadow-sm"><i className="fab fa-facebook-f text-lg"></i></a>
                                        <a href={`https://line.me/ti/p/${settings.line_id || '@technosri'}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00b900] transition-all border border-white/10 shadow-sm"><i className="fab fa-line text-2xl"></i></a>
                                        <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/10 shadow-sm"><i className="fab fa-tiktok text-lg"></i></a>
                                    </div>
                                </div>
                            </div>
                        </Reveal>


                    </div>
                </div>
            </div>
        </main>
    );
}
