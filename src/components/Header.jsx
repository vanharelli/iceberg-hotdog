import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Star, Instagram, Download, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from './StatusBadge';
import NotificationErrorBoundary from './NotificationErrorBoundary';

export default function Header({ cartCount = 0, onCartClick }) {
  const [showInstall, setShowInstall] = useState(true);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      try {
        e.preventDefault();
        setInstallPromptEvent(e);
        setCanInstall(true);
      } catch (_) {}
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Trava o scroll do corpo enquanto o menu de tela cheia estiver aberto
  useEffect(() => {
    if (menuOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [menuOpen]);

  const handleInstallClick = async () => {
    try {
      if (!installPromptEvent) return;
      installPromptEvent.prompt();
      await installPromptEvent.userChoice.catch(() => {});
      setInstallPromptEvent(null);
      setCanInstall(false);
    } catch (_) {}
  };

  // Itens de navegação reutilizados no desktop e no menu mobile
  const navLinks = [
    {
      key: 'instagram',
      label: 'Instagram',
      hint: '@iceberg_hotdog',
      href: 'https://instagram.com/iceberg_hotdog',
      icon: Instagram,
      hoverClass: 'hover:text-[#E1306C]',
    },
    {
      key: 'review',
      label: 'Avaliar no Google',
      hint: 'Conte como foi sua experiência',
      href: 'https://search.google.com/local/writereview?placeid=ChIJyTRCS3wvWpMRedEofRDc8QY',
      icon: Star,
      hoverClass: 'hover:text-[#D4AF37]',
    },
    {
      key: 'map',
      label: 'Como chegar',
      hint: 'Núcleo Bandeirante',
      href: 'https://www.google.com/maps/dir/?api=1&destination=Iceberg+Hot+Dog&destination_place_id=ChIJyTRCS3wvWpMRedEofRDc8QY&travelmode=driving',
      icon: MapPin,
      hoverClass: 'hover:text-[#0077FF]',
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[120] flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-[#001529]/90 to-transparent backdrop-blur-sm border-b border-white/5">
      {/* Instalar app — visível apenas no desktop */}
      <div className="hidden md:flex flex-1 justify-start">
        {showInstall && (
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={!canInstall}
            className="flex flex-col items-start max-w-[200px] opacity-80 transition-opacity cursor-pointer group bg-transparent border-none p-0 text-left disabled:opacity-50 disabled:cursor-default"
          >
            <div className="flex items-center gap-1 text-xs text-gray-300 font-medium mb-1 group-hover:text-iceberg transition-colors">
              <Download size={12} className="text-iceberg shrink-0" />
              <motion.span
                className="truncate uppercase font-bold text-[10px]"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
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
      </div>

      {/* Botão burger — visível apenas no mobile (lado esquerdo) */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        className="md:hidden flex items-center justify-center w-11 h-11 -ml-1 rounded-xl text-white/90 hover:text-iceberg hover:bg-white/5 transition-colors"
      >
        <Menu size={26} />
      </button>

      {/* Badge de horário centralizado (no lugar da logo) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <NotificationErrorBoundary>
          <StatusBadge />
        </NotificationErrorBoundary>
      </div>

      {/* Ícones de navegação — visíveis apenas no desktop */}
      <div className="hidden md:flex flex-1 justify-end items-center gap-4">
        <a
          href="https://instagram.com/iceberg_hotdog"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
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
            <span className="text-[9px] text-gray-400/70 mt-0.5">avaliar</span>
          </div>
        </a>

        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Iceberg+Hot+Dog&destination_place_id=ChIJyTRCS3wvWpMRedEofRDc8QY&travelmode=driving"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Como chegar"
          className="text-gray-300 hover:text-[#0077FF] transition-colors"
        >
          <MapPin size={24} />
        </a>
      </div>

      {/* Espaçador para equilibrar o burger e manter a logo centralizada no mobile */}
      <div className="md:hidden w-11 h-11" aria-hidden="true" />

      {/* Menu de tela cheia (mobile) */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-[200] flex flex-col"
            >
            {/* Fundo opaco */}
            <div className="absolute inset-0 bg-[#02101d]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#063454] via-[#021a30] to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%)]" />

            {/* Conteúdo */}
            <div
              className="relative flex flex-col h-full px-6"
              style={{
                paddingTop: 'calc(env(safe-area-inset-top) + 1.25rem)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
              }}
            >
              {/* Topo: logo + fechar */}
              <div className="flex items-center justify-between">
                <img src="/logo-iceberg.png" alt="Iceberg Hot Dog" className="h-12 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="flex items-center justify-center w-11 h-11 rounded-xl text-white/90 hover:text-iceberg hover:bg-white/5 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Avaliação */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-10 flex items-center gap-2"
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
                <span className="text-sm text-gray-300 font-medium">4,9 no Google</span>
              </motion.div>

              {/* Links de navegação */}
              <nav className="mt-8 flex flex-col divide-y divide-white/10 border-y border-white/10">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.07, ease: 'easeOut' }}
                      className={`group flex items-center gap-4 py-5 text-white ${link.hoverClass} transition-colors`}
                    >
                      <Icon size={26} className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight">{link.label}</span>
                        <span className="text-xs text-gray-400 font-medium">{link.hint}</span>
                      </span>
                    </motion.a>
                  );
                })}
              </nav>

              {/* Instalar app */}
              {showInstall && (
                <motion.button
                  type="button"
                  onClick={() => {
                    handleInstallClick();
                    setMenuOpen(false);
                  }}
                  disabled={!canInstall}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + navLinks.length * 0.07 }}
                  className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-iceberg/15 border border-iceberg/40 text-iceberg font-bold tracking-wide transition-colors hover:bg-iceberg/25 disabled:opacity-40 disabled:cursor-default"
                >
                  <Download size={18} />
                  <span>Instalar aplicativo</span>
                </motion.button>
              )}

              {/* Rodapé do menu */}
              <p className="mt-auto pt-8 text-center text-[11px] uppercase tracking-[3px] text-white/30">
                Iceberg Hot Dog · Núcleo Bandeirante
              </p>
            </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
