import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SortingState } from "@tanstack/react-table";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import toast from "react-hot-toast";

interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "author";
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"admin" | "author">("author");

    const fetchUsers = async () => {
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            toast.error("ไม่สามารถโหลดข้อมูลผู้ใช้งานได้");
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // TanStack Table Column Definition
    const columnHelper = createColumnHelper<User>();
    const columns = useMemo(() => [
        columnHelper.accessor("id", {
            header: "รหัส",
            cell: info => <span className="font-mono text-xs text-slate-400">#{info.getValue()}</span>,
        }),
        columnHelper.accessor("name", {
            header: "ชื่อ-นามสกุล",
            cell: info => <span className="font-bold text-slate-700 dark:text-slate-200">{info.getValue()}</span>,
        }),
        columnHelper.accessor("email", {
            header: "อีเมลแอดเดรส",
            cell: info => <span className="text-slate-500 font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor("role", {
            header: "บทบาท",
            cell: info => {
                const role = info.getValue();
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        role === 'admin' 
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                        {role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้เขียนข่าว'}
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: "actions",
            header: () => <div className="text-center">จัดการ</div>,
            cell: props => (
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={() => openModal(props.row.original)}
                        className="w-9 h-9 flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-500 hover:text-white rounded-lg transition-all shadow-sm"
                        title="แก้ไข"
                    >
                        <i className="fas fa-edit text-xs"></i>
                    </button>
                    <button
                        onClick={() => handleDelete(props.row.original.id)}
                        className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm"
                        title="ลบ"
                    >
                        <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>
            ),
        }),
    ], []);

    const table = useReactTable({
        data: users,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const openModal = (user: User | null = null) => {
        setEditingUser(user);
        setName(user?.name || "");
        setEmail(user?.email || "");
        setPassword("");
        setRole(user?.role || "author");
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("admin_token");
        const method = editingUser ? "PUT" : "POST";
        const url = editingUser ? `${import.meta.env.VITE_API_URL}/api/users/${editingUser.id}` : `${import.meta.env.VITE_API_URL}/api/users`;

        const loadingToast = toast.loading(editingUser ? "กำลังอัปเดตข้อมูล..." : "กำลังสร้างผู้ใช้งาน...");

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    role,
                    ...(password && { password }) 
                })
            });

            if (res.ok) {
                toast.success(editingUser ? "อัปเดตข้อมูลสำเร็จ" : "สร้างผู้ใช้งานใหม่สำเร็จ", { id: loadingToast });
                fetchUsers();
                setIsModalOpen(false);
            } else {
                toast.error("ดำเนินการไม่สำเร็จ กรุณาตรวจสอบข้อมูล", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ", { id: loadingToast });
            console.error("Save failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?")) return;
        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading("กำลังลบข้อมูล...");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("ลบข้อมูลผู้ใช้งานสำเร็จ", { id: loadingToast });
                fetchUsers();
            } else {
                toast.error("ไม่สามารถลบข้อมูลได้", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ", { id: loadingToast });
            console.error("Delete failed");
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 dark:border-slate-800 pb-8 mb-10 gap-6">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <i className="fas fa-users mr-2"></i> User Management
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการผู้ใช้งานระบบ</h1>
                    <p className="text-sm text-slate-500 mt-1">บริหารจัดการสิทธิ์การเข้าถึง และข้อมูลผู้ดูแลระบบทั้งหมด</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="mt-4 md:mt-0 px-4 py-2 bg-primary-600 text-white rounded-md text-xs font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center group"
                >
                    <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform"></i> เพิ่มผู้ใช้งานใหม่
                </button>
            </header>

            {/* DataTable Control Panel */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-[450px] group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                            <i className="fas fa-search text-lg"></i>
                        </span>
                        <input
                            type="text"
                            placeholder="ค้นหาตามชื่อ หรือ อีเมลที่ต้องการ..."
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-medium text-slate-700 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value))
                            }}
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    แสดง {pageSize} แถว
                                </option>
                            ))}
                        </select>
                        <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-800">
                            พบ {table.getFilteredRowModel().rows.length} รายการ
                        </div>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] cursor-pointer select-none group"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <span className="ml-2 text-slate-300 group-hover:text-primary-500 transition-colors">
                                                    {{
                                                        asc: <i className="fas fa-sort-up"></i>,
                                                        desc: <i className="fas fa-sort-down"></i>,
                                                    }[header.column.getIsSorted() as string] ?? <i className="fas fa-sort opacity-30"></i>}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="p-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <i className="fas fa-circle-notch animate-spin text-4xl text-primary-500 mb-4"></i>
                                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">กำลังประมวลผลข้อมูล...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="p-20 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <i className="fas fa-folder-open text-6xl mb-4"></i>
                                            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">ไม่พบข้อมูลผู้ใช้งานที่ค้นหา</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-5">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        หน้า {table.getState().pagination.pageIndex + 1} จาก {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
                        >
                            <i className="fas fa-chevron-left text-xs"></i>
                        </button>
                        
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                                const pageNum = i;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => table.setPageIndex(pageNum)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm ${
                                            table.getState().pagination.pageIndex === pageNum
                                                ? "bg-primary-600 text-white shadow-primary-600/20"
                                                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        {pageNum + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
                        >
                            <i className="fas fa-chevron-right text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal - keep same as before but translated */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-200 dark:border-slate-800"
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center">
                                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center text-xl mr-5">
                                        <i className={editingUser ? "fas fa-user-edit" : "fas fa-user-plus"}></i>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black dark:text-white uppercase tracking-tight">{editingUser ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งานใหม่"}</h2>
                                        <p className="text-sm text-slate-400 font-medium mt-1 tracking-wider uppercase">ระบบบริหารจัดการผู้ดูแลระบบ</p>
                                    </div>
                                </div>
                                
                                <div className="p-10 space-y-6">
                                    {/* Name Input */}
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            id="modal-name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="peer w-full px-6 pt-7 pb-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white transition-all outline-none font-medium placeholder-transparent"
                                            placeholder="ชื่อ-นามสกุล"
                                        />
                                        <label 
                                            htmlFor="modal-name"
                                            className="absolute left-6 top-5 text-slate-400 text-xs font-black uppercase tracking-widest transition-all pointer-events-none
                                            peer-placeholder-shown:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:font-medium
                                            peer-focus:text-[10px] peer-focus:top-2 peer-focus:font-black peer-focus:text-primary-500
                                            peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:font-black"
                                        >
                                            ชื่อ-นามสกุล
                                        </label>
                                    </div>

                                    {/* Email Input */}
                                    <div className="relative group">
                                        <input 
                                            type="email" 
                                            id="modal-email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="peer w-full px-6 pt-7 pb-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white transition-all outline-none font-medium placeholder-transparent"
                                            placeholder="อีเมลแอดเดรส"
                                        />
                                        <label 
                                            htmlFor="modal-email"
                                            className="absolute left-6 top-5 text-slate-400 text-xs font-black uppercase tracking-widest transition-all pointer-events-none
                                            peer-placeholder-shown:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:font-medium
                                            peer-focus:text-[10px] peer-focus:top-2 peer-focus:font-black peer-focus:text-primary-500
                                            peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:font-black"
                                        >
                                            อีเมลแอดเดรส
                                        </label>
                                    </div>

                                    {/* Role Selection */}
                                    <div className="relative group">
                                        <select 
                                            id="modal-role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value as "admin" | "author")}
                                            required
                                            className="peer w-full px-6 pt-7 pb-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white transition-all outline-none font-medium appearance-none"
                                        >
                                            <option value="author">ผู้เขียนข่าว (Author)</option>
                                            <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                                        </select>
                                        <label 
                                            htmlFor="modal-role"
                                            className="absolute left-6 top-2 text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all pointer-events-none"
                                        >
                                            บทบาทการใช้งาน
                                        </label>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <i className="fas fa-chevron-down text-xs"></i>
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative group">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            id="modal-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required={!editingUser}
                                            className="peer w-full px-6 pt-7 pb-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white transition-all outline-none font-medium placeholder-transparent"
                                            placeholder="รหัสผ่าน"
                                        />
                                        <label 
                                            htmlFor="modal-password"
                                            className="absolute left-6 top-5 text-slate-400 text-xs font-black uppercase tracking-widest transition-all pointer-events-none
                                            peer-placeholder-shown:text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:font-medium
                                            peer-focus:text-[10px] peer-focus:top-2 peer-focus:font-black peer-focus:text-primary-500
                                            peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:font-black"
                                        >
                                            รหัสผ่าน {editingUser && "(เว้นว่างไว้หากไม่ต้องการเปลี่ยน)"}
                                        </label>
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-500 transition-colors focus:outline-none"
                                        >
                                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-10 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end items-center space-x-6">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-12 py-5 bg-slate-900 dark:bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-primary-700 transition-all shadow-2xl shadow-slate-900/30 dark:shadow-primary-600/30"
                                    >
                                        {editingUser ? "อัปเดตข้อมูล" : "สร้างผู้ใช้งานใหม่"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
