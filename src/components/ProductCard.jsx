import React from 'react';

export default function ProductCard({ name, price, image, isSpecial, description, isPriority = false }) {
  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Imagem preenchendo o módulo inteiro */}
      {image ? (
        <img
          src={image}
          alt={name}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          loading="eager"
          fetchPriority={isPriority ? 'high' : 'auto'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x800/1e293b/white?text=ICEBERG';
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-500">
          <span>Sem imagem</span>
        </div>
      )}

      {/* Gradiente para legibilidade das informações sobre a imagem */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

      {/* Selo Carro Chefe */}
      {isSpecial && (
        <div className="absolute top-3 right-3 bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10 animate-pulse">
          CARRO CHEFE
        </div>
      )}

      {/* Nome, descrição e preço dentro da imagem */}
      <div className="absolute bottom-0 left-0 w-full p-4 z-10">
        <h3
          className={`text-xl font-bold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] ${
            isSpecial ? 'text-cyan-300' : 'text-white'
          }`}
        >
          {name}
        </h3>
        {description && (
          <p className="text-gray-200/90 text-[11px] mt-1.5 leading-snug line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            {description}
          </p>
        )}
        <p className="text-iceberg font-black text-2xl mt-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {price}
        </p>
      </div>
    </div>
  );
}
