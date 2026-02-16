import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = "5561992864160";
  const message = encodeURIComponent("Olá! Gostaria de fazer um pedido no Iceberg Hot Dog.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  if (!isVisible) return null;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neon-green hover:bg-neon-green/90 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-neon-green/30 transition-all duration-300 transform hover:scale-105 group"
    >
      <span className="font-bold text-sm hidden md:block">FAZER PEDIDO</span>
      <MessageCircle size={24} className="fill-white" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#001529]"></span>
    </a>
  );
}
