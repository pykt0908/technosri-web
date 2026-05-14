import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("admin_token", data.token);
                localStorage.setItem("admin_user", JSON.stringify(data.user));
                navigate("/admin");
            } else {
                setError(data.message || "ข้อมูลประจำตัวไม่ถูกต้อง");
            }
        } catch (err) {
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex overflow-hidden font-sans">
            <div className="grid lg:grid-cols-2 w-full">
                {/* Left Side: Branding & Image */}
                <div className="hidden lg:flex relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
                    {/* Background Pattern/Image */}
                    <div className="absolute inset-0 opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1523050335392-9bc5675e4774?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-slate-900/90"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 text-white max-w-lg"
                    >
                        <img src="/logo_sriracha.png" className="h-28 mb-10 bg-white p-4 rounded-3xl shadow-2xl" alt="Logo" />
                        <h2 className="text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
                            Content <br />
                            Management <br />
                            <span className="text-primary-400">System</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-primary-500 mb-8 rounded-full"></div>
                    </motion.div>

                    {/* Animated Circles */}
                    <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white dark:bg-slate-950">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md"
                    >
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-10">
                            <img src="/logo_sriracha.png" className="h-24 mx-auto mb-6 bg-white p-3 rounded-2xl shadow-lg border border-slate-100" alt="Logo" />
                        </div>

                        <div className="mb-12">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Sign In</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">กรุณาเข้าสู่ระบบด้วยบัญชีของคุณ</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 border-l-4 border-red-500 text-red-600 p-4 rounded-md text-sm font-bold mb-8 flex items-center shadow-sm"
                            >
                                <i className="fas fa-exclamation-triangle mr-3"></i> {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="peer w-full px-5 pt-6 pb-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none text-slate-800 dark:text-white placeholder-transparent"
                                    placeholder="Email"
                                />
                                <label 
                                    htmlFor="email"
                                    className="absolute left-5 top-4 text-slate-400 text-xs font-black uppercase tracking-widest transition-all pointer-events-none
                                    peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium
                                    peer-focus:text-[10px] peer-focus:top-2 peer-focus:font-black peer-focus:text-primary-500
                                    peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:font-black"
                                >
                                    Email Address
                                </label>
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                                    <i className="far fa-envelope"></i>
                                </span>
                            </div>

                            <div className="relative group">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="peer w-full px-5 pt-6 pb-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none text-slate-800 dark:text-white placeholder-transparent"
                                    placeholder="Password"
                                />
                                <label 
                                    htmlFor="password"
                                    className="absolute left-5 top-4 text-slate-400 text-xs font-black uppercase tracking-widest transition-all pointer-events-none
                                    peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium
                                    peer-focus:text-[10px] peer-focus:top-2 peer-focus:font-black peer-focus:text-primary-500
                                    peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:font-black"
                                >
                                    Password
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-500 transition-colors focus:outline-none"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                </button>
                            </div>

                            {/* Space before button */}
                            <div className="pt-2"></div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 bg-slate-900 dark:bg-primary-600 text-white rounded-xl font-black uppercase tracking-[0.2em] hover:bg-primary-700 transition-all shadow-2xl shadow-slate-900/20 dark:shadow-primary-600/20 flex items-center justify-center group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <i className="fas fa-circle-notch animate-spin mr-3"></i>
                                ) : (
                                    <>
                                        Sign In Now
                                        <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                Sriracha Technological College <br />
                                <span className="text-slate-300 dark:text-slate-600 tracking-tighter">Authorized Administrative Access Only</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
