import React from "react";

function Logo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        {/* Core letter 'C' gradient */}
        <linearGradient id="logo-c-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="50%" stopColor="#3A4EFF" />
          <stop offset="100%" stopColor="#A826FF" />
        </linearGradient>

        {/* Bar chart gradient */}
        <linearGradient id="logo-bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3A4EFF" stopOpacity="0.15" />
        </linearGradient>

        {/* Subtle drop shadow / glow for the rising line */}
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Stylized letter C */}
      <path
        d="M 80.64 24.29 A 40 40 0 1 0 80.64 75.71 L 71.45 68.00 A 28 28 0 1 1 71.45 32.00 Z"
        fill="url(#logo-c-grad)"
      />

      {/* Code symbol < /> */}
      <path
        d="M 42 34 L 35 39.5 L 42 45"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 47 47 L 53 32"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 58 34 L 65 39.5 L 58 45"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bar Chart */}
      <rect x="41" y="66" width="3" height="8" rx="1" fill="url(#logo-bar-grad)" />
      <rect x="46" y="59" width="3" height="15" rx="1" fill="url(#logo-bar-grad)" />
      <rect x="51" y="51" width="3" height="23" rx="1" fill="url(#logo-bar-grad)" />
      <rect x="56" y="42" width="3" height="32" rx="1" fill="url(#logo-bar-grad)" />

      {/* Rising Line Chart */}
      <path
        d="M 36 73 L 42.5 65 L 47.5 57 L 52.5 49 L 57.5 40 L 63 34"
        stroke="#00D2FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logo-glow)"
      />

      {/* Circular Nodes */}
      <circle cx="42.5" cy="65" r="1.8" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1" />
      <circle cx="47.5" cy="57" r="1.8" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1" />
      <circle cx="52.5" cy="49" r="1.8" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1" />
      <circle cx="57.5" cy="40" r="1.8" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1" />
    </svg>
  );
}

export default Logo;
