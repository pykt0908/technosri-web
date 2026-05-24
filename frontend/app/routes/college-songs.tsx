import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../components/Reveal";

interface Song {
    title: string;
    description: string;
    filename: string;
    duration: string;
    lyrics: string;
}

const songs: Song[] = [
    {
        title: "เพลง มาร์ชเทคโนฯศรีราชา",
        description: "บทเพลงมาร์ชอันทรงพลัง ปลุกเร้าความรักสถาบัน ความมีวินัย ความแข็งแกร่ง และมุ่งมั่นสู่ความสำเร็จ",
        filename: "01 เพลง มาร์ชเทคโนฯศรีราชา.wav",
        duration: "2:59",
        lyrics: `(มาร์ชเทคโนฯ ศรีราชา)

เทคโนโลยีศรีราชา งามสง่าใครไม่เทียม
ทักษะเยี่ยมเปี่ยมคุณธรรมล้ำเลิศวิชา
ถิ่นศึกษาของเรา เพริศเพราน้องพี่ชื่อนี้ดีเรื่อยมา
เป็นแหล่งปัญญาสร้างศรัทธาสร้างความมั่นใจ
สัญลักษณ์ เกาะลอยวิไล
ราชพฤกษ์สดใส ฟ้า-ขาว เกริกไกรก้าวต่อไปเคียงกัน
มั่นรักสามัคคีเชิดชูศักดิ์ศรีสถาบัน
ชาติ ศาสนา องค์ราชัน ยึดมั่นอยู่ในฤดี
รักเกียตริ รักเรียน พากเพียร เพิ่มพูน ทูนเทิดในสิ่งดีเพื่อเทคโนโลยีศรีราชา`
    },
    {
        title: "เพลง เทคโนฯคืนรัง",
        description: "บทเพลงแห่งความผูกพันและการกลับมาเยือนสถาบันอันเป็นที่รักของศิษย์เก่าวิทยาลัยเทคโนโลยีศรีราชา",
        filename: "02 เพลง เทคโนฯคืนรัง.wav",
        duration: "3:10",
        lyrics: `-`
    },
    {
        title: "เพลง เทคโนฯของเรา",
        description: "บทเพลงประจำสถาบันที่สะท้อนถึงวิสัยทัศน์ ความภาคภูมิใจ และปณิธานด้านการจัดการศึกษาของวิทยาลัย",
        filename: "03 เพลง เทคโนฯของเรา.wav",
        duration: "2:32",
        lyrics: `-`
    },
    {
        title: "เพลง ชื่น",
        description: "บทเพลงจังหวะแจ่มใสสื่อถึงมิตรภาพ ความสุข และความสามัคคีของเหล่านักศึกษาภายใต้รั้วฟ้าขาว",
        filename: "04 เพลง ชื่น.wav",
        duration: "2:35",
        lyrics: `-`
    },

];

export default function CollegeSongsPage() {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentSong = songs[currentSongIndex];
    const songUrl = `/song/${encodeURIComponent(currentSong.filename)}`;

    useEffect(() => {
        document.title = "เพลงประจำวิทยาลัย | วิทยาลัยเทคโนโลยีศรีราชา";
    }, []);

    // Handle switching songs
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(err => {
                    console.error("Audio playback interrupted:", err);
                    setIsPlaying(false);
                });
            }
        }
    }, [currentSongIndex]);

    // Handle volume and mute
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(err => {
                    console.error("Failed to play audio:", err);
                });
            }
        }
    };

    const playSong = (index: number) => {
        if (currentSongIndex === index) {
            togglePlay();
        } else {
            setCurrentSongIndex(index);
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleAudioEnded = () => {
        // Auto play next song
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const nextSong = () => {
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(prev => prev + 1);
        } else {
            setCurrentSongIndex(0); // Loop back to start
        }
    };

    const prevSong = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(prev => prev - 1);
        } else {
            setCurrentSongIndex(songs.length - 1); // Loop to end
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-32 pb-24 overflow-hidden relative transition-colors duration-500">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>

            {/* Inline CSS for premium styling */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes soundwave {
                    0%, 100% { height: 4px; }
                    50% { height: 28px; }
                }
                .wave-bar {
                    animation: soundwave 1.2s ease-in-out infinite;
                }
                .wave-bar.paused {
                    animation-play-state: paused;
                    height: 4px !important;
                }
                .lyrics-line {
                    transition: all 0.3s ease;
                }
                .disc-spin {
                    animation: spin 10s linear infinite;
                }
                .disc-spin-paused {
                    animation-play-state: paused;
                }
                `
            }} />

            {/* Audio element */}
            <audio
                ref={audioRef}
                src={songUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleAudioEnded}
            />

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Header Section */}
                <header className="mb-16">
                    <Reveal>
                        <div className="inline-flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-primary-100/50 dark:bg-primary-900/20 px-4 py-1.5 rounded-full mb-6">
                            <i className="fas fa-music text-xs" aria-hidden="true"></i>
                            <span>College Songs</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight uppercase">
                            เพลงประจำ <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">วิทยาลัย</span>
                        </h1>
                    </Reveal>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Left: Custom Premium Audio Player */}
                    <div className="lg:col-span-6 space-y-6">
                        <Reveal animation="fade-right">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                                {/* Soundwave visualizer in corner */}
                                <div className="absolute top-8 right-8 flex items-end justify-center space-x-1 h-8 w-14">
                                    <div className={`wave-bar w-1.5 bg-primary-500 dark:bg-primary-400 rounded-full ${!isPlaying ? "paused" : ""}`} style={{ animationDelay: "0.1s" }} />
                                    <div className={`wave-bar w-1.5 bg-primary-500 dark:bg-primary-400 rounded-full ${!isPlaying ? "paused" : ""}`} style={{ animationDelay: "0.4s" }} />
                                    <div className={`wave-bar w-1.5 bg-primary-500 dark:bg-primary-400 rounded-full ${!isPlaying ? "paused" : ""}`} style={{ animationDelay: "0.2s" }} />
                                    <div className={`wave-bar w-1.5 bg-primary-500 dark:bg-primary-400 rounded-full ${!isPlaying ? "paused" : ""}`} style={{ animationDelay: "0.6s" }} />
                                    <div className={`wave-bar w-1.5 bg-primary-500 dark:bg-primary-400 rounded-full ${!isPlaying ? "paused" : ""}`} style={{ animationDelay: "0.3s" }} />
                                </div>

                                <div className="flex flex-col items-center text-center mt-6">
                                    {/* Disc Rotating Vinyl Animation */}
                                    <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 group">
                                        <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-xl scale-95 group-hover:scale-105 transition-transform duration-700" />
                                        <div className={`w-full h-full rounded-full bg-slate-950 dark:bg-black border-[12px] border-slate-800 shadow-2xl relative flex items-center justify-center disc-spin ${!isPlaying ? "disc-spin-paused" : ""}`}>
                                            {/* Vinyl Grooves */}
                                            <div className="absolute inset-4 rounded-full border border-slate-900 opacity-40" />
                                            <div className="absolute inset-8 rounded-full border border-slate-900 opacity-40" />
                                            <div className="absolute inset-12 rounded-full border border-slate-900 opacity-40" />

                                            {/* Center Label */}
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-600 flex items-center justify-center p-2 text-white border-4 border-slate-950 dark:border-black shadow-inner z-10 overflow-hidden relative">
                                                <img src="/logo_sriracha.png" alt="STC" className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Song Title Info */}
                                    <div className="mb-8 w-full px-4">
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 line-clamp-1">{currentSong.title}</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic px-6 line-clamp-2">{currentSong.description}</p>
                                    </div>

                                    {/* Progress Bar & Timers */}
                                    <div className="w-full mb-8">
                                        <input
                                            type="range"
                                            min={0}
                                            max={duration || 100}
                                            value={currentTime}
                                            onChange={handleProgressChange}
                                            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none transition-all"
                                        />
                                        <div className="flex justify-between items-center mt-3 text-xs font-bold text-slate-400 dark:text-slate-500">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Control Buttons */}
                                    <div className="flex items-center justify-center space-x-6 md:space-x-8 mb-8 w-full">
                                        <button
                                            onClick={prevSong}
                                            className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all flex items-center justify-center active:scale-95"
                                            aria-label="เพลงก่อนหน้า"
                                        >
                                            <i className="fas fa-step-backward text-lg"></i>
                                        </button>

                                        <button
                                            onClick={togglePlay}
                                            className="w-20 h-20 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/30 flex items-center justify-center active:scale-95 transition-all"
                                            aria-label={isPlaying ? "หยุดเพลง" : "เล่นเพลง"}
                                        >
                                            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play ml-1"} text-3xl`}></i>
                                        </button>

                                        <button
                                            onClick={nextSong}
                                            className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all flex items-center justify-center active:scale-95"
                                            aria-label="เพลงถัดไป"
                                        >
                                            <i className="fas fa-step-forward text-lg"></i>
                                        </button>
                                    </div>

                                    {/* Lower utility bar (Volume & Download) */}
                                    <div className="flex items-center justify-between w-full pt-6 border-t border-slate-100 dark:border-slate-800/60">
                                        {/* Volume panel */}
                                        <div className="flex items-center space-x-3 w-1/2">
                                            <button
                                                onClick={() => setIsMuted(!isMuted)}
                                                className="text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-8 text-left"
                                                aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
                                            >
                                                <i className={`fas ${isMuted || volume === 0 ? "fa-volume-mute" : volume < 0.5 ? "fa-volume-down" : "fa-volume-up"} text-lg`}></i>
                                            </button>
                                            <input
                                                type="range"
                                                min={0}
                                                max={1}
                                                step={0.05}
                                                value={isMuted ? 0 : volume}
                                                onChange={(e) => {
                                                    setVolume(parseFloat(e.target.value));
                                                    setIsMuted(false);
                                                }}
                                                className="w-20 md:w-28 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none"
                                            />
                                        </div>

                                        {/* Download button */}
                                        <a
                                            href={songUrl}
                                            download={currentSong.filename}
                                            className="inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-primary-600 dark:bg-slate-800 dark:hover:bg-primary-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                                            aria-label={`ดาวน์โหลดเพลง ${currentSong.title}`}
                                        >
                                            <i className="fas fa-download"></i>
                                            <span>Download</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Right: Beautiful Lyrics viewer & Playlist */}
                    <div className="lg:col-span-6 space-y-8">
                        {/* Lyrics Card */}
                        <Reveal animation="fade-left" delay={0.2}>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden flex flex-col h-[480px]">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                                    <i className="fas fa-quote-right text-[10rem]"></i>
                                </div>

                                <div className="flex items-center space-x-3 mb-6 shrink-0 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                                    <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center">
                                        <i className="fas fa-file-alt"></i>
                                    </span>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white">เนื้อร้อง / Lyrics</h3>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Song Lyrics</p>
                                    </div>
                                </div>

                                <div
                                    data-lenis-prevent
                                    className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
                                >
                                    <div className="text-center py-4 font-bold text-slate-600 dark:text-slate-300 whitespace-pre-line leading-loose text-base md:text-lg">
                                        {currentSong.lyrics}
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Playlist/Tracks Selection */}
                        <Reveal animation="fade-left" delay={0.3}>
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 pl-2">บทเพลงทั้งหมด (All Tracks)</h3>
                                <div className="space-y-3">
                                    {songs.map((song, index) => {
                                        const isSelected = currentSongIndex === index;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => playSong(index)}
                                                className={`w-full flex items-center justify-between p-5 rounded-[2rem] border transition-all text-left group ${isSelected
                                                    ? "bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-500/25 scale-[1.01]"
                                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary-500/20 text-slate-800 dark:text-slate-200 hover:-translate-y-0.5 shadow-sm"
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-5 flex-1 min-w-0">
                                                    <span className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-black transition-colors ${isSelected
                                                        ? "bg-white/20 text-white"
                                                        : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 group-hover:text-primary-600"
                                                        }`}>
                                                        {isSelected && isPlaying ? (
                                                            <i className="fas fa-pause text-sm"></i>
                                                        ) : (
                                                            <span>{(index + 1).toString().padStart(2, "0")}</span>
                                                        )}
                                                    </span>

                                                    <div className="min-w-0">
                                                        <h4 className={`font-black text-base transition-colors ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                                            {song.title}
                                                        </h4>
                                                        <p className={`text-xs mt-1 line-clamp-1 font-medium transition-colors ${isSelected ? "text-white/70" : "text-slate-400 dark:text-slate-500"}`}>
                                                            {song.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4 ml-4">
                                                    <span className={`text-xs font-black tracking-wider ${isSelected ? "text-white/80" : "text-slate-400 dark:text-slate-500"}`}>
                                                        {song.duration}
                                                    </span>
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected
                                                        ? "bg-white/10 text-white"
                                                        : "text-slate-300 dark:text-slate-600 group-hover:text-primary-600"
                                                        }`}>
                                                        <i className="fas fa-play text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </main>
    );
}
