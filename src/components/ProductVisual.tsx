import React from 'react';
import { Product } from '../types/store';

interface ProductVisualProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  className = '',
  size = 'md'
}) => {
  const getVisual = () => {
    switch (product.iconType) {
      case 'irrigation':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50/20 to-stone-200 overflow-hidden">
            {/* Background concentric drip rings */}
            <svg className="w-full h-full p-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" stroke="#475569" strokeWidth="8" strokeDasharray="14 8" opacity="0.8" />
              <circle cx="100" cy="100" r="62" stroke="#1e293b" strokeWidth="10" opacity="0.9" />
              <circle cx="100" cy="100" r="44" stroke="#0f172a" strokeWidth="12" />
              <circle cx="100" cy="100" r="26" stroke="#c2410c" strokeWidth="14" />
              <circle cx="100" cy="100" r="10" fill="#9a3412" />
              {/* Dripper emitters */}
              <circle cx="100" cy="20" r="5" fill="#f59e0b" />
              <circle cx="100" cy="180" r="5" fill="#f59e0b" />
              <circle cx="20" cy="100" r="5" fill="#f59e0b" />
              <circle cx="180" cy="100" r="5" fill="#f59e0b" />
              {/* Water droplet accent */}
              <path d="M100 45 C100 45 88 62 88 72 C88 78 93 84 100 84 C107 84 112 78 112 72 C112 62 100 45 100 45 Z" fill="#0284c7" opacity="0.9" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-medium text-stone-800 bg-stone-200/90 px-1.5 py-0.5 rounded">
              UV-STABILIZED DRIP
            </div>
          </div>
        );

      case 'sprayer':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-100 to-stone-200 overflow-hidden">
            <svg className="w-full h-full p-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Tank Body */}
              <rect x="65" y="55" width="70" height="95" rx="16" fill="#c2410c" stroke="#9a3412" strokeWidth="4" />
              {/* Tank Cap */}
              <rect x="85" y="42" width="30" height="13" rx="4" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              {/* Base support stand */}
              <rect x="60" y="148" width="80" height="12" rx="4" fill="#334155" />
              {/* Pressure gauge indicator */}
              <circle cx="82" cy="85" r="12" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
              <line x1="82" y1="85" x2="89" y2="80" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
              {/* Voltmeter / Switch */}
              <rect x="74" y="110" width="16" height="20" rx="3" fill="#0f172a" />
              <circle cx="82" cy="116" r="3" fill="#f59e0b" />
              {/* Lance Hose & Wand */}
              <path d="M125 135 C145 135 155 120 155 90 L155 35" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
              <line x1="155" y1="35" x2="155" y2="15" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
              {/* Spray mist particles */}
              <circle cx="155" cy="10" r="3" fill="#38bdf8" opacity="0.8" />
              <circle cx="148" cy="6" r="2" fill="#38bdf8" opacity="0.6" />
              <circle cx="162" cy="6" r="2.5" fill="#38bdf8" opacity="0.7" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-medium text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded">
              12V DUAL MOTOR
            </div>
          </div>
        );

      case 'drill':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50/30 to-stone-200 overflow-hidden">
            <svg className="w-full h-full p-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Drill Body */}
              <path d="M50 70 L120 70 L125 90 L145 90 L145 110 L115 110 L100 145 L75 145 L85 105 L50 95 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="3" />
              {/* Chuck & Chuck collar */}
              <rect x="145" y="93" width="22" height="14" rx="2" fill="#334155" />
              {/* Drill bit */}
              <polygon points="167,97 195,100 167,103" fill="#94a3b8" />
              {/* Rubber grip */}
              <rect x="80" y="115" width="18" height="26" rx="2" fill="#0f172a" />
              {/* Trigger */}
              <rect x="98" y="112" width="7" height="12" rx="2" fill="#dc2626" />
              {/* Ventilation fins */}
              <line x1="60" y1="78" x2="75" y2="78" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <line x1="60" y1="84" x2="75" y2="84" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <line x1="60" y1="90" x2="75" y2="90" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-medium text-sky-800 bg-sky-100/90 px-1.5 py-0.5 rounded">
              HEAVY POWER TOOL
            </div>
          </div>
        );

      case 'fasteners':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-stone-200 to-zinc-300 overflow-hidden">
            <svg className="w-full h-full p-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Hex bolt & nut */}
              <polygon points="100,45 130,62 130,97 100,114 70,97 70,62" fill="#64748b" stroke="#334155" strokeWidth="3" />
              <circle cx="100" cy="80" r="14" fill="#334155" />
              <rect x="94" y="112" width="12" height="50" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
              <line x1="90" y1="124" x2="110" y2="124" stroke="#334155" strokeWidth="2" />
              <line x1="90" y1="134" x2="110" y2="134" stroke="#334155" strokeWidth="2" />
              <line x1="90" y1="144" x2="110" y2="144" stroke="#334155" strokeWidth="2" />
              {/* Stainless screw */}
              <path d="M50 110 L70 110 L62 155 L58 155 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
              <line x1="48" y1="110" x2="72" y2="110" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-medium text-slate-800 bg-slate-200/90 px-1.5 py-0.5 rounded">
              GRADE 8.8 FASTENERS
            </div>
          </div>
        );

      case 'fencing':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 via-stone-100 to-stone-200 overflow-hidden">
            <svg className="w-full h-full p-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Barbed Wire Lines */}
              <line x1="20" y1="65" x2="180" y2="65" stroke="#475569" strokeWidth="3.5" />
              <line x1="20" y1="135" x2="180" y2="135" stroke="#475569" strokeWidth="3.5" />
              {/* Barbs on line 1 */}
              <path d="M70 52 L90 78 M90 52 L70 78" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <path d="M130 52 L150 78 M150 52 L130 78" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              {/* Barbs on line 2 */}
              <path d="M50 122 L70 148 M70 122 L50 148" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <path d="M110 122 L130 148 M130 122 L110 148" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              {/* Post */}
              <rect x="94" y="30" width="12" height="140" fill="#78716c" stroke="#44403c" strokeWidth="2" opacity="0.6" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-medium text-stone-800 bg-stone-200/90 px-1.5 py-0.5 rounded">
              GI BARBED WIRE & FENCING
            </div>
          </div>
        );

      case 'cement':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50/40 to-stone-200 overflow-hidden">
            <svg className="w-full h-full p-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="52" y="45" width="96" height="115" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
              {/* Yellow/Black brand stripe */}
              <rect x="54" y="80" width="92" height="40" fill="#facc15" />
              <text x="100" y="98" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">CEMENT</text>
              <text x="100" y="112" textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="sans-serif">50 KG PPC</text>
              <line x1="52" y1="52" x2="148" y2="52" stroke="#0f172a" strokeWidth="3" strokeDasharray="5 3" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-medium text-stone-800 bg-stone-200/90 px-1.5 py-0.5 rounded">
              GRADE 53 & PPC
            </div>
          </div>
        );

      case 'safety':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/30 to-stone-100 overflow-hidden">
            <svg className="w-full h-full p-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Tarpaulin folded sheet */}
              <polygon points="50,75 140,55 160,130 70,150" fill="#2563eb" stroke="#1d4ed8" strokeWidth="3" />
              <polygon points="40,85 130,65 135,78 45,98" fill="#1e40af" />
              {/* Eyelet rings */}
              <circle cx="56" cy="80" r="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
              <circle cx="136" cy="62" r="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
              <circle cx="152" cy="125" r="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
              <circle cx="76" cy="142" r="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
              {/* Grid texture representing woven cross-lamination */}
              <line x1="65" y1="72" x2="145" y2="133" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="80" y1="68" x2="160" y2="130" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-medium text-blue-800 bg-blue-100/90 px-1.5 py-0.5 rounded">
              100% WATERPROOF
            </div>
          </div>
        );

      case 'tools':
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50/30 to-stone-200 overflow-hidden">
            <svg className="w-full h-full p-4" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Pruning shears / Secateur */}
              <path d="M70 140 L95 105 L135 60 L145 65 L105 110 L85 155 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
              <path d="M130 140 L105 105 L65 60 L55 65 L95 110 L115 155 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
              {/* Pivot bolt */}
              <circle cx="100" cy="105" r="7" fill="#cbd5e1" stroke="#334155" strokeWidth="3" />
              {/* Steel Cutting Blades */}
              <path d="M96 102 L135 55 C125 50 110 55 95 75 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono font-medium text-stone-800 bg-stone-200/90 px-1.5 py-0.5 rounded">
              SK-5 HARDENED STEEL
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {getVisual()}
    </div>
  );
};
