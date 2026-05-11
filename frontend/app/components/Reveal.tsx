import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "zoom-out";
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
}

export default function Reveal({
    children,
    className = "",
    animation = "fade-up",
    delay = 0,
    duration = 0.8,
    threshold = 0.2,
    once = true
}: RevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: threshold, once });

    const variants = {
        hidden: {
            opacity: 0,
            y: animation === "fade-up" ? 50 : animation === "fade-down" ? -50 : 0,
            x: animation === "fade-left" ? 50 : animation === "fade-right" ? -50 : 0,
            scale: animation === "zoom-in" ? 0.9 : animation === "zoom-out" ? 1.1 : 1,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            transition: {
                duration: duration,
                delay: delay,
                ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for professional feel
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={className}
        >
            {children}
        </motion.div>
    );
}
