import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Reveal from "./Reveal";
import * as Lucide from "lucide-react";
const { Calendar: CalendarIcon, MapPin, Clock, ExternalLink, X, ChevronRight, Info } = Lucide;

interface CalendarEvent {
    id: number;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    location: string | null;
    color: string | null;
    link_url: string | null;
}

export default function CalendarSection() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendar-events`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch calendar events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Format FullCalendar events array
    const formattedEvents = events.map(event => ({
        id: String(event.id),
        title: event.title,
        start: event.start_date,
        end: event.end_date || undefined,
        backgroundColor: event.color || "#1ea2ff",
        borderColor: event.color || "#1ea2ff",
        extendedProps: {
            description: event.description,
            location: event.location,
            link_url: event.link_url
        }
    }));

    // Filter upcoming events (starts from today or in future)
    const upcomingEvents = events
        .filter(event => {
            const eventDate = event.end_date ? new Date(event.end_date) : new Date(event.start_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today;
        })
        .slice(0, 4); // Display top 4 upcoming events

    const formatDateThai = (dateString: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const formatTimeThai = (dateString: string | null) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        
        return date.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit"
        }) + " น.";
    };

    const handleEventClick = (info: any) => {
        const eventId = Number(info.event.id);
        const event = events.find(e => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
        }
    };

    return (
        <section id="calendar" className="py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/80">
            {/* Custom styles to override FullCalendar CSS */}
            <style>{`
                .fc {
                    font-family: var(--font-sans), sans-serif;
                    --fc-border-color: rgba(226, 232, 240, 0.8);
                    --fc-today-bg-color: rgba(30, 162, 255, 0.05);
                }
                .dark .fc {
                    --fc-border-color: rgba(51, 65, 85, 0.5);
                    --fc-today-bg-color: rgba(30, 162, 255, 0.1);
                    --fc-page-bg-color: #0f172a;
                }
                .fc .fc-toolbar-title {
                    font-size: 1.25rem !important;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: -0.025em;
                }
                .fc .fc-button {
                    background-color: transparent !important;
                    border: 1px solid rgba(226, 232, 240, 0.8) !important;
                    color: #475569 !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    font-size: 0.75rem !important;
                    padding: 0.5rem 0.85rem !important;
                    border-radius: 0.75rem !important;
                    transition: all 0.2s !important;
                }
                .dark .fc .fc-button {
                    border-color: rgba(51, 65, 85, 0.6) !important;
                    color: #94a3b8 !important;
                }
                .fc .fc-button:hover {
                    background-color: #1ea2ff !important;
                    border-color: #1ea2ff !important;
                    color: white !important;
                }
                .fc .fc-button-active {
                    background-color: #1ea2ff !important;
                    border-color: #1ea2ff !important;
                    color: white !important;
                }
                .fc .fc-col-header-cell-cushion {
                    padding: 10px 0 !important;
                    font-size: 0.75rem !important;
                    font-weight: 800 !important;
                    text-transform: uppercase;
                    color: #64748b;
                }
                .dark .fc .fc-col-header-cell-cushion {
                    color: #94a3b8;
                }
                .fc .fc-daygrid-day-number {
                    font-weight: 700 !important;
                    font-size: 0.85rem !important;
                    padding: 8px !important;
                    color: #334155;
                }
                .dark .fc .fc-daygrid-day-number {
                    color: #cbd5e1;
                }
                .fc-theme-standard td, .fc-theme-standard th {
                    border-radius: 0px;
                }
                .fc-scrollgrid {
                    border-radius: 1.5rem !important;
                    overflow: hidden !important;
                    border: 1px solid var(--fc-border-color) !important;
                }
                .fc .fc-daygrid-event {
                    border-radius: 6px !important;
                    padding: 2px 6px !important;
                    font-size: 0.7rem !important;
                    font-weight: 700 !important;
                    margin: 1px 4px !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .fc-day-other {
                    background-color: rgba(248, 250, 252, 0.35) !important;
                }
                .dark .fc-day-other {
                    background-color: rgba(15, 23, 42, 0.2) !important;
                }
            `}</style>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <Reveal>
                        <span className="text-primary-500 font-black tracking-[0.3em] uppercase text-xs mb-3 block">Activities & Schedule</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase leading-none dark:text-white">ปฏิทินวิทยาลัย</h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium mt-4 md:mt-0 text-sm md:text-right">
                            ตารางงาน วันสำคัญ และกิจกรรมวิชาการ/สันทนาการต่างๆ ของวิทยาลัยเทคโนโลยีศรีราชา
                        </p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: FullCalendar Grid */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-950 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/10 dark:shadow-none">
                        {loading ? (
                            <div className="h-[550px] flex items-center justify-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">
                                กำลังสร้างปฏิทินวิทยาลัย...
                            </div>
                        ) : (
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: "title",
                                    center: "",
                                    right: "prev,today,next"
                                }}
                                height="auto"
                                events={formattedEvents}
                                eventClick={handleEventClick}
                                locale="th"
                                fixedWeekCount={false}
                            />
                        )}
                    </div>

                    {/* Right Column: Upcoming Events List */}
                    <div className="lg:col-span-4 flex flex-col h-full">
                        <Reveal delay={0.3} className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center">
                                    <CalendarIcon className="mr-2 text-primary-500" size={20} />
                                    กิจกรรมเร็วๆ นี้
                                </h3>
                            </div>

                            {loading ? (
                                <div className="space-y-4 flex-1">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse" />
                                    ))}
                                </div>
                            ) : upcomingEvents.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-950/40 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center min-h-[300px]">
                                    <CalendarIcon className="opacity-10 text-slate-400 mb-4" size={48} />
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">ไม่มีกิจกรรมถัดไป</p>
                                    <p className="text-xs text-slate-400 mt-1">ติดตามข่าวสารกิจกรรมได้เร็วๆ นี้</p>
                                </div>
                            ) : (
                                <div className="space-y-4 flex-1">
                                    {upcomingEvents.map((event, index) => {
                                        const eventDate = new Date(event.start_date);
                                        const dateDay = eventDate.getDate();
                                        const dateMonth = eventDate.toLocaleDateString("th-TH", { month: "short" });

                                        return (
                                            <div 
                                                key={event.id}
                                                onClick={() => setSelectedEvent(event)}
                                                className="group bg-white dark:bg-slate-950/80 p-5 rounded-[1.8rem] border border-slate-100 dark:border-slate-850 hover:border-primary-500/30 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 cursor-pointer flex gap-4 items-start"
                                            >
                                                {/* Date Badge */}
                                                <div 
                                                    className="w-14 h-14 shrink-0 rounded-2xl flex flex-col items-center justify-center text-white shadow-sm font-black transition-transform group-hover:scale-105"
                                                    style={{ backgroundColor: event.color || "#1ea2ff" }}
                                                >
                                                    <span className="text-xl leading-none">{dateDay}</span>
                                                    <span className="text-[10px] uppercase tracking-wide opacity-90 mt-0.5">{dateMonth}</span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-primary-500 transition-colors line-clamp-1 leading-snug">
                                                        {event.title}
                                                    </h4>
                                                    <div className="flex flex-col gap-1 mt-2 text-xs text-slate-400">
                                                        <span className="flex items-center">
                                                            <Clock size={12} className="mr-1.5 shrink-0" />
                                                            {formatTimeThai(event.start_date)}
                                                            {event.end_date && ` - ${formatTimeThai(event.end_date)}`}
                                                        </span>
                                                        {event.location && (
                                                            <span className="flex items-center truncate">
                                                                <MapPin size={12} className="mr-1.5 shrink-0" />
                                                                <span className="truncate">{event.location}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="self-center p-1.5 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/50 transition-colors">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
                        
                        <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                            {/* Accent Line */}
                            <div className="h-2 w-full" style={{ backgroundColor: selectedEvent.color || "#1ea2ff" }} />
                            
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1 rounded-full">
                                        <Info size={12} className="mr-1.5" /> รายละเอียดกิจกรรม
                                    </div>
                                    <button 
                                        onClick={() => setSelectedEvent(null)}
                                        className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-150 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-300 rounded-full transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-6">
                                    {selectedEvent.title}
                                </h3>

                                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-6 text-sm">
                                    {/* Date & Time */}
                                    <div className="flex items-start">
                                        <Clock className="mr-3 text-slate-400 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <div className="font-bold text-slate-800 dark:text-slate-250">วันและเวลา</div>
                                            <div className="text-slate-500 dark:text-slate-400 mt-1 text-xs">
                                                เริ่ม: {formatDateThai(selectedEvent.start_date)} ({formatTimeThai(selectedEvent.start_date)})
                                                {selectedEvent.end_date && (
                                                    <>
                                                        <br />
                                                        สิ้นสุด: {formatDateThai(selectedEvent.end_date)} ({formatTimeThai(selectedEvent.end_date)})
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    {selectedEvent.location && (
                                        <div className="flex items-start">
                                            <MapPin className="mr-3 text-slate-400 shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-slate-250">สถานที่</div>
                                                <div className="text-slate-500 dark:text-slate-400 mt-1 text-xs">{selectedEvent.location}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                {selectedEvent.description && (
                                    <div className="mb-8">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">รายละเอียด</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                                            {selectedEvent.description}
                                        </p>
                                    </div>
                                )}

                                {/* Action button */}
                                {selectedEvent.link_url ? (
                                    <a 
                                        href={selectedEvent.link_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center shadow-lg shadow-primary-600/20 group"
                                    >
                                        ดูรายละเอียดเพิ่มเติม / ลิงก์ที่เกี่ยวข้อง
                                        <ExternalLink size={14} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                ) : (
                                    <button 
                                        onClick={() => setSelectedEvent(null)}
                                        className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all"
                                    >
                                        ปิดหน้าต่าง
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
