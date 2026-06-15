import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

/**
 * Tela de carregamento (preloader).
 * - Cobre a tela inteira com fundo azul (fixed, inset-0, z-index alto).
 * - Centro: logo + nome da marca, barra de progresso fina e contador 0% → 100%.
 * - GSAP anima o contador e a barra juntos (~1,8s), depois o conteúdo some
 *   com leve fade/subida e a tela desliza para cima (efeito cortina).
 * - Timeout de segurança (~4,2s) força a revelação se a animação travar.
 * - onComplete é disparado uma única vez.
 */
export default function Preloader({ onComplete }) {
  const rootRef = useRef(null);
  const centerRef = useRef(null);
  const barRef = useRef(null);
  const completedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete?.();
    };

    // Trava o scroll enquanto a tela de carregamento estiver visível
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const counter = { value: 0 };

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
    });

    // 1) Contador (0 → 100) e barra preenchendo da esquerda para a direita, juntos
    tl.to(
      counter,
      {
        value: 100,
        duration: 1.8,
        onUpdate: () => setProgress(Math.round(counter.value)),
      },
      0
    ).to(
      barRef.current,
      {
        scaleX: 1,
        duration: 1.8,
      },
      0
    );

    // 2) Conteúdo central some com leve fade + subida
    tl.to(
      centerRef.current,
      {
        opacity: 0,
        y: -28,
        duration: 0.5,
        ease: 'power2.in',
      },
      '+=0.15'
    );

    // 3) Cortina: a tela inteira desliza para cima revelando o site
    tl.to(
      rootRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: finish,
      },
      '-=0.1'
    );

    // Timeout de segurança: força a revelação caso a animação trave
    const safety = setTimeout(() => {
      if (completedRef.current) return;
      tl.kill();
      setProgress(100);
      gsap.set(centerRef.current, { opacity: 0 });
      gsap.to(rootRef.current, {
        yPercent: -100,
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: finish,
      });
    }, 4200);

    return () => {
      clearTimeout(safety);
      tl.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[#001529] overflow-hidden"
      aria-hidden="true"
    >
      {/* Fundo azul — exclusivo da tela de loading */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#013a63] via-[#001f3a] to-[#00070f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_62%)]" />

      <div ref={centerRef} className="relative flex flex-col items-center w-[min(82vw,380px)]">
        {/* Logo com motion hipnótico (PC e mobile) */}
        <motion.img
          src="/logo-iceberg.png"
          alt="Iceberg Hot Dog"
          className="h-36 sm:h-44 max-w-[78vw] w-auto object-contain"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
            rotate: [-2.5, 2.5, -2.5],
            filter: [
              'drop-shadow(0 0 8px rgba(34,211,238,0.35))',
              'drop-shadow(0 0 30px rgba(34,211,238,0.85))',
              'drop-shadow(0 0 8px rgba(34,211,238,0.35))',
            ],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tighter text-center leading-[0.95] drop-shadow-2xl">
          <span className="shimmer-hotdog">ICEBERG</span>
          <br />
          <span className="shimmer-hotdog">HOT DOG</span>
        </h1>

        {/* Barra de progresso fina */}
        <div className="mt-10 w-full h-[3px] rounded-full bg-white/10 overflow-hidden">
          <div
            ref={barRef}
            className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#0077FF] to-iceberg"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Contador 0% → 100% */}
        <div className="mt-3 w-full flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-[3px] text-white/40">
            Carregando
          </span>
          <span className="text-sm font-bold tabular-nums text-white/80">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
