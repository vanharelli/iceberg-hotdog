import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

export default function Carousel({ title, items, onProductClick }) {
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <div className="py-2">
      <h2 className="text-2xl font-bold text-white mb-2 px-6 md:px-12">{title}</h2>
      
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-6 overflow-x-auto px-[50%] py-10 no-scrollbar snap-x snap-mandatory ${isDown ? 'cursor-grabbing snap-none' : 'cursor-grab'}`}
        style={{ scrollPaddingLeft: '0px' }}
      >
        {items.map((item) => {
            return (
                <motion.div
                    key={item.id}
                    className="relative shrink-0 w-[280px] h-[400px] rounded-2xl snap-center select-none"
                    onClick={() => {
                        if (!isDragging && onProductClick) {
                            onProductClick(item);
                        }
                    }}
                    initial={{ scale: 0.9, opacity: 0.5, filter: 'blur(6px)' }}
                    whileInView={{ scale: 1.1, opacity: 1, filter: 'blur(0px)' }}
                    viewport={{ margin: "0px -40% 0px -40%" }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                       />
                    </div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
}
