import Reveal from "../components/Reveal";

export default function Staff() {
    return (
        <main className="pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">Our Team</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-12">บุคลากร</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Placeholder for staff members */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bento-card rounded-[2rem] p-8 text-center">
                                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Staff" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">ชื่อ-นามสกุล</h3>
                                <p className="text-gray-500">ตำแหน่งงาน</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </main>
    );
}
