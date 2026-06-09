import Reveal from "./Reveal";

const organizations = [
    {
        name: "กระทรวงศึกษาธิการ",
        english: "Ministry of Education",
        logo: "/images/logo-wall/กระทรวงศึกษาธิการ.png",
        role: "หลักสูตรและการรับรอง",
        url: "https://www.moe.go.th"
    },
    {
        name: "สำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน",
        english: "OPEC (สช.)",
        logo: "/images/logo-wall/สำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน.png",
        role: "การส่งเสริมการศึกษาเอกชน",
        url: "https://opec.go.th"
    },
    {
        name: "กองทุนเงินให้กู้ยืมเพื่อการศึกษา",
        english: "Student Loan Fund (กยศ.)",
        logo: "/images/logo-wall/กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.).webp",
        role: "กองทุนเพื่อโอกาสการเรียนรู้",
        url: "https://www.studentloan.or.th"
    },
    {
        name: "สมาคมวิทยาลัยเทคโนโลยีและอาชีวศึกษาเอกชนฯ",
        english: "PVAT",
        logo: "/images/logo-wall/สมาคมวิทยาลัยเทคโนโลยีและอาชีวศึกษาเอกชนแห่งประเทศไทย.png",
        role: "เครือข่ายความร่วมมือการพัฒนา",
        url: "http://www.pvet.or.th/"
    },
    {
        name: "สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ",
        english: "ThaiHealth (สสส.)",
        logo: "/images/logo-wall/สสส.jpg",
        role: "ส่งเสริมสุขภาวะในสถานศึกษา",
        url: "https://www.thaihealth.or.th"
    },
    {
        name: "ศูนย์ฝึกนักศึกษาวิชาทหาร มทบ.14",
        english: "Military District 14 R.O.T.C.",
        logo: "/images/logo-wall/มทบ14.png",
        role: "การฝึกนักศึกษาวิชาทหาร",
        url: "https://www.facebook.com/mstcmc14?locale=th_TH"
    },
    {
        name: "สำนักงานรับรองมาตรฐานและประเมินคุณภาพฯ",
        english: "ONESQA (สมศ.)",
        logo: "/images/logo-wall/สำนักงานรับรองมาตรฐาน.png",
        role: "การประกันและประเมินคุณภาพ",
        url: "https://www.onesqa.or.th"
    },
    {
        name: "กระทรวงแรงงาน",
        english: "Ministry of Labour",
        logo: "/images/logo-wall/กระทรวงแรงงาน.png",
        role: "พัฒนาฝีมือแรงงานและจัดหางาน",
        url: "https://www.mol.go.th"
    },
    {
        name: "สถาบันคุณวุฒิวิชาชีพ (องค์การมหาชน)",
        english: "TPQI (สคช.)",
        logo: "/images/logo-wall/สถาบันพัฒนาคุณวุฒิ.webp",
        role: "การประเมินมาตรฐานวิชาชีพ",
        url: "https://www.tpqi.go.th"
    }
];

export default function TrustSection() {
    const row1 = organizations.slice(0, 5);
    const row2 = organizations.slice(5, 9);
    
    const row1Repeated = Array(8).fill(row1).flat();
    const row2Repeated = Array(8).fill(row2).flat();

    return (
        <section className="bg-slate-50 dark:bg-slate-950 py-20 relative overflow-hidden border-t border-b border-slate-200 dark:border-slate-900" id="trust-section">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 mb-16">
                <Reveal>
                    <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-3 block">
                        Partnerships
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase leading-none text-slate-900 dark:text-white">
                        หน่วยงานที่เกี่ยวข้อง
                    </h2>
                </Reveal>
            </div>

            {/* Desktop Marquee Flows */}
            <div className="hidden lg:flex relative w-full flex flex-col gap-6 select-none overflow-hidden py-4">
                {/* Row 1: Left scrolling */}
                <div className="marquee-wrapper">
                    <div className="animate-marquee-left hover:pause">
                        {row1Repeated.map((org, index) => (
                            <a href={org.url} target="_blank" rel="noopener noreferrer" key={`row1-${index}`} className="org-card">
                                <div className="logo-container bg-white">
                                    <img src={org.logo} alt={org.name} className="logo-image" loading="lazy" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Row 2: Right scrolling */}
                <div className="marquee-wrapper">
                    <div className="animate-marquee-right hover:pause">
                        {row2Repeated.map((org, index) => (
                            <a href={org.url} target="_blank" rel="noopener noreferrer" key={`row2-${index}`} className="org-card">
                                <div className="logo-container bg-white">
                                    <img src={org.logo} alt={org.name} className="logo-image" loading="lazy" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet Static Grid (Shows all logos at once) */}
            <div className="lg:hidden relative z-10 px-6 max-w-[1440px] mx-auto select-none">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 justify-center justify-items-center">
                    {organizations.map((org, index) => (
                        <a 
                            href={org.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            key={`grid-${index}`} 
                            className="grid-org-card"
                            title={org.name}
                        >
                            <img src={org.logo} alt={org.name} className="logo-image" loading="lazy" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                .marquee-wrapper {
                    display: flex;
                    overflow: hidden;
                    width: 100%;
                    mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
                }

                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }

                .animate-marquee-left {
                    display: flex;
                    gap: 1.5rem;
                    animation: scroll-left 35s linear infinite;
                }

                .animate-marquee-right {
                    display: flex;
                    gap: 1.5rem;
                    animation: scroll-right 35s linear infinite;
                }

                .hover\\:pause:hover {
                    animation-play-state: paused;
                }

                .org-card {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 15rem;
                    height: 15rem;
                    flex-shrink: 0;
                    background: transparent;
                    border: none;
                    box-shadow: none;
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .dark .org-card {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                }

                .logo-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 15rem;
                    height: 15rem;
                    border-radius: 2.25rem;
                    flex-shrink: 0;
                    background: #ffffff;
                    padding: 1.5rem;
                    border: 1px solid rgba(148, 163, 184, 0.1);
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .dark .logo-container {
                    background: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.2);
                }

                .org-card:hover .logo-container {
                    border-color: rgba(30, 162, 255, 0.35);
                    box-shadow: 0 20px 40px -15px rgba(30, 162, 255, 0.18);
                }

                .logo-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }

                .grid-org-card {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 5.5rem;
                    height: 5.5rem;
                    border-radius: 1rem;
                    background: #ffffff;
                    padding: 0.55rem;
                    border: 1px solid rgba(148, 163, 184, 0.12);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .dark .grid-org-card {
                    background: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .grid-org-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(30, 162, 255, 0.35);
                    box-shadow: 0 10px 20px -5px rgba(30, 162, 255, 0.15);
                }

                @media (min-width: 640px) {
                    .grid-org-card {
                        width: 7.5rem;
                        height: 7.5rem;
                        border-radius: 1.5rem;
                        padding: 0.75rem;
                    }
                }
            `}</style>
        </section>
    );
}
