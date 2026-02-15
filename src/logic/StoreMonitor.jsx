import { useEffect, useRef } from 'react';

export const useStoreAlert = (isOpen) => {
  const hasAlertedRef = useRef(false);

  // Solicitar permissão assim que o App abrir
  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (isOpen && !hasAlertedRef.current) {
      // 1. Notificação Visual de Elite
      if (Notification.permission === "granted") {
        new Notification("O Sabor Inigualável já está na chapa. Sua fome não tem chance contra esse Valor Irresistível. Peça agora!", {
          icon: "/logo-iceberg.png", // Ajustado para a logo existente
          silent: false // Aqui o sistema tenta usar o som padrão do SO
        });
      }

      // 2. Gatilho Sonoro de Conversão (Som de "Dinheiro" ou "Notificação Clean")
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Silencia erro se o usuário ainda não clicou na tela (política de autoplay)
      });
      
      hasAlertedRef.current = true;
    } else if (!isOpen) {
        // Resetar o alerta para o próximo ciclo de abertura (dia seguinte ou reabertura)
        // Mas cuidado para não alertar repetidamente se o status oscilar.
        // Como o status muda baseado no horário, só vai mudar 1x por dia praticamente.
        hasAlertedRef.current = false;
    }
  }, [isOpen]);
};
