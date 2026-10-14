import React from 'react';

export function HariHaraLogo({ showSubtitle = true, size = 'default', variant = 'default' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  const isLight = variant === 'light';

  const iconDim = isLarge
    ? 'w-20 h-20 sm:w-28 sm:h-28'
    : isSmall
    ? 'w-9 h-9 sm:w-11 sm:h-11'
    : 'w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16';

  const titleSize = isLarge
    ? 'text-xl sm:text-3xl lg:text-4xl'
    : isSmall
    ? 'text-sm sm:text-base'
    : 'text-sm sm:text-xl lg:text-3xl';

  const secondarySize = isLarge
    ? 'text-base sm:text-xl lg:text-2xl'
    : isSmall
    ? 'text-xs sm:text-sm'
    : 'text-xs sm:text-base lg:text-xl';

  const subtitleSize = isSmall ? 'text-[8px] sm:text-[9px]' : 'text-[9px] sm:text-[11px] lg:text-xs';

  return (
    <div className="flex items-center gap-2 sm:gap-3.5 select-none min-w-0">
      {/* Unique 3D Sculpted 24K Gold Lord Shiva Medallion */}
      <div className={`relative ${iconDim} shrink-0 group`}>
        {/* Luxury Gold & Gemstone Bezel Ring */}
        <div className="w-full h-full rounded-full p-[2px] sm:p-[2.5px] bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-700 shadow-lg ring-1 sm:ring-2 ring-amber-400/50">
          <div className="w-full h-full rounded-full overflow-hidden bg-stone-950 border border-amber-300/80 relative">
            <img
              src="/lord-shiva-logo.png"
              alt="Lord Shiva - HARI HARA Jewellery Works"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Expressive Shop Name & Heritage Typography */}
      <div className="leading-tight min-w-0">
        <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span
            className={`font-serif font-black tracking-wider ${titleSize} uppercase ${
              isLight
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-amber-800 to-red-800 drop-shadow-xs'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-300 to-red-400 drop-shadow-[0_2px_8px_rgba(239,68,68,0.35)]'
            }`}
          >
            HARI HARA
          </span>
          <span
            className={`font-serif italic font-bold ${secondarySize} tracking-normal ${
              isLight ? 'text-amber-800' : 'text-amber-300 drop-shadow-xs'
            }`}
          >
            Jewellery Works
          </span>
        </div>

        {showSubtitle && (
          <div
            className={`flex items-center gap-1.5 sm:gap-2 ${subtitleSize} font-semibold tracking-wide flex-wrap mt-0.5 sm:mt-1 ${
              isLight ? 'text-stone-700' : 'text-amber-200'
            }`}
          >
            <span
              className={`px-1.5 sm:px-2 py-0.5 rounded font-medium shadow-xs truncate max-w-[170px] sm:max-w-none ${
                isLight
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
              }`}
            >
              Prop. L. Srinivasa Chary
            </span>
            <span className={isLight ? 'text-amber-600' : 'text-amber-500'}>•</span>
            <span className={isLight ? 'text-amber-900 font-bold' : 'text-amber-300 font-bold'}>
              Est. 2001 (25+ Yrs)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
