import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const feedbackVault = [
  "O melhor Hot Dog que já comi, o Iceberg é gigante!",
  "A pasta de alho secreta é de outro mundo, surreal.",
  "Chegou muito rápido e muito quente. Nota 10.",
  "Sabor inigualável, vale cada centavo pelo tamanho.",
  "O cheddar derretido é o diferencial, suculência máxima.",
  "Finalmente um lanche que sacia de verdade. Espetacular.",
  "Atendimento rápido e o lanche é uma obra de arte.",
  "O bacon crocante com o frango grelhado é a melhor escolha.",
  "Virei fã, o padrão de qualidade é superior a qualquer outro.",
  "Experiência completa. Sabor, rapidez e preço justo.",
  "A montagem é impecável, dá pra ver o cuidado em cada camada.",
  "Melhor custo-benefício. O valor é irresistível pelo tamanho.",
  "Incrível como o frango grelhado faz a diferença no sabor!",
  "A batata palha estava super crocante, entrega nota 1000.",
  "O Iceberg é realmente uma montanha de sabor. Recomendo muito!",
  "O frango grelhado no ponto certo faz toda a diferença, nota mil!",
  "Melhor custo-benefício. O valor é irresistível pelo tamanho do lanche.",
  "A batata palha estava super crocante, entrega padrão elite.",
  "Queijo derretido que estica de verdade, a suculência é absurda.",
  "O atendimento pelo WhatsApp foi extremamente ágil e cordial.",
  "Um lanche que você come com os olhos primeiro. Visual incrível!",
  "O milho e os temperos casam perfeitamente. Nada de lanche seco!",
  "Viciante. Depois que você prova o Iceberg, não quer outro.",
  "Impossível comer um só. O sabor gruda na mente, é bom demais!",
  "A cremosidade do cheddar com a crocância do bacon é elite pura.",
  "Lanche pesado, de respeito! Matou minha fome com autoridade.",
  "Entrega ultra rápida. O lanche chegou como se tivesse saído da chapa agora.",
  "O tempero da casa é o segredo. Inigualável em cada mordida.",
  "Perfeição define. Tudo fresco, bem montado e extremamente suculento.",
  "Já virei cliente fiel. O padrão Iceberg é outro nível de lanche.",
  "O frango grelhado é super macio e temperado no ponto exato.",
  "Dá pra sentir a qualidade dos ingredientes logo no primeiro pedaço.",
  "Simplesmente imbatível. O sabor que afunda qualquer concorrência."
];

export const ReviewPulse = () => {
  const [review, setReview] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const triggerPulse = () => {
      const randomText = feedbackVault[Math.floor(Math.random() * feedbackVault.length)];
      setReview(randomText);
      setActive(true);
      setTimeout(() => setActive(false), 7000);
    };

    const timer = setInterval(triggerPulse, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={`fixed left-6 top-1/2 -translate-y-1/2 z-[100] transition-all duration-1000 ease-in-out ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 border-l-2 border-[#0077FF] p-4 rounded-r-lg shadow-[20px_0_50px_rgba(0,0,0,0.6)] max-w-[280px]">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
          ))}
        </div>
        <p className="text-white text-[11px] leading-relaxed font-light tracking-wide italic">
          "{review}"
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-[1px] w-4 bg-[#0077FF]/30"></div>
          <span className="text-[8px] text-[#0077FF] uppercase tracking-[2px] font-bold">Feedback Real</span>
        </div>
      </div>
    </div>
  );
};
