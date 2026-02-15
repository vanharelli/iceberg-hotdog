import React, { useEffect, useState } from 'react';
import { MapPin, Star, Instagram, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ cartCount = 0, onCartClick, onInstallClick }) {
  const [showInstall, setShowInstall] = useState(true);

  useEffect(() => {
    try {
      const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = typeof navigator !== 'undefined' && navigator.standalone;
      if (isStandalone || isIOSStandalone) {
        setShowInstall(false);
      } else {
        setShowInstall(true);
      }
    } catch (_) {
      setShowInstall(true);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#001529]/90 to-transparent backdrop-blur-sm border-b border-white/5">
      {/* Localização e Avaliação (Lateral Esquerda) */}
      {showInstall && (
        <button 
          onClick={onInstallClick}
          className="flex flex-col items-start max-w-[200px] hover:opacity-80 transition-opacity cursor-pointer group bg-transparent border-none p-0 text-left"
        >
          <div className="flex items-center gap-1 text-xs text-gray-300 font-medium mb-1 group-hover:text-iceberg transition-colors">
            <Download size={12} className="text-iceberg shrink-0" />
            <motion.span 
              className="truncate uppercase font-bold text-[10px]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              BAIXAR APP
            </motion.span>
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">(4.9)</span>
          </div>
        </button>
      )}

      {/* Logo Centralizada */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div 
           className="h-16 w-auto bg-transparent cursor-pointer flex items-center justify-center"
           whileHover={{ scale: 1.8, filter: "drop-shadow(0 0 30px rgba(34,211,238,1))" }}
           animate={{ 
             filter: [
               "drop-shadow(0 0 0px rgba(6,182,212,0))", 
               "drop-shadow(0 0 10px rgba(6,182,212,0.5))", 
               "drop-shadow(0 0 0px rgba(6,182,212,0))"
             ] 
           }}
           transition={{ 
             default: { duration: 0.3, ease: "easeOut" },
             filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
           }}
        >
          <img 
             src="/logo-iceberg.png" 
             alt="Logo Iceberg" 
             className="h-full w-auto object-contain"
          />
        </motion.div>
      </div>
      
      {/* Lado Direito: Instagram, Avaliação e Localização */}
      <div className="flex items-center gap-4">
        <a 
          href="https://instagram.com/iceberg_hotdog" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-[#E1306C] transition-colors"
        >
          <Instagram size={24} />
        </a>

        <a
          href="https://search.google.com/local/writereview?placeid=ChIJyTRCS3wvWpMRedEofRDc8QY"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center"
          title="Avaliar no Google"
        >
          <div className="flex flex-col items-center leading-none">
            <Star
              size={22}
              className="text-[#D4AF37] fill-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,0.9)] animate-pulse"
            />
            <span className="text-[9px] text-gray-400/70 mt-0.5">
              avaliar
            </span>
          </div>
        </a>

        <a 
          href="https://www.google.com/maps/dir/?api=1&destination=Iceberg+Hot+Dog&destination_place_id=ChIJyTRCS3wvWpMRedEofRDc8QY&travelmode=driving" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-[#0077FF] transition-colors"
        >
           <MapPin size={24} />
        </a>
      </div>
    </header>
  );
}
