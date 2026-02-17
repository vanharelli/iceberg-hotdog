import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ChevronLeft } from 'lucide-react';
import { addonsData } from '../data/addons';

export default function ProductDetails({ product, onClose, onAddToCart }) {
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [productQty, setProductQty] = useState(1);

  const isBeverageCollection = product?.type === 'beverage_collection' || (product?.beverages && Array.isArray(product.beverages));

  // Helper to parse price string to number
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return priceStr;
    // Remove 'A partir de ' and currency symbols
    return parseFloat(priceStr.toString().replace('A partir de ', '').replace('R$', '').replace('.', '').replace(',', '.').trim());
  };

  const formatPrice = (priceNum) => {
    return priceNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  useEffect(() => {
    if (product) {
      if (isBeverageCollection) {
        const beveragesTotal = Object.entries(quantities).reduce((total, [id, qty]) => {
          const beverage = product.beverages.find(b => b.id === id);
          return total + (beverage ? beverage.price * qty : 0);
        }, 0);
        setTotalPrice(beveragesTotal);
      } else {
        const basePrice = parsePrice(product.price);
        const addonsTotal = Object.entries(quantities).reduce((total, [id, qty]) => {
          const addon = addonsData.find(a => a.id === id);
          return total + (addon ? addon.price * qty : 0);
        }, 0);
        setTotalPrice((basePrice * productQty) + addonsTotal);
      }
    }
  }, [product, quantities, isBeverageCollection, productQty]);

  const updateQuantity = (itemId, delta) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0;
      const newQty = Math.max(0, current + delta);
      return { ...prev, [itemId]: newQty };
    });
  };

  const handleAction = (actionType) => {
    // Prevent adding empty orders for beverages
    if (isBeverageCollection && totalPrice === 0 && actionType === 'checkout') {
      return;
    }

    let finalItem;

    if (isBeverageCollection) {
        const selectedBeverages = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => {
                const beverage = product.beverages.find(b => b.id === id);
                return { ...beverage, quantity: qty };
            });

        const description = selectedBeverages.map(b => `${b.quantity}x ${b.name}`).join(', ');
        
        // Se nada selecionado mas clicou em "pedir mais", apenas fecha (comportamento padrao pode variar, mas aqui vamos assumir que ele quer sair)
        if (selectedBeverages.length === 0) {
             onClose();
             return;
        }

        finalItem = {
            ...product,
            name: "Bebidas Variadas", 
            description: description || "Seleção de bebidas",
            originalName: product.name,
            selectedAddons: selectedBeverages,
            finalPrice: totalPrice,
            cartId: `${product.id}-${Date.now()}`
        };
    } else {
        const selectedAddonsList = Object.entries(quantities)
          .filter(([_, qty]) => qty > 0)
          .map(([id, qty]) => {
            const addon = addonsData.find(a => a.id === id);
            return { ...addon, quantity: qty };
          });
    
        // Concatenate names
        const addonNames = selectedAddonsList.map(a => `${a.quantity > 1 ? `${a.quantity}x ` : ''}${a.name}`).join(' + ');
        const baseName = productQty > 1 ? `${productQty}x ${product.name}` : product.name;
        const finalName = addonNames ? `${baseName} + ${addonNames}` : baseName;
        
        finalItem = {
            ...product,
            name: finalName,
            originalName: product.name,
            selectedAddons: selectedAddonsList,
            quantity: productQty,
            finalPrice: totalPrice,
            cartId: `${product.id}-${Date.now()}`
        };
    }

    if (actionType === 'checkout') {
      setIsAdding(true);
      setTimeout(() => {
        onAddToCart(finalItem, actionType);
        setIsAdding(false);
      }, 1000);
    } else {
      onAddToCart(finalItem, actionType);
    }
  };

  if (!product) return null;

  // Determine items to render
  const itemsList = isBeverageCollection ? product.beverages : addonsData;
  const sectionTitle = isBeverageCollection ? "ESCOLHA SUAS BEBIDAS" : "TURBINE SEU ICEBERG";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex flex-col bg-black/90 backdrop-blur-xl overflow-hidden"
    >
      {/* Header / Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto pb-48 no-scrollbar">
        {/* Product Image & Info */}
        <div className="relative w-full h-72 shrink-0">
            <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x300/1e293b/white?text=ICEBERG';
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001529] via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-6">
                <h2 className="text-3xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                    {product.name}
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed drop-shadow-md max-h-24 overflow-y-auto no-scrollbar">
                    {product.description}
                </p>
                <div className="mt-4 inline-block px-4 py-1 rounded-full bg-iceberg/20 border border-iceberg/50 text-iceberg font-bold text-lg">
                    {product.price}
                </div>
            </div>
        </div>

        {/* Add-ons / Options Section */}
        <div className="px-6 py-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-iceberg rounded-full" />
                <h3 className="text-xl font-bold text-white tracking-wider">{sectionTitle}</h3>
            </div>

            <div className="space-y-4">
                {itemsList.map((item) => {
                    const qty = quantities[item.id] || 0;
                    return (
                        <div 
                            key={item.id}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                                qty > 0 
                                ? 'bg-[#0077FF]/10 border-[#0077FF]/50 shadow-[0_0_15px_rgba(0,119,255,0.2)]' 
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="flex flex-col">
                                <span className={`font-medium ${qty > 0 ? 'text-white' : 'text-gray-300'}`}>
                                    {item.name}
                                </span>
                                <span className="text-sm text-iceberg font-bold">
                                    {isBeverageCollection ? formatPrice(item.price) : `+ ${formatPrice(item.price)}`}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                                        qty > 0 
                                        ? 'border-white/20 text-white hover:bg-white/10' 
                                        : 'border-white/10 text-gray-500 cursor-not-allowed'
                                    }`}
                                    disabled={qty === 0}
                                >
                                    <Minus size={16} />
                                </button>
                                
                                <span className={`w-6 text-center font-bold text-lg ${
                                    qty > 0 ? 'text-[#0077FF] drop-shadow-[0_0_8px_rgba(0,119,255,0.8)]' : 'text-gray-500'
                                }`}>
                                    {qty}
                                </span>

                                <button 
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0077FF] text-white shadow-lg shadow-blue-500/30 hover:bg-[#0066CC] active:scale-95 transition-all"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 w-full px-6 pt-4 pb-6 bg-gradient-to-t from-black via-black/95 to-transparent z-30" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}>
        <div className="max-w-md mx-auto w-full flex flex-col items-center gap-3">
            {!isBeverageCollection && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <button 
                  onClick={() => setProductQty(Math.max(1, productQty - 1))}
                  className="w-7 h-7 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                  disabled={productQty <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-6 text-center font-bold text-white">{productQty}</span>
                <button 
                  onClick={() => setProductQty(productQty + 1)}
                  className="w-7 h-7 rounded-full bg-[#0077FF] text-white flex items-center justify-center hover:bg-[#0066CC] active:scale-95 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
            <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('checkout')}
                disabled={(isBeverageCollection && totalPrice === 0) || isAdding}
                className={`w-full py-4 font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(0,119,255,0.4)] hover:shadow-[0_0_30px_rgba(0,119,255,0.6)] transition-all flex items-center justify-center gap-2 ${
                    (isBeverageCollection && totalPrice === 0) 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed shadow-none' 
                    : isAdding
                        ? 'bg-[#0077FF] hover:bg-[#0066CC] text-white'
                        : 'bg-[#0077FF] hover:bg-[#0066CC] text-white'
                }`}
            >
                {isAdding ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>ADICIONANDO...</span>
                    </>
                ) : (
                    <>
                        <span>ADICIONAR</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </>
                )}
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
