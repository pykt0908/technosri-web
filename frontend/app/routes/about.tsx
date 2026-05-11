import Reveal from "../components/Reveal";

export default function AboutPage() {
    return (
        <main className="pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">About Us</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-12">เกี่ยวกับเรา</h1>
                    <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
                        <p className="mb-6">
                            วิทยาลัยเทคโนโลยีศรีราชา มุ่งเน้นการสร้างบุคลากรที่มีคุณภาพสู่สังคม...
                        </p>
                        {/* More content can be added here */}
                    </div>
                </Reveal>
            </div>
        </main>
    );
}
