"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface WizardProps {
    step: number;
    children: ReactNode;
    direction?: number;
}

export function Wizard({ step, children, direction = 1 }: WizardProps) {
    const variants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            y: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <div className="w-full max-w-2xl mx-auto min-h-[60vh] flex flex-col justify-center relative overflow-hidden">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        y: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
