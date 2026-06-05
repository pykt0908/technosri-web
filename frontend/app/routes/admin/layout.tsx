import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false); // เพิ่มเพื่อแก้ Hydration Error
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("admin_token");
        const savedUser = localStorage.getItem("admin_user");

        if (!token) {
            navigate("/admin/login");
        } else if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        const isDark = document.documentElement.classList.contains("dark");
        setIsDarkMode(isDark);
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                }
            });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
            navigate("/admin/login");
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { title: "แดชบอร์ด", path: "/admin", icon: "fas fa-tachometer-alt" },
        { title: "ข่าวสาร", path: "/admin/news", icon: "fas fa-newspaper" },
        { title: "ภาพสไลด์", path: "/admin/carousel", icon: "fas fa-images" },
        { title: "ป๊อปอัปหน้าแรก", path: "/admin/popups", icon: "fas fa-window-restore" },
        { title: "หลักสูตร", path: "/admin/curricula", icon: "fas fa-book-open" },
        { title: "บุคลากร", path: "/admin/personnel", icon: "fas fa-users" },
        { title: "สมัครงาน", path: "/admin/jobs", icon: "fas fa-briefcase" },
        { title: "ผู้ใช้งาน", path: "/admin/users", icon: "fas fa-user-shield" },
        { title: "ดาวน์โหลด", path: "/admin/downloads", icon: "fas fa-download" },
        { title: "สถิติวิทยาลัย", path: "/admin/statistics", icon: "fas fa-chart-bar" },
        { title: "ตั้งค่า", path: "/admin/settings", icon: "fas fa-cogs" },
    ];

    // ฟังก์ชันช่วยหาชื่อหน้าปัจจุบันแบบยืดหยุ่น
    const getCurrentPageTitle = () => {
        const item = menuItems.find(i =>
            location.pathname === i.path ||
            (i.path !== '/admin' && location.pathname.startsWith(i.path))
        );
        return item ? item.title : "Dashboard";
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            <Toaster position="top-right" />
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-slate-900 text-slate-300 border-r border-slate-800 ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
                    }`}
            >
                <div className="h-full px-4 py-6 overflow-y-auto">
                    <div className="flex items-center ps-2 mb-10">
                        <img src="/logo_sriracha.png" className="h-9 me-3 bg-white p-1 rounded-md" alt="Logo" />
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-white leading-tight">STC BACKOFFICE</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Management System</span>
                            </div>
                        )}
                    </div>

                    <ul className="space-y-1 font-semibold text-sm">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) =>
                                        `flex items-center p-3 rounded-md group transition-all ${isActive
                                            ? "bg-slate-800 text-primary-400 border-l-4 border-primary-500"
                                            : "hover:bg-slate-800 hover:text-white"
                                        }`
                                    }
                                >
                                    <i className={`${item.icon} text-base w-6 flex justify-center ${location.pathname.startsWith(item.path) && (item.path !== '/admin' || location.pathname === '/admin') ? "text-primary-400" : "text-slate-500"}`}></i>
                                    {isSidebarOpen && <span className="ms-3">{item.title}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Bottom logout */}
                    <div className="absolute bottom-6 left-0 w-full px-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full p-3 text-slate-400 rounded-md hover:bg-slate-800 hover:text-red-400 transition-all text-sm font-bold border border-slate-800"
                        >
                            <i className="fas fa-sign-out-alt text-base w-6 flex justify-center"></i>
                            {isSidebarOpen && <span className="ms-3">ออกจากระบบ</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
                {/* Navbar */}
                <nav className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 mr-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                            >
                                <i className={`fas ${isSidebarOpen ? "fa-indent" : "fa-outdent"}`}></i>
                            </button>

                            {/* Breadcrumbs - ใช้ mounted check เพื่อป้องกัน Hydration Error */}
                            <div className="hidden md:flex items-center text-xs font-medium text-slate-400 space-x-2">
                                <Link to="/admin" className="hover:text-primary-500 uppercase tracking-widest">BACKOFFICE</Link>
                                <i className="fas fa-chevron-right text-[10px]"></i>
                                <span className="text-slate-600 dark:text-slate-300 uppercase tracking-widest font-bold">
                                    {mounted ? getCurrentPageTitle() : "Dashboard"}
                                </span>
                            </div>
                        </div>

                    </div>
                </nav>

                {/* Page Content */}
                <main className="p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-140px)]">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="px-8 py-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <div>&copy; 2026 <strong>Sriracha Technological College</strong>. All rights reserved.</div>
                </footer>
            </div>
        </div>
    );
}
