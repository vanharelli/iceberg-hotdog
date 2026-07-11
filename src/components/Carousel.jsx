import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function Carousel({ title, items, onProductClick, priorityImageIds = [] }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Detecta o card em destaque (mais próximo do centro) e a direção de rolagem
  // disponível, para exibir a seta certa (avançar / voltar).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIndex(best);

      const maxScroll = el.scrollWidth - el.clientWidth;
      setCanLeft(el.scrollLeft > 8);
      setCanRight(el.scrollLeft < maxScroll - 8);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const scrollByCards = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    const step = (cardRefs.current[0]?.offsetWidth || el.clientWidth * 0.8) + 8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const handleMouseDown = (e) => {
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    // setTimeout to ensure click event fires before resetting isDragging if needed, 
    // but usually click fires after mouseup. 
    // Actually, click fires after mousedown + mouseup.
    // If we use onClick on the element, it should work.
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    setIsDragging(true);
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const containerStyle = {
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    scrollSnapType: 'x mandatory',
    scrollPaddingInline: '7.5vw',
  };

  return (
    <div className="py-2 w-full relative">
      <h2 className="text-2xl font-bold text-white mb-2 w-full px-4">
        {title}
      </h2>
      
      <div className="relative">
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`relative flex items-stretch gap-2 overflow-x-auto px-8 py-10 no-scrollbar carousel-scroll ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={containerStyle}
      >
        {items.map((item, index) => {
          const isPriority = priorityImageIds.includes(item.id);
          return (
            <motion.div
              key={item.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="relative shrink-0 w-[76vw] md:w-[76vw] lg:w-[440px] h-[360px] rounded-2xl snap-center select-none carousel-card"
              onClick={() => {
                if (!isDragging && onProductClick) {
                  onProductClick(item);
                }
              }}
              initial={false}
              animate={
                activeIndex === index
                  ? { scale: 1.08, opacity: 1, filter: 'blur(0px)' }
                  : { scale: 0.8, opacity: 0.45, filter: 'blur(8px)' }
              }
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div 
                className={`w-full h-full backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300
                ${item.isSpecial 
                  ? 'border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]' 
                  : 'border-[0.5px] border-[#0077FF]/30 shadow-[inset_0_0_20px_rgba(0,119,255,0.1)]'
                } bg-white/5`}
              >
                <ProductCard 
                  name={item.name} 
                  price={item.price} 
                  image={item.img}
                  description={item.description}
                  isSpecial={item.isSpecial}
                  isPriority={isPriority}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

        {/* Seta voltar (aparece quando já rolou / no último card) */}
        <AnimatePresence>
          {canLeft && (
            <motion.button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Ver anteriores"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 min-h-0 rounded-full bg-[#001529]/70 backdrop-blur-md border border-iceberg/40 text-iceberg shadow-lg hover:bg-iceberg/20 active:scale-95 transition-colors"
            >
              <ChevronLeft size={22} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Seta avançar (some ao chegar no fim) */}
        <AnimatePresence>
          {canRight && (
            <motion.button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Ver mais opções"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 min-h-0 rounded-full bg-[#001529]/70 backdrop-blur-md border border-iceberg/40 text-iceberg shadow-lg hover:bg-iceberg/20 active:scale-95 transition-colors"
            >
              <ChevronRight size={22} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
