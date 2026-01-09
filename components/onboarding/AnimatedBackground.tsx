"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function AnimatedBackground() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const ctx = gsap.context(() => {
            // Animate lines
            gsap.to(".line-path", {
                strokeDashoffset: 0,
                duration: 3,
                stagger: 0.5,
                ease: "power2.inOut",
            });

            // Floating animation for blobs
            gsap.to(".blob", {
                y: "random(-20, 20)",
                x: "random(-20, 20)",
                duration: "random(3, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 1,
            });
        }, svgRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#fafcfb] pointer-events-none">
            {/* Soft Green Gradient Blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#e6f4ea] blur-3xl opacity-60 blob" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#f0f9f4] blur-3xl opacity-60 blob" />
            <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#d8efe0] blur-3xl opacity-40 blob" />

            {/* SVG Lines */}
            <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full opacity-30"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Abstract organic lines */}
                <path
                    className="line-path"
                    d="M-50,400 C300,300 600,600 1500,300"
                    fill="none"
                    stroke="#4ade80" // Green-400
                    strokeWidth="2"
                    strokeDasharray="2000"
                    strokeDashoffset="2000"
                />
                <path
                    className="line-path"
                    d="M-50,600 C400,500 800,800 1500,500"
                    fill="none"
                    stroke="#86efac" // Green-300
                    strokeWidth="1.5"
                    strokeDasharray="2000"
                    strokeDashoffset="2000"
                />
                <path
                    className="line-path"
                    d="M-50,200 C350,200 700,400 1500,100"
                    fill="none"
                    stroke="#22c55e" // Green-500
                    strokeWidth="1"
                    strokeDasharray="2000"
                    strokeDashoffset="2000"
                />
            </svg>
        </div>
    );
}
