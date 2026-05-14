import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
    createColumnHelper, 
    flexRender, 
    getCoreRowModel, 
    useReactTable, 
    getSortedRowModel, 
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { Plus, Search, FileText, Edit, Trash2, ExternalLink, Eye } from "lucide-react";

interface News {
    id: number;
    title: string;
    slug: string;
    status: "draft" | "published";
    created_at: string;
    author: { name: string };
    views: number;
}

export default function NewsList() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const navigate = useNavigate();

    const fetchNews = async () => {
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/news`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            const data = await res.json();
            setNews(data);
        } catch (err) {
            toast.error("ไม่สามารถโหลดข้อมูลข่าวสารได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const columnHelper = createColumnHelper<News>();
    const columns = useMemo(() => [
        columnHelper.accessor("title", {
            header: "หัวข้อข่าว",
            cell: info => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700 dark:text-white line-clamp-1">{info.getValue()}</span>
                    <span className="text-[10px] text-slate-400 font-mono">/{info.row.original.slug}</span>
                </div>
            ),
        }),
        columnHelper.accessor("author.name", {
            header: "ผู้เขียน",
            cell: info => <span className="font-medium text-slate-500">{info.getValue()}</span>,
        }),
        columnHelper.accessor("status", {
            header: "สถานะ",
            cell: info => {
                const status = info.getValue();
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        status === 'published' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                        {status === 'published' ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                    </span>
                );
            },
        }),
        columnHelper.accessor("created_at", {
            header: "วันที่สร้าง",
            cell: info => <span className="text-slate-400 text-xs">{new Date(info.getValue()).toLocaleDateString('th-TH')}</span>,
        }),
        columnHelper.display({
            id: "actions",
            header: () => <div className="text-center">จัดการ</div>,
            cell: props => (
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={() => navigate(`/admin/news/edit/${props.row.original.id}`)}
                        className="w-9 h-9 flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-500 hover:text-white rounded-lg transition-all shadow-sm"
                        title="แก้ไข"
                    >
                        <Edit size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(props.row.original.id)}
                        className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm"
                        title="ลบ"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        }),
    ], []);

    const table = useReactTable({
        data: news,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } }
    });

    const handleDelete = async (id: number) => {
        if (!confirm("คุณต้องการลบข่าวนี้ใช่หรือไม่?")) return;
        const token = localStorage.getItem("admin_token");
        const loadingToast = toast.loading("กำลังลบข่าว...");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/news/${id}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (res.ok) {
                toast.success("ลบข่าวสำเร็จ", { id: loadingToast });
                fetchNews();
            } else {
                toast.error("ไม่สามารถลบข่าวได้", { id: loadingToast });
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ", { id: loadingToast });
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 dark:border-slate-800 pb-8 mb-10">
                <div>
                    <div className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full w-fit border border-primary-100 dark:border-primary-800">
                        <FileText size={10} className="mr-2" /> News & Announcements
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">จัดการข่าวสารสถาบัน</h1>
                    <p className="text-sm text-slate-500 mt-1">บริหารจัดการข้อมูลข่าวสาร กิจกรรม และประกาศต่างๆ</p>
                </div>
                <Link
                    to="/admin/news/create"
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center group"
                >
                    <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" /> เขียนข่าวใหม่
                </Link>
            </header>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-[450px] group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                            <Search size={18} />
                        </span>
                        <input 
                            type="text" 
                            placeholder="ค้นหาตามหัวข้อข่าว หรือ ผู้เขียน..."
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-medium text-slate-700 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => table.setPageSize(Number(e.target.value))}
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {[10, 20, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>แสดง {pageSize} รายการ</option>
                            ))}
                        </select>
                        <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-800">
                            พบ {table.getFilteredRowModel().rows.length} ข่าว
                        </div>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-6 py-5 text-[10px] text-slate-400 uppercase font-black tracking-widest cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
                                            <div className="flex items-center">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <span className="ml-2">
                                                    {{ asc: "↑", desc: "↓" }[header.column.getIsSorted() as string] ?? "↕"}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan={columns.length} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">กำลังโหลด...</td></tr>
                            ) : table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        หน้า {table.getState().pagination.pageIndex + 1} จาก {table.getPageCount()}
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30">
                            <i className="fas fa-chevron-left text-[10px]"></i>
                        </button>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30">
                            <i className="fas fa-chevron-right text-[10px]"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
