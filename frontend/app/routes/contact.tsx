import Reveal from "../components/Reveal";

export default function Contact() {
    return (
        <main className="pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">Get in touch</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-12 dark:text-white">ติดต่อเรา</h1>
                    
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-500 text-xl">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2 dark:text-white">ที่อยู่</h3>
                                    <p className="text-gray-500 dark:text-gray-400">84 ม.5 ถ.สุขุมวิท ต.ทุ่งศุขลา อ.ศรีราชา จ.ชลบุรี 20230</p>
                                </div>
                            </div>
                            {/* More contact info items... */}
                        </div>
                        
                        <div className="bento-card rounded-[3rem] p-10 bg-white dark:bg-gray-900 shadow-xl border dark:border-gray-800">
                            <form className="space-y-6">
                                <input type="text" placeholder="ชื่อของคุณ" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 dark:text-white dark:placeholder-gray-500" />
                                <input type="email" placeholder="อีเมลของคุณ" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 dark:text-white dark:placeholder-gray-500" />
                                <textarea placeholder="ข้อความของคุณ" rows={4} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 dark:text-white dark:placeholder-gray-500"></textarea>
                                <button className="w-full bg-primary-500 text-white py-4 rounded-2xl font-black hover:bg-primary-600 transition-all">ส่งข้อความ</button>
                            </form>
                        </div>
                    </div>
                </Reveal>
            </div>
        </main>
    );
}
