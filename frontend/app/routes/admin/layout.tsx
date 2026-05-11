import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [user, setUser] = useState<any>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
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
            await fetch("http://localhost:8000/api/logout", {
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
        { title: "Dashboard", path: "/admin", icon: "fas fa-tachometer-alt" },
        { title: "จัดการผู้ใช้งาน", path: "/admin/users", icon: "fas fa-user-shield" },
        { title: "จัดการหลักสูตร", path: "/admin/programs", icon: "fas fa-graduation-cap" },
        { title: "จัดการบุคลากร", path: "/admin/staff", icon: "fas fa-users" },
        { title: "จัดการข่าวสาร", path: "/admin/news", icon: "fas fa-newspaper" },
        { title: "การตั้งค่า", path: "/admin/settings", icon: "fas fa-cogs" },
    ];

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
                                    end
                                    className={({ isActive }) =>
                                        `flex items-center p-3 rounded-md group transition-all ${isActive
                                            ? "bg-slate-800 text-primary-400 border-l-4 border-primary-500"
                                            : "hover:bg-slate-800 hover:text-white"
                                        }`
                                    }
                                >
                                    <i className={`${item.icon} text-base w-6 flex justify-center ${location.pathname === item.path ? "text-primary-400" : "text-slate-500"}`}></i>
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
                            {isSidebarOpen && <span className="ms-3">Sign Out</span>}
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

                            {/* Breadcrumbs */}
                            <div className="hidden md:flex items-center text-xs font-medium text-slate-400 space-x-2">
                                <Link to="/admin" className="hover:text-primary-500 uppercase tracking-widest">Admin</Link>
                                <i className="fas fa-chevron-right text-[10px]"></i>
                                <span className="text-slate-600 dark:text-slate-300 uppercase tracking-widest font-bold">
                                    {menuItems.find(i => i.path === location.pathname)?.title || "Dashboard"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.name || "Administrator"}</span>
                                <span className="text-[10px] text-green-500 font-bold uppercase flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Online
                                </span>
                            </div>
                            <button className="relative p-2 text-slate-400 hover:text-primary-500 transition-colors">
                                <i className="far fa-bell text-xl"></i>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                            <div className="h-10 w-10 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                <i className="fas fa-user"></i>
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
                    <div className="mt-2 md:mt-0 font-medium">Version 1.0.0 (Production)</div>
                </footer>
            </div>
        </div>
    );
}
