import { useState, useEffect } from 'react';

const PromoBar = ({ onSignupClick }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 15,
    minutes: 12,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-500 to-cyan-500 py-3 px-5 sticky top-0 z-50 shadow-md animate-slide-in">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 flex-wrap">
        <div className="flex-1">
          <span className="text-white font-bold text-sm">🎉 Aprovecha el precio especial</span>
        </div>
        <div className="flex items-center gap-4 text-white text-sm flex-wrap justify-center">
          <span className="line-through opacity-80">Antes $349</span>
          <span className="bg-orange-600 text-white px-2 py-1 rounded font-bold">Ahorra $40</span>
          <span className="font-bold text-lg">$309</span>
          <span className="text-xs opacity-90">Paga a 4 cuotas sin intereses</span>
        </div>
        <button
          className="bg-blue-700 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg"
          onClick={onSignupClick}
        >
          Suscribirse
        </button>
      </div>
      <div className="text-center text-white text-xs mt-2 opacity-90">
        El precio especial termina en:{' '}
        <span className="font-bold">
          {timeLeft.days} días {timeLeft.hours} hrs {timeLeft.minutes} min {timeLeft.seconds} seg
        </span>
      </div>
    </div>
  );
};

export default PromoBar;

