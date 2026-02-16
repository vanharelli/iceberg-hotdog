import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Carousel from './components/Carousel';
import SystemFooter from './components/SystemFooter';
import StatusBadge from './components/StatusBadge';
import ProductDetails from './components/ProductDetails';
import CartDrawer from './components/CartDrawer';
import FloatingCartButton from './components/FloatingCartButton';
import { menuData } from './data/menu';
import ReviewTicker from './components/ReviewTicker';
import { preloadImages } from './logic/PreloadEngine';

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

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {}, []);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [showExitToast, setShowExitToast] = useState(false);

  useEffect(() => {
    preloadImages(menuData);
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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
      });
    } else {
      alert("App já instalado ou não suportado neste navegador!");
    }
  };

  const handleProductClick = (item) => {
    setSelectedProduct(item);
  };

  const [showFinalizeHint, setShowFinalizeHint] = useState(false);
  const handleAddToCart = (cartItem, action) => {
    setCart(prev => [...prev, cartItem]);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setShowFinalizeHint(true);
    setTimeout(() => setShowFinalizeHint(false), 2500);
  };

  const handleRemoveItem = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  return (
    <div className="app-container">
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
      <div className="relative z-[70] flex flex-col min-h-screen">
        <Header 
          cartCount={cart.length} 
          onCartClick={() => setIsCartOpen(true)}
          onInstallClick={handleInstallClick}
        />
        <div className="fixed top-18 left-0 w-full z-[100]">
          <ReviewTicker />
        </div>

        <main className="flex-grow min-h-screen w-full pt-24 md:pt-28">
          {/* Hero Section */}
          <div className="w-full text-center space-y-4 mb-4">
              <div className="flex justify-center">
                <StatusBadge />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                  ICEBERG <br />
                  <span className="shimmer-hotdog">HOT DOG</span>
                </h1>
                <p className="text-gray-400 font-medium text-lg tracking-wide drop-shadow-md">
                    O Sabor que Afunda sua Fome.
                </p>
              </div>
          </div>

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
      <AnimatePresence>
        {cart.length > 0 && !isCartOpen && showFinalizeHint && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-24 right-6 z-[100] bg-black/80 text-white px-4 py-2 rounded-xl shadow-lg border border-white/10 text-sm font-semibold backdrop-blur-md pointer-events-none"
          >
            Finalizar seu pedido!
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
