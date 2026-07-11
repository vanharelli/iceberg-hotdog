import { useEffect, useRef } from 'react';

// Notifica (com som) quando a loja está aberta no horário programado.
// Só dispara no app instalado (PWA em modo standalone), como pedido.

const isStandalone = () => {
  try {
    return (
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true
    );
  } catch (_) {
    return false;
  }
};

const localDateKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// --- Áudio: chime sintetizado via Web Audio (sem arquivo externo) ---
let audioCtx = null;
const ensureAudio = () => {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (_) {}
};

const playChime = () => {
  try {
    ensureAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    // Duas notas ascendentes (A5 -> D6), estilo "ding-dong"
    [
      [880, 0],
      [1174.66, 0.16],
    ].forEach(([freq, t]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + t);
      gain.gain.exponentialRampToValueAtTime(0.35, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.5);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.55);
    });
  } catch (_) {}
};

// Destrava o áudio no primeiro gesto do usuário (política de autoplay)
let audioUnlockBound = false;
const bindAudioUnlock = () => {
  if (audioUnlockBound) return;
  audioUnlockBound = true;
  const unlock = () => ensureAudio();
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
};

const showStoreOpenNotification = () => {
  const title = 'Iceberg Hot Dog está aberto 🌭';
  const options = {
    body: 'Estamos na chapa agora. Faça seu pedido!',
    icon: '/logo-iceberg.png',
    badge: '/favicon.png',
    tag: 'iceberg-aberto',
    renotify: true,
  };
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready
        .then((reg) => reg.showNotification(title, options))
        .catch(() => {
          try {
            new Notification(title, options);
          } catch (_) {}
        });
    } else {
      new Notification(title, options);
    }
  } catch (_) {}
};

export const useStoreAlert = (isOpen) => {
  const notifiedRef = useRef(false);

  useEffect(() => {
    bindAudioUnlock();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      notifiedRef.current = false;
      return;
    }
    if (notifiedRef.current) return;
    // Apenas no app instalado (PWA)
    if (!isStandalone()) return;
    if (typeof Notification === 'undefined') return;

    const today = localDateKey();
    try {
      if (localStorage.getItem('iceberg:openNotified') === today) {
        notifiedRef.current = true;
        return;
      }
    } catch (_) {}

    const fire = () => {
      if (notifiedRef.current) return;
      if (Notification.permission !== 'granted') return;
      showStoreOpenNotification();
      playChime();
      try {
        localStorage.setItem('iceberg:openNotified', today);
      } catch (_) {}
      notifiedRef.current = true;
    };

    if (Notification.permission === 'granted') {
      fire();
      return;
    }

    if (Notification.permission === 'default') {
      // Navegadores exigem gesto do usuário para pedir permissão
      const onGesture = () => {
        ensureAudio();
        window.removeEventListener('pointerdown', onGesture);
        window.removeEventListener('keydown', onGesture);
        window.removeEventListener('touchstart', onGesture);
        Notification.requestPermission()
          .then((perm) => {
            if (perm === 'granted' && isOpen) fire();
          })
          .catch(() => {});
      };
      window.addEventListener('pointerdown', onGesture, { passive: true });
      window.addEventListener('keydown', onGesture, { passive: true });
      window.addEventListener('touchstart', onGesture, { passive: true });
      return () => {
        window.removeEventListener('pointerdown', onGesture);
        window.removeEventListener('keydown', onGesture);
        window.removeEventListener('touchstart', onGesture);
      };
    }
  }, [isOpen]);
};
