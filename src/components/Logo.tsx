import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    iconSize?: number;
}

export default function Logo({ className = '', showText = true, iconSize = 36 }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
            {/* Logo Icon */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 hover:scale-105"
            >
                <defs>
                    {/* Consistent Gradient from blue to emerald/teal */}
                    <linearGradient id="studyFlowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" /> {/* Deep Blue */}
                        <stop offset="50%" stopColor="#3B82F6" /> {/* Electric Blue */}
                        <stop offset="100%" stopColor="#10B981" /> {/* Emerald/Success Green */}
                    </linearGradient>
                    {/* Filter for the inner glowing rocket part and star */}
                    <filter id="logoInnerGlow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="0" stdDeviation="2" floodOpacity="0.15" />
                        <feGaussianBlur stdDeviation="1" result="blur" />
                    </filter>
                    <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.2" />
                    </filter>
                </defs>

                {/* The Improved Fully Formed Perfect Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="url(#studyFlowGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="1" /* High opacity for a solid, improved ring */
                />

                {/* The Dynamic Rocket Shape inside, with gradient and effect */}
                <path
                    d="M32 70 
                       C 38 58, 42 50, 62 38 
                       C 50 50, 40 58, 32 70 Z"
                    fill="url(#studyFlowGradient)"
                    filter="url(#logoInnerGlow)"
                    opacity="1"
                />

                <path
                    d="M40 68 
                       C 48 55, 52 48, 70 38 
                       C 58 48, 50 55, 40 68 Z"
                    fill="url(#studyFlowGradient)"
                    filter="url(#logoInnerGlow)"
                    opacity="1"
                />

                {/* The Eight-Pointed Star Node, with a subtle glow, now inside the circle */}
                <circle cx="70" cy="38" r="8" fill="#10B981" opacity="0.3" filter="url(#starGlow)" />
                <path
                    d="M70 32 L71.5 36.5 L76 38 L71.5 39.5 L70 44 L68.5 39.5 L64 38 L68.5 36.5 Z"
                    fill="white"
                    filter="url(#starGlow)"
                />

                <path
                    d="M70 32 L71 35 L74 38 L71 41 L70 44 L69 41 L66 38 L69 35 Z"
                    fill="white"
                    filter="url(#starGlow)"
                    opacity="0.8"
                />
            </svg>

            {/* Logo Typography with Gradient flow */}
            {showText && (
                <div className="flex flex-col leading-none">
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Study<span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Flow</span>
                    </span>
                    <span className="text-[10px] font-medium tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
                        AI-powered study planning
                    </span>
                </div>
            )}
        </div>
    );
}