import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCartButton({ cartCount, onClick }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a slight delay or scroll, here simple delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Only show if cart has items? User said "com a quantidade de coisas", implying it should show the count.
  // Usually floating cart is always visible or only when items exist. 
  // "o carrinho de compras tem que ser flutunando... com a quantidade de cosias"
  // I'll make it always visible (after delay) but maybe highlight when items exist.
  // If cart is empty, showing 0 is fine, or maybe hide it? 
  // I'll keep it visible so they can access the empty cart too if they want, 
  // but usually it's better if it's always there to remind them.
  
  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[100] w-[min(92vw,560px)] flex items-center justify-center gap-3 px-6 py-4 bg-[#0077FF] text-white rounded-2xl shadow-[0_0_20px_rgba(0,119,255,0.45)] border border-white/10 backdrop-blur-sm hover:bg-[#0066CC] transition-colors"
    >
      <ShoppingBag size={20} />
      <span className="font-black tracking-wide">FINALIZAR SEU PEDIDO</span>
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="ml-1 inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-red-500 border border-[#001529]/40 text-white text-sm font-black animate-pulse"
          >
            {cartCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
