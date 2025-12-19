
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  const uniqueId = React.useId().replace(/:/g, "");
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 256 256" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-sm`}
    >
      <defs>
        <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* G corporativo (forma principal) - Redimensionado para ocupar mais espaço */}
      <path
        d="M218 128 A90 90 0 1 1 128 38"
        fill="none"
        stroke={`url(#grad-${uniqueId})`}
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Corte do G - Ajustado proporcionalmente */}
      <line
        x1="218" 
        y1="128"
        x2="170" 
        y2="128"
        stroke={`url(#grad-${uniqueId})`}
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* Contenção / análise - Ampliado */}
      <circle 
        cx="128" 
        cy="128" 
        r="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-30"
      />

      {/* Núcleo do erro (bug abstrato) - Ampliado */}
      <circle 
        cx="128" 
        cy="128" 
        r="24"
        fill="white"
        stroke="currentColor"
        strokeWidth="6"
        className="opacity-90"
      />

      {/* Internal "Live" Signal Node - Ajustado */}
      <circle 
        cx="128" 
        cy="128" 
        r="10"
        fill="currentColor"
        className="animate-pulse"
      />
    </svg>
  );
};

export default Logo;
