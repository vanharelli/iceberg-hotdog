import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Carousel from './components/Carousel';
import SystemFooter from './components/SystemFooter';
import ProductDetails from './components/ProductDetails';
import CartDrawer from './components/CartDrawer';
import FloatingCartButton from './components/FloatingCartButton';
import { menuData } from './data/menu';
import ReviewTicker from './components/ReviewTicker';
import Preloader from './components/Preloader';
import { preloadImages } from './logic/PreloadEngine';

// Preloader: exibido no máximo 1x a cada 24h. Usa localStorage, que zera
// automaticamente se o usuário limpar os dados/histórico do dispositivo.
const PRELOADER_STORAGE_KEY = 'iceberg:preloader:lastShown';
const PRELOADER_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

function shouldShowPreloader() {
  try {
    const last = window.localStorage.getItem(PRELOADER_STORAGE_KEY);
    if (!last) return true;
    const ts = parseInt(last, 10);
    if (!Number.isFinite(ts)) return true;
    return Date.now() - ts > PRELOADER_TTL_MS;
  } catch (_) {
    // Se o storage estiver indisponível, exibe normalmente
    return true;
  }
}

function markPreloaderShown() {
  try {
    window.localStorage.setItem(PRELOADER_STORAGE_KEY, Date.now().toString());
  } catch (_) {}
}

const PRIORITY_IMAGE_IDS = (() => {
  const ids = [];
  try {
    for (const category of menuData) {
      if (!Array.isArray(category.items)) continue;
      for (const item of category.items) {
        if (!item || !item.id) continue;
        ids.push(item.id);
        if (ids.length >= 4) {
          return ids;
        }
      }
    }
  } catch (_) {}
  return ids;
})();

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(() => !shouldShowPreloader());
  const visibilityReloadedRef = useRef(false);

  // Marca que o preloader foi exibido nesta janela de 24h (apenas na montagem)
  useEffect(() => {
    if (!loaded) {
      markPreloaderShown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {}, []);

  const [showExitToast, setShowExitToast] = useState(false);

  useEffect(() => {
    preloadImages(menuData);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      try {
        if (document.visibilityState === 'hidden') {
          visibilityReloadedRef.current = false;
          return;
        }

        if (document.visibilityState !== 'visible') {
          return;
        }

        let isStandalone = false;
        try {
          if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            isStandalone = true;
          } else if (window.navigator && window.navigator.standalone) {
            isStandalone = true;
          }
        } catch (_) {}

        if (!isStandalone || visibilityReloadedRef.current) {
          return;
        }

        visibilityReloadedRef.current = true;
        if (window.location.pathname !== '/') {
          window.location.replace('/');
        } else {
          window.location.reload();
        }
      } catch (_) {}
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // --- LÓGICA DO BOTÃO VOLTAR (PWA/MOBILE) ---
    
    // Cria um estado inicial no histórico para interceptar o primeiro 'voltar' (apenas uma vez)
    if (!window.__icebergHistoryInitialized) {
      window.history.pushState({ appState: 'root' }, '', window.location.pathname);
      window.__icebergHistoryInitialized = true;
    }

    const handlePopState = (event) => {
      // Se houver modais abertos, fecha-os e mantém no app
      if (selectedProduct || isCartOpen) {
        // Previne a saída real restaurando o estado
        window.history.pushState({ appState: 'root' }, '', window.location.pathname);
        
        if (selectedProduct) setSelectedProduct(null);
        if (isCartOpen) setIsCartOpen(false);
        return;
      }

      // Se estiver na raiz (sem modais)
      if (!showExitToast) {
        // Primeira tentativa: Mostra aviso e restaura estado
        setShowExitToast(true);
        window.history.pushState({ appState: 'root' }, '', window.location.pathname);
        
        // Remove aviso após 3 segundos
        setTimeout(() => setShowExitToast(false), 3000);
      } else {
        // Segunda tentativa com aviso visível: Permite sair
        // O navegador já removeu o estado atual com o 'back', então basta não fazer pushState
        // Ou forçar um back extra se necessário, mas geralmente não fazer nada já sai
        // Se quisermos garantir a saída para o histórico anterior (fora do app):
        window.history.back(); 
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedProduct, isCartOpen, showExitToast]);

  const handleProductClick = (item) => {
    setSelectedProduct(item);
  };

  const handleAddToCart = (cartItem, action) => {
    setCart(prev => [...prev, cartItem]);
    setSelectedProduct(null);
    setIsCartOpen(false);
  };

  const handleRemoveItem = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleAddItem = (cartItem) => {
    setCart(prev => [...prev, cartItem]);
  };

  return (
    <div className="app-container">
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <div className="min-h-screen bg-[#001529] relative overflow-x-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/background.png" 
          alt="Background" 
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-60 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/60 to-black/90" />
      </div>

      {/* Content Layer */}
      <div className="relative z-[40] flex flex-col min-h-screen">
        <Header 
          cartCount={cart.length} 
          onCartClick={() => setIsCartOpen(true)}
        />
        <div className="fixed top-18 left-0 w-full z-[80] review-ticker-wrapper">
          <ReviewTicker />
        </div>

        <main className="flex-grow min-h-screen w-full pt-32 md:pt-36">
          {/* Hero Section — animações de entrada só após o preloader terminar */}
          <motion.div
            className="w-full text-center space-y-4 mb-4"
            initial={{ opacity: 0, y: 28 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 16 }}
                animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              >
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
                  whileHover={{ scale: 1.12 }}
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.22 }}
              >
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter drop-shadow-2xl">
                  <span className="shimmer-hotdog">ICEBERG</span> <br />
                  <span className="shimmer-hotdog">HOT DOG</span>
                </h1>
                <p className="text-gray-400 font-medium text-lg tracking-wide drop-shadow-md">
                    O sabor artesanal que afunda a sua fome.
                </p>
              </motion.div>
          </motion.div>

          {/* Categorias Dinâmicas */}
          {menuData.map((category) => (
             <Carousel 
                key={category.category} 
                title={category.category} 
                items={category.items} 
                onProductClick={handleProductClick}
                priorityImageIds={PRIORITY_IMAGE_IDS}
             />
          ))}
        </main>

        <SystemFooter />
      </div>

      {/* Modals */}
      <FloatingCartButton 
        cartCount={cart.length} 
        onClick={() => setIsCartOpen(true)} 
      />

      <AnimatePresence>
        {selectedProduct && (
            <ProductDetails 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddItem}
            variant="screen"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showExitToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-black/90 text-white px-6 py-3 rounded-full shadow-lg border border-white/20 text-sm font-medium whitespace-nowrap backdrop-blur-md pointer-events-none"
          >
            Clique novamente para sair
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
