export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 pt-20 pb-10 border-t-4 border-primary-600" id="contact">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-white p-2 rounded-xl">
                                <img src="/logo_sriracha.png" alt="Logo" className="h-16 w-auto" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">วิทยาลัยเทคโนโลยีศรีราชา</h2>
                                <p className="text-sm text-primary-400">Sriracha Technological College</p>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-8 max-w-md">
                            มุ่งเน้นความเป็นเลิศทางนวัตกรรมและเทคโนโลยี สร้างความพร้อมให้นักศึกษาสู่ตลาดแรงงานระดับสากล
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-primary-600 transition-colors text-white" aria-label="Facebook">
                                <i className="fab fa-facebook-f" aria-hidden="true"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-primary-600 transition-colors text-white" aria-label="Line">
                                <i className="fab fa-line" aria-hidden="true"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-primary-600 transition-colors text-white" aria-label="TikTok">
                                <i className="fab fa-tiktok" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-8">
                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">หลักสูตร</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-primary-500 transition-colors">ช่างอุตสาหกรรม</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">พาณิชยกรรม</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">เทคโนโลยีสารสนเทศ</a></li>
                                <li><a href="#" className="hover:text-primary-500 transition-colors">หลักสูตรระยะสั้น</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-4">
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">ติดต่อเรา</h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 flex-shrink-0 flex items-center justify-center text-primary-500">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <span>84 ม.5 ถ.สุขุมวิท ต.ทุ่งศุขลา อ.ศรีราชา จ.ชลบุรี 20230</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 flex-shrink-0 flex items-center justify-center text-primary-500">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <span>038-490333, 038-490334</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 flex-shrink-0 flex items-center justify-center text-primary-500">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <span>info@stech.ac.th</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© 2026 Sriracha Technological College. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
