"use client";

import { Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface RoleSelectionProps {
    onSelect: (role: "business" | "investor") => void;
}

export function RoleSelection({ onSelect }: RoleSelectionProps) {
    return (
        <div className="space-y-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-4xl font-bold tracking-tight text-gray-800 mb-3">
                    Welcome to BizLink
                </h2>
                <p className="text-gray-500 text-lg">
                    Choose your path to get started.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect("business")}
                    className="relative flex flex-col items-center justify-center p-10 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:bg-white/60 transition-all duration-300 group"
                >
                    <div className="p-5 rounded-full bg-green-50 group-hover:bg-green-100 mb-6 transition-colors shadow-inner">
                        <Building2 className="w-12 h-12 text-green-600 group-hover:text-green-700 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">For Business</h3>
                    <p className="text-gray-500 text-center leading-relaxed">
                        Raise capital, manage governance, and track compliance.
                    </p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect("investor")}
                    className="relative flex flex-col items-center justify-center p-10 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl hover:bg-white/60 transition-all duration-300 group"
                >
                    <div className="p-5 rounded-full bg-green-50 group-hover:bg-green-100 mb-6 transition-colors shadow-inner">
                        <TrendingUp className="w-12 h-12 text-green-600 group-hover:text-green-700 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">For Investors</h3>
                    <p className="text-gray-500 text-center leading-relaxed">
                        Discover opportunities, track portfolio, and manage deals.
                    </p>
                </motion.button>
            </div>
        </div>
    );
}
