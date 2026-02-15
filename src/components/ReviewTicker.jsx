import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const reviews = [
  'O melhor Hot Dog que já comi!',
  'Sabor inigualável, vale cada centavo.',
  'Pão macio, recheio generoso, perfeito.',
  'Atendimento rápido e educado demais.',
  'Chegou quentinho, do jeito que eu gosto.',
  'Molho da casa é simplesmente viciante.',
  'O X-Tudo mata a fome de verdade.',
  'Preço justo pela qualidade entregue.',
  'Sempre bem embalado e organizado.',
  'Entrega pontual, sem atrasos.',
  'Melhor lanche do Núcleo Bandeirante.',
  'Recomendei para todos os amigos.',
  'Bacon crocante e muito saboroso.',
  'Combinação perfeita de ingredientes.',
  'Hambúrguer suculento e bem temperado.',
  'O Hot Dog Iceberg é absurdo de bom.',
  'Textura perfeita, nada seco.',
  'Padrão sempre alto, nunca decepciona.',
  'Dá vontade de pedir todo dia.',
  'Melhor custo-benefício da região.',
  'Porção muito bem servida.',
  'Queijo sempre bem derretido.',
  'Entrega sempre com sorriso no rosto.',
  'Dá pra sentir o carinho no preparo.',
  'Superou todas as expectativas.',
  'Sabor marcante que fica na memória.',
  'Experiência completa, do pedido à última mordida.',
  'O lanche chega igual à foto do cardápio.',
  'Temperatura perfeita, nada frio.',
  'Simplesmente viciante, virei cliente fiel.'
];

export default function ReviewTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 10000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="review-ticker">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4 }}
          className="review-ticker-inner"
        >
          <span className="review-ticker-text">{reviews[index]}</span>
          <span className="review-ticker-stars">★★★★★</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
