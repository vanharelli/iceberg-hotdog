import React from 'react';
import { motion } from 'framer-motion';

export default function ProductCard({ name, price, image, isSpecial, description }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-[45%] relative overflow-hidden rounded-t-xl shrink-0">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x300/1e293b/white?text=ICEBERG';
            }}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-500">
            <span>No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {isSpecial && (
             <div className="absolute top-2 right-2 bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10 animate-pulse">
               CARRO CHEFE
             </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col gap-2 h-[55%] relative justify-between">
        <div>
            <h3 className={`text-lg font-bold leading-tight ${isSpecial ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-white'}`}>
                {name}
            </h3>
            {description && (
                <p className="text-gray-400 text-[10px] mt-2 leading-tight">
                    {description}
                </p>
            )}
        </div>
        
        <div className="mt-auto pt-2 border-t border-white/10 flex justify-between items-center w-full shrink-0">
            <p className="text-iceberg font-bold text-xl drop-shadow-md">{price}</p>
        </div>
      </div>
    </div>
  );
}
