import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initialTheme = savedTheme || systemTheme;

        setTheme(initialTheme);
        if (initialTheme === "dark") {
            document.documentElement.classList.add("dark");
            document.body.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.body.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        console.log("Switching to theme:", newTheme);
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
            document.body.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.body.classList.remove("dark");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "light" ? 0 : 360, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                {theme === "light" ? (
                    <i className="fas fa-moon text-lg text-primary-500"></i>
                ) : (
                    <i className="fas fa-sun text-lg text-yellow-400"></i>
                )}
            </motion.div>
        </button>
    );
}
