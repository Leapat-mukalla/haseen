'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface RippleIconProps {
  icon: LucideIcon;
  hoverIcon?: LucideIcon;
  rippleColor?: string;
  size?: number;
  className?: string;
  tooltip?: string;
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
}

export function RippleIcon({ 
  icon: Icon, 
  hoverIcon: HoverIcon, 
  rippleColor = 'rgba(59, 130, 246, 0.5)', 
  size = 28,
  className = '',
  tooltip,
  tooltipPosition = 'top'
}: RippleIconProps) {

  // Create a transparent version of the provided color for the fade out step
  const toTransparent = (color: string) => {
    // rgba(r,g,b,a) -> rgba(r,g,b,0)
    const rgbaMatch = color.match(/^rgba\(([^)]+)\)$/i);
    if (rgbaMatch) {
      const parts = rgbaMatch[1].split(',').map((s) => s.trim());
      if (parts.length >= 3) {
        const [r, g, b] = parts;
        return `rgba(${r}, ${g}, ${b}, 0)`;
      }
    }
    // rgb(r,g,b) -> rgba(r,g,b,0)
    const rgbMatch = color.match(/^rgb\(([^)]+)\)$/i);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, 0)`;
    }
    // Fallback
    return 'transparent';
  };

  const transparentColor = toTransparent(rippleColor);
  // Spread radius proportional to icon size (similar ratio to the CSS example)
  const spread = Math.round(size * 2); // approx. element diameter (size*2)

  // Determine tooltip positioning classes
  const tooltipClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2'
  }[tooltipPosition];

  return (
    <div className="relative inline-block">
      <div
        className={`relative bg-primary rounded-full inline-flex items-center justify-center group ${className}`}
        style={{ width: size * 2, height: size * 2 }}
      >
        {/* Tooltip */}
        {tooltip && (
          <div 
            className={`absolute ${tooltipClasses} hidden group-hover:block z-30 whitespace-nowrap px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg transition-opacity duration-300 text-right`}
            style={{ direction: 'rtl' }}
            role="tooltip"
          >
            {tooltip}
            <div 
              className={`absolute ${tooltipPosition === 'top' ? 'top-full' : tooltipPosition === 'bottom' ? 'bottom-full' : tooltipPosition === 'left' ? 'left-full' : 'right-full'} ${tooltipPosition === 'top' || tooltipPosition === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2'}`}
            >
              <div className={`border-solid ${tooltipPosition === 'top' ? 'border-t-gray-800 border-t-8 border-x-transparent border-x-8 border-b-0' : tooltipPosition === 'bottom' ? 'border-b-gray-800 border-b-8 border-x-transparent border-x-8 border-t-0' : tooltipPosition === 'left' ? 'border-l-gray-800 border-l-8 border-y-transparent border-y-8 border-r-0' : 'border-r-gray-800 border-r-8 border-y-transparent border-y-8 border-l-0'}`}></div>
            </div>
          </div>
        )}
      {/* Pulse ring using the same logic as the CSS: scale + box-shadow spread */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 2,
          height: size * 2,
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          willChange: 'transform, box-shadow',
        }}
        animate={{
          scale: [0.8, 1, 0.8],
          boxShadow: [
            `0 0 0 0 ${rippleColor}`,
            `0 0 0 ${spread}px ${transparentColor}`,
            `0 0 0 0 ${rippleColor}`,
          ],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          times: [0, 0.7, 1],
        }}
      />

      {/* Icon (static – only swaps on hover using CSS, no scale animation) */}
      <div className="relative z-10 flex items-center justify-center rounded-full" style={{ width: size, height: size }}>
        {/* Default icon */}
        <Icon
          size={size}
          className={`transition-opacity duration-200 ${HoverIcon ? 'group-hover:opacity-0' : ''}`}
          aria-hidden={!!HoverIcon}
        />
        {/* Hover icon overlay */}
        {HoverIcon && (
          <HoverIcon
            size={size}
            className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center"
            aria-hidden
          />
        )}
      </div>
      </div>
    </div>
  );
}

