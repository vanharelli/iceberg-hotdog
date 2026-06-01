import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SystemFooter() {
  const [showTerms, setShowTerms] = useState(false);
  return (
    <footer className="w-full py-16 border-t border-white/5 bg-transparent">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setShowTerms(true)}
            className="text-[11px] text-white/50 underline decoration-white/20 underline-offset-4 hover:text-white transition-colors"
          >
            Termos de uso e privacidade
          </button>
          <a
            href="https://www.marketelli.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[3px] text-white/30 hover:text-white transition-all uppercase"
          >
            <span>Desenvolvido por </span>
            <span className="shimmer-hotdog">www.marketelli.com</span>
          </a>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 opacity-10">
            <div className="h-[1px] w-10 bg-white"></div>
            <Shield size={12} />
            <div className="h-[1px] w-10 bg-white"></div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showTerms && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            <div
              onClick={() => setShowTerms(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-xl w-[92%] rounded-2xl p-6 text-white shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black tracking-wide">PROTOCOLO DE PRIVACIDADE — ICEBERG</h3>
                <button
                  onClick={() => setShowTerms(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Nossa infraestrutura utiliza tecnologia Stateless, o que significa que nenhum dado pessoal ou rastro de navegação é armazenado. A única função deste sistema é garantir que o seu atendimento seja realizado com máxima rapidez e alta qualidade, conectando você diretamente à nossa equipe sem burocracia ou retenção de informações. Eficiência técnica a serviço da sua experiência.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
