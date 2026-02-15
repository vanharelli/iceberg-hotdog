import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

export default function Carousel({ title, items, onProductClick, priorityImageIds = [] }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1025);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      if (cardRefs.current) {
        cardRefs.current.forEach((card) => {
          if (card) {
            card.classList.remove('active-card');
          }
        });
      }
      return;
    }

    if (!containerRef.current) return;
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;
        let bestScore = 0;

        entries.forEach((entry) => {
          const score = entry.intersectionRatio;
          if (score > bestScore) {
            bestScore = score;
            bestEntry = entry;
          }
        });

        if (!bestEntry) return;

        const target = bestEntry.target;
        cards.forEach((card) => {
          if (card === target) {
            card.classList.add('active-card');
          } else {
            card.classList.remove('active-card');
          }
        });
      },
      {
        root: containerRef.current,
        threshold: [0.25, 0.5, 0.75, 1],
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
      observer.disconnect();
    };
  }, [isDesktop, items]);

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

  const handleWheel = (e) => {
    if (!isDesktop || !containerRef.current) return;
    e.preventDefault();
    containerRef.current.scrollLeft += e.deltaY;
  };

  const containerStyle = isDesktop
    ? {
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }
    : {
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: '7.5vw',
      };

  return (
    <div className="py-2 w-full relative lg:z-[70]">
      <h2 className="text-2xl font-bold text-white mb-2 w-full px-4">
        {title}
      </h2>
      
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        className={`relative flex items-stretch gap-15 overflow-x-auto px-4 py-10 no-scrollbar carousel-scroll ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
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
              className="relative shrink-0 w-[85vw] md:w-[85vw] lg:w-[450px] h-[360px] rounded-2xl snap-center select-none carousel-card"
              onClick={() => {
                if (!isDragging && onProductClick) {
                  onProductClick(item);
                }
              }}
              initial={isDesktop ? {} : { scale: 0.9, opacity: 0.5, filter: 'blur(6px)' }}
              whileInView={
                isDesktop
                  ? undefined
                  : { scale: 1.05, opacity: 1, filter: 'blur(0px)' }
              }
              viewport={isDesktop ? undefined : { margin: '0px -10% 0px -10%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
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
    </div>
  );
}
