import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { 
    Loader2, TrendingUp, TrendingDown, Home, FileText, 
    Eye, Users, Zap, BarChart3, PieChart, Activity,
    Globe, Smartphone, Monitor, Tablet, MousePointer2,
    ShieldCheck, Layout, UserCheck
} from "lucide-react";

interface OverviewItem {
    label: string;
    value: string;
    trend: string;
    icon: string;
    color: string;
}

interface TopPage {
    page_url: string;
    count: number;
}

interface AnalyticsData {
    overview: OverviewItem[];
    chart_data: {
        categories: string[];
        visitors: number[];
        pageviews: number[];
    };
    devices: {
        labels: string[];
        series: number[];
    };
    top_pages: TopPage[];
}

// Icon Mapping helper
const IconMap: Record<string, any> = {
    'fas fa-eye': Eye,
    'fas fa-user-shield': ShieldCheck,
    'fas fa-bolt': Zap,
    'fas fa-file-alt': FileText,
    'fas fa-users': Users,
    'fas fa-user-check': UserCheck,
    'fas fa-chart-line': Activity
};

export default function AdminDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const token = localStorage.getItem("admin_token");
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const analytics = await res.json();
                setData(analytics);
            } catch (err) {
                console.error("Failed to fetch analytics data");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading || !data) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-xs font-black uppercase tracking-[0.3em]">กำลังวิเคราะห์ข้อมูลสถิติ...</p>
        </div>
    );

    const mainChartOptions: any = {
        chart: {
            id: "visitor-chart",
            toolbar: { show: false },
            fontFamily: 'LINE Seed Sans TH, sans-serif',
            sparkline: { enabled: false },
        },
        colors: ['#1ea2ff', '#fb923c'],
        stroke: { curve: 'smooth', width: 3 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100]
            }
        },
        xaxis: {
            categories: data.chart_data.categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#94a3b8', fontWeight: 600, fontSize: '11px' } }
        },
        yaxis: {
            labels: { style: { colors: '#94a3b8', fontWeight: 600, fontSize: '11px' } }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
            padding: { left: 20, right: 20 }
        },
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark' },
        legend: { position: 'top', horizontalAlign: 'right', fontWeight: 700, fontSize: '12px' }
    };

    const mainChartSeries = [
        { name: 'ผู้เข้าชม (Unique)', data: data.chart_data.visitors },
        { name: 'ยอดเข้าชมหน้าเว็บ', data: data.chart_data.pageviews }
    ];

    const donutOptions: any = {
        labels: data.devices.labels,
        colors: ['#1ea2ff', '#6366f1', '#f43f5e'],
        chart: { fontFamily: 'LINE Seed Sans TH, sans-serif' },
        stroke: { show: false },
        dataLabels: { enabled: false },
        legend: {
            position: 'bottom',
            fontWeight: 700,
            fontSize: '11px',
            markers: { radius: 12 }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'อุปกรณ์หลัก',
                            formatter: () => data.devices.labels[0] || 'N/A',
                            style: { fontWeight: 900, fontSize: '16px', color: '#1e293b' }
                        }
                    }
                }
            }
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">สถิติการเข้าชม</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-widest">ข้อมูลการจราจรแบบเรียลไทม์</p>
                </div>
            </header>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.overview.map((stat, i) => {
                    const IconComponent = IconMap[stat.icon] || Layout;
                    // Fix color handling
                    const colorBase = stat.color.replace('bg-', '');
                    return (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary-500 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${colorBase}/10 text-${colorBase}`}>
                                    <IconComponent size={24} />
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-black ${stat.trend.includes('+') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black dark:text-white tracking-tighter">{stat.value}</h3>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Visitor Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center">
                            <Activity size={16} className="mr-2 text-primary-600" />
                            แนวโน้มผู้เข้าชม (7 วันล่าสุด)
                        </h2>
                    </div>
                    <div className="h-[280px] lg:h-[320px]">
                        <Chart options={mainChartOptions} series={mainChartSeries} type="area" height="100%" />
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white mb-6 flex items-center">
                            <PieChart size={16} className="mr-2 text-primary-600" />
                            ประเภทอุปกรณ์
                        </h2>
                        <div className="h-[200px] lg:h-[240px] mb-6">
                            <Chart options={donutOptions} series={data.devices.series} type="donut" height="100%" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {data.devices.labels.map((label, idx) => {
                            const totalDevices = data.devices.series.reduce((sum, val) => sum + val, 0) || 1;
                            const percentage = ((data.devices.series[idx] / totalDevices) * 100).toFixed(1);

                            return (
                                <div key={label} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-3 ${idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{label}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Top Visited Pages DataTable */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center">
                            <MousePointer2 size={16} className="mr-2 text-primary-600" />
                            หน้าเว็บที่มีผู้เข้าชมสูงสุด
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">สัดส่วนการเข้าชมเทียบกับยอดรวมทั้งหมด</p>
                    </div>
                    <span className="text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary-100 dark:border-primary-800">
                        10 อันดับแรก
                    </span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">อันดับ</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">หน้าเว็บ / URL</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">ยอดวิว</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">สัดส่วนจากยอดรวม</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {data.top_pages.map((page, idx) => {
                                // Calculate percentage from total views (data.overview[0].value is formatted string with commas)
                                const totalViews = parseInt(data.overview[0].value.replace(/,/g, '')) || 1;
                                const percentage = (page.count / totalViews) * 100;

                                return (
                                    <tr key={idx} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-300">
                                        <td className="py-5">
                                            <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-black ${idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}`}>
                                                {idx + 1}
                                            </span>
                                        </td>
                                        <td className="py-5 pr-4">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${page.page_url === '/' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                                                    {page.page_url === '/' ? <Home size={14} /> : <FileText size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <p className="font-black text-xs text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                                                            {page.page_url === '/' ? 'หน้าแรก' : page.page_url.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || page.page_url}
                                                        </p>
                                                        <a 
                                                            href={page.page_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="p-1 hover:bg-primary-50 hover:text-primary-600 rounded transition-colors text-slate-300"
                                                            title="เปิดดูหน้าเว็บจริง"
                                                        >
                                                            <Globe size={12} />
                                                        </a>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[250px] mt-0.5">{page.page_url}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">{page.count.toLocaleString()}</span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">ครั้ง</span>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center justify-end">
                                                <div className="w-32 lg:w-48 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mr-4 border border-slate-50 dark:border-slate-700 shadow-inner">
                                                    <div 
                                                        className="bg-gradient-to-r from-primary-600 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(30,162,255,0.2)]" 
                                                        style={{ width: `${Math.max(percentage, 2)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-black text-slate-800 dark:text-slate-200 w-12 text-right tracking-tighter">
                                                    {percentage < 0.1 ? '< 0.1' : percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


