import Reveal from "./Reveal";

export default function BentoMenu() {
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
                            <a href="#enroll" className="bento-card min-h-[400px] h-full rounded-2xl relative overflow-hidden group block">
                                <img src="https://images.unsplash.com/photo-1523240915679-7f2171db6b0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Enroll" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-primary-400/20"></div>
                                <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center text-3xl">
                                            <i className="fas fa-user-plus"></i>
                                        </div>
                                        <i className="fas fa-external-link-alt text-white/50 group-hover:text-white transition-colors text-2xl"></i>
                                    </div>
                                    <div className="text-white">
                                        <h3 className="text-4xl font-black mb-4 uppercase">สมัครเรียน</h3>
                                        <p className="text-white/80 max-w-xs font-medium">เริ่มต้นการเรียนรู้สู่ความสำเร็จ ลงทะเบียนเพื่อรับข้อมูลและสิทธิพิเศษปีการศึกษา 2568</p>
                                    </div>
                                </div>
                            </a>
                        </Reveal>

                        {/* Square Items */}
                        <Reveal animation="zoom-in" delay={0.2}>
                            <a href="#programs" className="bento-card min-h-[200px] h-full rounded-2xl relative overflow-hidden group block">
                                <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Programs" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-primary-400/20"></div>
                                <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xl mb-4">
                                        <i className="fas fa-graduation-cap"></i>
                                    </div>
                                    <span className="font-black text-xl text-white uppercase">หลักสูตร</span>
                                </div>
                            </a>
                        </Reveal>

                        <Reveal animation="zoom-in" delay={0.3}>
                            <a href="#news" className="bento-card min-h-[200px] h-full rounded-2xl relative overflow-hidden group block">
                                <img src="https://images.unsplash.com/photo-1504711432869-5d39a160f4ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="News" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-primary-400/20"></div>
                                <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xl mb-4">
                                        <i className="fas fa-newspaper"></i>
                                    </div>
                                    <span className="font-black text-xl text-white uppercase">ข่าวสาร</span>
                                </div>
                            </a>
                        </Reveal>

                        {/* Wide Item */}
                        <Reveal animation="zoom-in" delay={0.4} className="col-span-2">
                            <a href="#contact" className="bento-card rounded-2xl relative overflow-hidden group block">
                                <img src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Contact" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-primary-400/20"></div>
                                <div className="relative z-10 p-8 flex items-center justify-between">
                                    <div className="flex items-center space-x-6 text-white">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center text-xl">
                                            <i className="fas fa-comments"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl uppercase">ติดต่อเรา</h4>
                                            <p className="text-white/70 text-sm">เราพร้อมให้คำปรึกษาตลอด 24 ชม.</p>
                                        </div>
                                    </div>
                                    <i className="fas fa-chevron-right text-white/50 group-hover:text-white transition-all group-hover:translate-x-2"></i>
                                </div>
                            </a>
                        </Reveal>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
