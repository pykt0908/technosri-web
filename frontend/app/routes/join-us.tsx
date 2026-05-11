import Reveal from "../components/Reveal";

export default function JoinUs() {
    return (
        <main className="pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">Careers</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-12 dark:text-white">ร่วมงานกับเรา</h1>
                    <div className="bg-primary-50 dark:bg-gray-900 rounded-[3rem] p-12">
                        <h2 className="text-3xl font-black mb-6 dark:text-white">มาร่วมเป็นส่วนหนึ่งของครอบครัวเรา</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">
                            เรากำลังมองหาบุคลากรที่มีความสามารถและแรงบันดาลใจในการร่วมสร้างอนาคตทางการศึกษา...
                        </p>
                        <button className="bg-primary-500 text-white px-8 py-3 rounded-full font-black hover:bg-primary-600 transition-all">
                            ดูตำแหน่งที่เปิดรับ
                        </button>
                    </div>
                </Reveal>
            </div>
        </main>
    );
}
