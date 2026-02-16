import { useEffect, useRef } from 'react';

export const useStoreAlert = (isOpen) => {
  const hasAlertedRef = useRef(false);

  useEffect(() => {
    try {
      if (typeof Notification !== "undefined") {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      if (isOpen && !hasAlertedRef.current) {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            new Notification("O Sabor Inigualável já está na chapa. Sua fome não tem chance contra esse Valor Irresistível. Peça agora!", {
              icon: "/logo-iceberg.png",
              silent: false
            });
          } catch (_) {}
        }

        if (typeof Audio !== "undefined") {
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
            audio.volume = 0.5;
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.then === "function") {
              playPromise.catch(() => {});
            }
          } catch (_) {}
        }
        
        hasAlertedRef.current = true;
      } else if (!isOpen) {
        hasAlertedRef.current = false;
      }
    } catch (_) {}
  }, [isOpen]);
};
