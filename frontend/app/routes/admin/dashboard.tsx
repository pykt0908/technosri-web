import { Link } from "react-router";
import Reveal from "../../components/Reveal";

export default function AdminDashboard() {
    const stats = [
        { label: "นักเรียนทั้งหมด", value: "1,250", color: "bg-blue-500", icon: "fas fa-user-graduate" },
        { label: "หลักสูตรที่เปิดสอน", value: "12", color: "bg-green-500", icon: "fas fa-book" },
        { label: "ยอดสมัครเรียนใหม่", value: "45", color: "bg-purple-500", icon: "fas fa-user-plus" },
        { label: "ผู้เข้าชมวันนี้", value: "320", color: "bg-orange-500", icon: "fas fa-eye" },
    ];

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">System Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dashboard สถิติและภาพรวมการจัดการข้อมูลวิทยาลัย</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-bold hover:bg-slate-50 transition-all flex items-center">
                        <i className="fas fa-download mr-2"></i> Export Report
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-md text-xs font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center">
                        <i className="fas fa-plus mr-2"></i> New Action
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`}></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`w-10 h-10 ${stat.color} bg-opacity-10 rounded-md flex items-center justify-center text-lg ${stat.color.replace('bg-', 'text-')}`}>
                                <i className={stat.icon}></i>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-[10px] font-bold text-green-500">
                            <i className="fas fa-caret-up mr-1"></i> +12.5% <span className="text-slate-400 ml-2 font-medium capitalize">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Card - Recent Applications */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">รายชื่อผู้สมัครเรียนล่าสุด</h2>
                        <Link to="/admin/applications" className="text-xs text-primary-500 font-bold hover:underline">View All Records</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-[10px] text-slate-400 uppercase font-black bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Applied Program</th>
                                    <th className="px-6 py-4">Submission Date</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {[
                                    { name: "สมชาย รักเรียน", program: "ช่างยนต์", date: "10 May 2026", status: "Pending", statusColor: "bg-orange-100 text-orange-600" },
                                    { name: "สมหญิง ขยันหมั่นเพียร", program: "เทคโนโลยีสารสนเทศ", date: "09 May 2026", status: "Approved", statusColor: "bg-green-100 text-green-600" },
                                    { name: "มงคล มีชัย", program: "การจัดการธุรกิจ", date: "08 May 2026", status: "Pending", statusColor: "bg-orange-100 text-orange-600" },
                                    { name: "อารีรัตน์ มั่นคง", program: "กราฟิกดีไซน์", date: "07 May 2026", status: "Reviewing", statusColor: "bg-blue-100 text-blue-600" },
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{row.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{row.program}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">{row.date}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${row.statusColor}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Card - Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">System Logs</h2>
                    </div>
                    <div className="p-6">
                        <div className="flow-root">
                            <ul className="-mb-8">
                                {[
                                    { title: "News Updated", desc: "Added new innovation news", time: "2h ago", icon: "fa-plus", color: "bg-blue-500" },
                                    { title: "Course Modified", desc: "Updated Mechanical Engineering details", time: "5h ago", icon: "fa-edit", color: "bg-orange-500" },
                                    { title: "Backup Success", desc: "Database backup completed successfully", time: "1d ago", icon: "fa-database", color: "bg-green-500" },
                                    { title: "User Login", desc: "Administrator logged in from Chrome", time: "2d ago", icon: "fa-key", color: "bg-slate-500" },
                                ].map((act, i) => (
                                    <li key={i}>
                                        <div className="relative pb-8">
                                            {i !== 3 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true"></span>}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-md flex items-center justify-center text-white text-xs ${act.color}`}>
                                                        <i className={`fas ${act.icon}`}></i>
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{act.title}</p>
                                                        <p className="text-[10px] text-slate-500 mt-0.5">{act.desc}</p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-[10px] text-slate-400">
                                                        {act.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
