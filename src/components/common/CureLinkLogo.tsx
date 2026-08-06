import React from 'react';

interface CureLinkLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const CureLinkLogo: React.FC<CureLinkLogoProps> = ({
  size = 34,
  showText = true,
  textColor = 'text-white',
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 filter drop-shadow-sm"
      >
        {/* Isometric 3D Hexagonal Cube with C-shaped cut out matching CureLink logo */}
        <g transform="translate(10, 5)">
          {/* Top Facet */}
          <path
            d="M50 10 L88 32 L50 54 L12 32 Z"
            fill="#10B981"
          />
          {/* Left Vertical Facet */}
          <path
            d="M12 32 L50 54 L50 96 L12 74 Z"
            fill="#059669"
          />
          {/* Right Facet Outer Structure */}
          <path
            d="M50 54 L88 32 L88 74 L50 96 Z"
            fill="#047857"
          />
          {/* C-Shape Cutout Facet Accents */}
          <path
            d="M50 34 L72 21 L72 39 L50 52 Z"
            fill="#34D399"
          />
          <path
            d="M50 54 L72 41 L72 65 L50 78 Z"
            fill="#059669"
          />
          <path
            d="M32 43 L50 54 L50 78 L32 67 Z"
            fill="#047857"
          />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`text-lg font-black tracking-wider ${textColor} flex items-center gap-1.5 leading-tight`}>
            CURE<span className="text-emerald-400 font-extrabold">LINK</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
              AI CDSS
            </span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Clinical Decision Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
