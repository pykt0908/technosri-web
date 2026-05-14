import Reveal from "../components/Reveal";

export default function TermsOfService() {
    return (
        <div className="pt-[8rem] pb-20 bg-white dark:bg-gray-950 min-h-screen">
            <div className="max-w-[1000px] mx-auto px-6">
                <Reveal animation="fade-up">
                    <span className="text-primary-600 font-black tracking-widest text-xs uppercase mb-4 block">Legal & Terms</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-10 leading-tight">ข้อกำหนดและเงื่อนไข<br/><span className="text-primary-500">(Terms of Service)</span></h1>
                </Reveal>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. การยอมรับเงื่อนไข</h2>
                        <p>การเข้าถึงและใช้งานเว็บไซต์ของวิทยาลัยเทคโนโลยีศรีราชา ถือว่าคุณได้ยอมรับและยินยอมปฏิบัติตามข้อกำหนดและเงื่อนไขเหล่านี้ทุกประการ หากคุณไม่เห็นด้วยโปรดหยุดการใช้งานเว็บไซต์ทันที</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. ทรัพย์สินทางปัญญา</h2>
                        <p>เนื้อหาทั้งหมดบนเว็บไซต์นี้ รวมถึงแต่ไม่จำกัดเพียง ข้อความ รูปภาพ โลโก้ กราฟิก วิดีโอ และซอฟต์แวร์ เป็นทรัพย์สินของวิทยาลัยเทคโนโลยีศรีราชา ห้ามมิให้มีการคัดลอก ดัดแปลง หรือนำไปใช้เพื่อประโยชน์ทางการค้าโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. ข้อจำกัดความรับผิดชอบ</h2>
                        <p>วิทยาลัยมุ่งหวังที่จะให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน อย่างไรก็ตาม เราไม่รับประกันความครบถ้วนหรือความแม่นยำของข้อมูลในระดับที่ไร้ข้อผิดพลาด และจะไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดขึ้นจากการนำข้อมูลไปใช้</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. การเชื่อมต่อไปยังเว็บไซต์ภายนอก</h2>
                        <p>เว็บไซต์อาจมีลิงก์ไปยังเว็บไซต์ของบุคคลที่สาม วิทยาลัยไม่มีอำนาจควบคุมและไม่รับผิดชอบต่อเนื้อหา นโยบายความเป็นส่วนตัว หรือแนวทางปฏิบัติของเว็บไซต์เหล่านั้น</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. การเปลี่ยนแปลงข้อกำหนด</h2>
                        <p>วิทยาลัยขอสงวนสิทธิ์ในการแก้ไขเปลี่ยนแปลงข้อกำหนดเหล่านี้ได้ทุกเมื่อ โดยไม่จำเป็นต้องแจ้งให้ทราบล่วงหน้า การใช้งานเว็บไซต์อย่างต่อเนื่องหลังการเปลี่ยนแปลงถือว่าคุณยอมรับเงื่อนไขใหม่นั้น</p>
                    </section>

                    <section className="bg-primary-50 dark:bg-primary-900/10 p-8 rounded-3xl border border-primary-100 dark:border-primary-800">
                        <p className="mb-0 text-primary-900 dark:text-primary-100 italic">"วิทยาลัยเทคโนโลยีศรีราชา มุ่งมั่นสร้างสังคมแห่งการเรียนรู้ที่ทันสมัยและปลอดภัยสำหรับทุกคน"</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
