import Reveal from "./Reveal";

export default function News() {
    return (
        <section id="news" className="py-32 bg-white dark:bg-gray-950">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <Reveal>
                        <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">PR & News</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none dark:text-white">ประชาสัมพันธ์</h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm font-medium mt-6 md:mt-0">
                            ติดตามข่าวสาร กิจกรรม และความเคลื่อนไหวต่างๆ ของวิทยาลัยเทคโนโลยีศรีราชา
                        </p>
                    </Reveal>
                </div>

                {/* Asymmetrical Image Grid (PR Version) */}
                <div className="grid lg:grid-cols-12 gap-6">
                    <Reveal delay={0.3} className="lg:col-span-7 h-[500px] overflow-hidden rounded-[2rem] relative group">
                        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Featured" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2 block">Featured Activity</span>
                            <h4 className="text-2xl font-black uppercase">นวัตกรรมระดับสากล 2026</h4>
                        </div>
                    </Reveal>
                    <div className="lg:col-span-5 grid grid-cols-2 gap-6">
                        <Reveal delay={0.4} className="h-[240px] overflow-hidden rounded-[2rem]">
                            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Student Life" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                        </Reveal>
                        <Reveal delay={0.5} className="h-[240px] bg-primary-500 rounded-[2rem] flex flex-col items-center justify-center text-white">
                            <span className="text-5xl font-black mb-2">PR</span>
                            <span className="text-sm font-bold uppercase tracking-widest">ข่าวสาร STC</span>
                        </Reveal>
                        <Reveal delay={0.6} className="col-span-2 h-[236px] overflow-hidden rounded-[2rem]">
                            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="IT Center" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
