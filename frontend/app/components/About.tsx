import Reveal from "./Reveal";

export default function About() {
    return (
        <section id="about" className="py-24 bg-primary-900 text-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-600/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[100px] animate-pulse"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <Reveal>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-primary-400">ก้าวแรกสู่ชีวิต</span><br />
                            ที่ออกแบบได้
                        </h3>
                        <p className="text-primary-100/80 text-xl mb-6 leading-relaxed font-light max-w-xl">
                            เพราะทุกก้าวเล็ก ๆ คือจุดเริ่มต้นของความยิ่งใหญ่ในวันข้างหน้า
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-12 text-primary-300 font-medium text-sm italic opacity-80">
                            <span>#StechJourney</span>
                            <span>#เรียนสร้างอนาคต</span>
                            <span>#อาชีวะคุณภาพ</span>
                            <span>#เส้นทางที่เราเลือก</span>
                            <span>#ชีวิตที่ออกแบบได้เอง</span>
                        </div>
                    </Reveal>

                    <Reveal delay={0.4} animation="fade-up" className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500 to-primary-300 rounded-[3rem] opacity-20 blur-2xl animate-pulse"></div>
                        <div className="relative bg-primary-800/40 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] shadow-2xl overflow-hidden">
                            {/* Main Presentation Image */}
                            <div className="relative rounded-[1rem] overflow-hidden group aspect-video">
                                <iframe
                                    className="w-full h-full absolute inset-0"
                                    src="https://www.youtube-nocookie.com/embed/nlsq8X5kpnw?autoplay=0&mute=0&controls=1&rel=0"
                                    title="STC Sriracha Technological College"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>

                        {/* Decorative Elements outside the box */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-600/30 rounded-full blur-2xl"></div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
