import Reveal from "../components/Reveal";

export default function PrivacyPolicy() {
    return (
        <div className="pt-[8rem] pb-20 bg-white dark:bg-gray-950 min-h-screen">
            <div className="max-w-[1000px] mx-auto px-6">
                <Reveal animation="fade-up">
                    <span className="text-primary-600 font-black tracking-widest text-xs uppercase mb-4 block">Legal & Privacy</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-10 leading-tight">นโยบายความเป็นส่วนตัว<br/><span className="text-primary-500">(Privacy Policy)</span></h1>
                </Reveal>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. บทนำ</h2>
                        <p>วิทยาลัยเทคโนโลยีศรีราชา ("วิทยาลัย") ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคล และมุ่งมั่นที่จะรักษาความปลอดภัยและความเป็นส่วนตัวของคุณตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. ข้อมูลที่เราจัดเก็บ</h2>
                        <p>เราอาจจัดเก็บข้อมูลส่วนบุคคลของคุณผ่านการใช้งานเว็บไซต์ ดังนี้:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>ข้อมูลการติดต่อ: ชื่อ-นามสกุล, อีเมล, เบอร์โทรศัพท์ (ผ่านหน้าติดต่อเรา)</li>
                            <li>ข้อมูลการสมัครเรียน: ข้อมูลตามแบบฟอร์มการรับสมัครนักศึกษาใหม่</li>
                            <li>ข้อมูลทางเทคนิค: หมายเลข IP Address, ข้อมูลคุกกี้ (Cookies) เพื่อการวิเคราะห์การใช้งานเว็บไซต์</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. วัตถุประสงค์ในการเก็บรวบรวม</h2>
                        <p>เรานำข้อมูลของคุณไปใช้เพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>เพื่อให้บริการข้อมูลข่าวสารและกิจกรรมของวิทยาลัย</li>
                            <li>เพื่อดำเนินการรับสมัครนักศึกษาใหม่และประสานงานด้านวิชาการ</li>
                            <li>เพื่อปรับปรุงประสิทธิภาพการทำงานของเว็บไซต์ให้ดียิ่งขึ้น</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. การรักษาความปลอดภัย</h2>
                        <p>วิทยาลัยใช้มาตรฐานการรักษาความปลอดภัยทางเทคนิคและการบริหารจัดการที่เหมาะสม เพื่อป้องกันการสูญหาย การเข้าถึง การใช้ หรือการเปิดเผยข้อมูลส่วนบุคคลโดยมิชอบ</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. สิทธิของเจ้าของข้อมูล</h2>
                        <p>คุณมีสิทธิในการขอเข้าถึง ขอแก้ไข ขอระงับการใช้ หรือขอลบข้อมูลส่วนบุคคลของคุณที่อยู่ในความดูแลของวิทยาลัย โดยสามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลได้ทางช่องทางที่วิทยาลัยกำหนด</p>
                    </section>

                    <section className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">ติดต่อเรา</h2>
                        <p className="mb-0">หากคุณมีข้อสงสัยเกี่ยวกับนโยบายนี้ โปรดติดต่อ:</p>
                        <p className="font-bold text-primary-600">วิทยาลัยเทคโนโลยีศรีราชา (Sriracha Technological College)</p>
                        <p>ฝ่ายธุรการและสารสนเทศ</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
