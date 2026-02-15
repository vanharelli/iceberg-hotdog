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
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#001529]/90 to-transparent backdrop-blur-sm border-b border-white/5">
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
      
      {/* Lado Direito: Instagram e Localização */}
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
          href="https://www.google.com/maps/place/Iceberg+Hot+Dog/@-15.871547,-47.9707731,17z/data=!4m6!3m5!1s0x935a2f7c4b4234c9:0x6f1dc107d28d179!8m2!3d-15.871547!4d-47.9707731!16s%2Fg%2F11gy67cmxy?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D" 
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
