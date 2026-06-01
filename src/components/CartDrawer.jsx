import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, ChevronUp, ChevronDown, ChevronLeft } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, onRemoveItem, variant = 'drawer' }) {
  const phoneNumber = "5561992864160";
  const [step, setStep] = useState('review');
  const [orderType, setOrderType] = useState('pickup'); // 'delivery' or 'pickup'
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [changeFor, setChangeFor] = useState('');
  const [isDeliveryDetailsVisible, setIsDeliveryDetailsVisible] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const totalPrice = cart.reduce((total, item) => total + item.finalPrice, 0);

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  useEffect(() => {
    if (orderType !== 'delivery') {
      setDeliveryLocation(null);
    }
  }, [orderType]);

  const openWhatsappWithText = (text) => {
    const encodedMessage = encodeURIComponent(text);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    const newTab = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newTab) window.location.href = url;
  };

  useEffect(() => {
    if (orderType !== 'delivery') return;
    if (!cep || cep.length !== 8) return;

    const controller = new AbortController();

    fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || data.erro) return;
        setStreet((data.logradouro || '').trim());
        setNeighborhood((data.bairro || '').trim());
        setCity((data.localidade || '').trim());
        setStateUf((data.uf || '').trim());
      })
      .catch(() => {});

    return () => controller.abort();
  }, [cep, orderType]);

  const handleGetLocation = () => {
    if (typeof window === 'undefined') return;
    if (!navigator.geolocation) {
      alert('Seu dispositivo/navegador não suporta compartilhamento de localização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords || {};
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          alert('Não foi possível obter a localização.');
          return;
        }
        const nextLocation = {
          lat: latitude,
          lng: longitude,
          accuracy: typeof accuracy === 'number' ? accuracy : null,
          timestamp: Date.now()
        };
        setDeliveryLocation(nextLocation);

        const locationLink = `https://www.google.com/maps?q=${nextLocation.lat},${nextLocation.lng}`;
        let locationMessage = `📌 *LOCALIZAÇÃO DO CLIENTE*\n`;
        locationMessage += `Lat: ${nextLocation.lat}\n`;
        locationMessage += `Lng: ${nextLocation.lng}\n`;
        locationMessage += `Mapa: ${locationLink}\n`;
        if (nextLocation.accuracy) {
          locationMessage += `Precisão aprox.: ${Math.round(nextLocation.accuracy)}m\n`;
        }
        openWhatsappWithText(locationMessage);
      },
      () => {
        alert('Não foi possível obter a localização. Verifique as permissões do navegador.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleCheckout = () => {
    // Formatação da mensagem para WhatsApp com emojis em cascata
    let message = "🧾 *PEDIDO – ICEBERG HOT DOG*\n";
    if (!fullName || fullName.trim() === '') {
      alert("Informe o Nome completo antes de finalizar o pedido.");
      return;
    }
    message += `👤 Nome: ${fullName.trim()}\n`;
    message += `\n`;

    if (orderType === 'delivery') {
      const requiredFilled =
        (fullName && fullName.trim() !== '') &&
        (whatsapp && whatsapp.trim() !== '') &&
        (cep && cep.trim() !== '') &&
        (street && street.trim() !== '') &&
        (number && number.trim() !== '') &&
        (neighborhood && neighborhood.trim() !== '') &&
        (stateUf && stateUf.trim() !== '') &&
        (paymentMethod && paymentMethod !== '');
      if (!requiredFilled) {
        alert("Para entrega, preencha Nome completo, WhatsApp, CEP, Rua, Número, Bairro, UF e Forma de Pagamento.");
        return;
      }
    }

    cart.forEach((item, index) => {
      const emoji = item.id && item.id.startsWith('burg-') ? '🍔' : '🌭';
      const productName = (item.originalName || item.name || '').trim();
      const addons = Array.isArray(item.selectedAddons) ? item.selectedAddons.filter(Boolean) : [];

      message += `${emoji} ${index + 1}) ${productName}\n`;

      if (addons.length > 0) {
        message += `Adicionais👇\n`;
        addons.forEach((addon) => {
          const qty = Number.isFinite(addon.quantity) ? addon.quantity : 1;
          message += `+ ${qty}x ${addon.name}\n`;
        });
      }

      message += `💵 Valor: ${formatPrice(item.finalPrice)}\n\n`;
    });

    message += `🧮 *TOTAL:* ${formatPrice(totalPrice)}\n`;
    message += `———————————————\n`;

    if (orderType === 'delivery') {
      const addressLine = [
        street && street.trim() ? street.trim() : '',
        number && number.trim() ? `Nº ${number.trim()}` : '',
        neighborhood && neighborhood.trim() ? neighborhood.trim() : '',
        city && city.trim() ? city.trim() : '',
        stateUf && stateUf.trim() ? stateUf.trim() : ''
      ]
        .filter(Boolean)
        .join(', ');

      const locationLink =
        deliveryLocation && typeof deliveryLocation.lat === 'number' && typeof deliveryLocation.lng === 'number'
          ? `https://www.google.com/maps?q=${deliveryLocation.lat},${deliveryLocation.lng}`
          : '';

      message += `🚚 *ENTREGA*\n`;
      message += `  👤 Nome: ${fullName || 'Não informado'}\n`;
      message += `  📞 WhatsApp: ${whatsapp || 'Não informado'}\n`;
      message += `  📍 Endereço: ${addressLine || 'Não informado'}\n`;
      message += `  🏷️ CEP: ${cep || 'Não informado'}\n`;
      if (locationLink) {
        message += `  📌 Localização: ${locationLink}\n`;
        if (deliveryLocation.accuracy) {
          message += `  🎯 Precisão aprox.: ${Math.round(deliveryLocation.accuracy)}m\n`;
        }
      }
      if (deliveryNotes) {
        message += `  📝 Observações: ${deliveryNotes}\n`;
      }

      const paymentLabel = {
        card: '💳 Cartão',
        pix: '🔹 Pix',
        cash: '💵 Dinheiro'
      }[paymentMethod] || 'Não informado';

      message += `  💳 Pagamento: ${paymentLabel}\n`;

      if (paymentMethod === 'cash' && changeFor) {
        message += `  💸 Troco para: ${changeFor}\n`;
      }
    } else {
      message += `🏠 *RETIRADA NO LOCAL*\n`;
      const paymentLabel = {
        card: '💳 Cartão',
        pix: '🔹 Pix',
        cash: '💵 Dinheiro'
      }[paymentMethod] || 'Não informado';
      message += `  💳 Pagamento: ${paymentLabel}\n`;
    }

    message += `———————————————\n`;
    message += '✅ Aguarde a confirmação e obrigado pelo preferência!';

    openWhatsappWithText(message);
  };

  if (!isOpen) return null;

  const isScreen = variant === 'screen';
  const hasItems = cart.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[120] flex ${
        isScreen ? 'justify-center' : 'justify-end'
      } ${isScreen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      <motion.div
        initial={isScreen ? { opacity: 0, y: 18 } : { x: '100%' }}
        animate={isScreen ? { opacity: 1, y: 0 } : { x: 0 }}
        exit={isScreen ? { opacity: 0, y: 18 } : { x: '100%' }}
        transition={isScreen ? { duration: 0.22, ease: 'easeOut' } : { type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative w-full ${
          isScreen ? 'max-w-2xl' : 'max-w-md'
        } h-full bg-[#001529]/95 backdrop-blur-xl flex flex-col pointer-events-auto shadow-2xl ${
          isScreen ? 'border border-white/10' : 'border-l border-white/10'
        }`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                onClick={() => setStep('review')}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Voltar"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <ShoppingBag className="text-iceberg" />
            <h2 className="text-xl font-bold text-white">
              {step === 'review' ? 'Revisar Pedido' : 'Finalizar Pedido'}
            </h2>
            {step === 'review' && (
              <span className="bg-iceberg/20 text-iceberg text-xs font-bold px-2 py-0.5 rounded-full border border-iceberg/30">
                {cart.length} itens
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {step === 'review' ? (
            cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <ShoppingBag size={64} className="text-gray-500" />
                <p className="text-gray-400 font-medium">Seu carrinho está vazio.</p>
                <button onClick={onClose} className="text-iceberg font-bold hover:underline">
                  Voltar ao cardápio
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <motion.div
                  key={item.cartId || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-black/20">
                    <img src={item.img} alt={item.originalName} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">{item.name}</h3>
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          Com: {item.selectedAddons.map(a => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-iceberg font-bold">{formatPrice(item.finalPrice)}</span>
                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-bold uppercase">Identificação</p>
                <input
                  type="text"
                  placeholder="Nome completo (obrigatório)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  name="name"
                  autoComplete="shipping name"
                  autoCapitalize="words"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors"
                />
              </div>

              <div className="pb-4 border-b border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setOrderType('delivery');
                      setIsDeliveryDetailsVisible(true);
                    }}
                    className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                      orderType === 'delivery'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    Entrega
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                      orderType === 'pickup'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    Retirada
                  </button>
                </div>

                {orderType === 'delivery' && (
                  <div className="space-y-3">
                    {isDeliveryDetailsVisible ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 overflow-hidden"
                      >
                        <input
                          type="tel"
                          placeholder="Seu WhatsApp – facilitar contato com o motoboy"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          name="tel"
                          inputMode="tel"
                          autoComplete="shipping tel"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="CEP"
                            value={cep}
                            onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                            name="postal-code"
                            inputMode="numeric"
                            autoComplete="shipping postal-code"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="UF"
                            value={stateUf}
                            onChange={(e) => setStateUf(e.target.value.toUpperCase().slice(0, 2))}
                            name="address-level1"
                            autoComplete="shipping address-level1"
                            autoCapitalize="characters"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Rua / Avenida"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          name="address-line1"
                          autoComplete="shipping address-line1"
                          autoCapitalize="words"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Número"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            inputMode="numeric"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors"
                          />
                          <button
                            type="button"
                            onClick={handleGetLocation}
                            className={`w-full border rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                              deliveryLocation
                                ? 'bg-iceberg/20 text-iceberg border-iceberg/30'
                                : 'bg-white/5 text-white border-white/10 hover:border-white/30'
                            }`}
                          >
                            {deliveryLocation ? 'Localização enviada' : 'Enviar minha localização'}
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Bairro"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          autoCapitalize="words"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors"
                        />
                        <textarea
                          placeholder="Observações (Ex: Nome do condomínio, Ponto de referência, Interfone)"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          rows="2"
                          className="no-scrollbar w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors resize-none overflow-y-auto"
                        />

                        <button
                          onClick={() => setIsDeliveryDetailsVisible(false)}
                          className="w-full flex justify-center py-1 text-gray-500 hover:text-white transition-colors"
                          title="Minimizar opções de entrega"
                        >
                          <ChevronUp size={20} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                        <button
                          onClick={() => setIsDeliveryDetailsVisible(true)}
                          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-iceberg transition-colors py-2"
                        >
                          <span>Mostrar detalhes da entrega</span>
                          <ChevronDown size={16} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">Forma de Pagamento</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['card', 'pix', 'cash'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`px-2 py-2 rounded-lg text-xs font-bold transition-all border ${
                          paymentMethod === method
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {{ 'card': 'Cartão', 'pix': 'Pix', 'cash': 'Dinheiro' }[method]}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <input
                      type="text"
                      placeholder="Troco para quanto?"
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-iceberg transition-colors"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        {hasItems && (
          <div
            className="p-6 bg-[#000F1F] border-t border-white/10 space-y-4"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
          >
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl font-black text-white">{formatPrice(totalPrice)}</span>
            </div>

            {step === 'review' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-4 bg-[#0077FF] hover:bg-[#0066CC] text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,119,255,0.4)] hover:shadow-[0_0_30px_rgba(0,119,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>CONTINUAR</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-[#0077FF] hover:bg-[#0066CC] text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,119,255,0.4)] hover:shadow-[0_0_30px_rgba(0,119,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>FINALIZAR PEDIDO</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
