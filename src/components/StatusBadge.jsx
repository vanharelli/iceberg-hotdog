import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreAlert } from '../logic/StoreMonitor';

export default function StatusBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHours, setShowHours] = useState(false);

  // Integração do sistema de alerta
  useStoreAlert(isOpen);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const day = now.getDay();
      const mappedDayIndex = day === 0 ? 6 : day - 1;
      if (mappedDayIndex === 0) {
        setIsOpen(false);
        return;
      }
      
      const isEvening = (hours === 18 && minutes >= 30) || (hours > 18);
      const isEarlyMorning = hours < 1; 
      
      setIsOpen(isEvening || isEarlyMorning);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const hoursData = [
    { day: 'segunda-feira', time: 'Fechado' },
    { day: 'terça-feira', time: '18:30–01:00' },
    { day: 'quarta-feira', time: '18:30–00:30' },
    { day: 'quinta-feira', time: '18:30–01:00' },
    { day: 'sexta-feira', time: '18:30–01:00' },
    { day: 'sábado', time: '18:30–00:30' },
    { day: 'domingo', time: '18:30–01:00' },
  ];

  const todayIndex = new Date().getDay(); // 0 = Domingo, 1 = Segunda...
  // Ajuste para mapear getDay() (0=Dom) para o array (0=Segunda)
  // Array: 0=Seg, 1=Ter, 2=Qua, 3=Qui, 4=Sex, 5=Sab, 6=Dom
  // getDay: 0=Dom -> 6, 1=Seg -> 0
  const currentDayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  return (
    <div className="relative flex flex-col items-center mt-8">
        <button 
            onClick={() => setShowHours(!showHours)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer bg-iceberg/20 text-iceberg hover:bg-iceberg/30 ${
              isOpen
                ? 'border-green-500/70'
                : 'border-red-500/60'
            }`}
        >
            <Clock size={16} />
            <span className="font-bold tracking-wider text-sm">
                HORÁRIOS
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showHours ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
            {showHours && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 10, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-80 z-[10] bg-[#001529]/60 backdrop-blur-2xl border border-[#0077FF]/40 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-4 space-y-3 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="flex items-center justify-between border-b border-[#0077FF]/30 pb-2 mb-2">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Clock size={16} className="text-iceberg" />
                                Horário de Funcionamento
                            </h3>
                        </div>
                        
                        <div className="space-y-3">
                            {hoursData.map((item, index) => {
                                const isToday = index === currentDayIndex;
                                return (
                                    <div 
                                        key={item.day} 
                                        className={`flex flex-col text-sm ${isToday ? 'bg-white/5 -mx-2 px-2 py-1 rounded-lg' : ''}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className={`capitalize ${isToday ? 'text-iceberg font-bold' : 'text-gray-400'}`}>
                                                {item.day}
                                            </span>
                                            <span className={`${
                                                item.time === 'Fechado' ? 'text-red-400' : 'text-gray-200'
                                            } ${isToday ? 'font-bold' : ''}`}>
                                                {item.time}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
