import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-transparent py-8 mt-12">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-6">
        
        {/* Copyright */}
        <div className="text-center space-y-1">
            <p className="text-[10px] text-gray-600">
            © {new Date().getFullYear()} ICEBERG HOT DOG. Todos os direitos reservados.
            </p>
            <p className="text-[9px] text-gray-700">
                O Sabor que Afunda sua Fome.
            </p>
        </div>
      </div>
    </footer>
  );
}