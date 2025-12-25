import { useNavigate } from 'react-router-dom';
import { planes } from '../../../utils/mocks/plans.mock';

const Pricing = ({ onSignupClick, usuarioActual } : { onSignupClick: () => void, usuarioActual: any }) => {
  const navigate = useNavigate();

  const elegirPlan = (planId: string) => {
    if (!usuarioActual) {
      onSignupClick();
    } else {
      if (planId === 'gratuito') {
        // Activar plan gratuito
        navigate('/suscripcion');
      } else {
        // Ir a checkout para plan profesional
        navigate('/checkout', { state: { plan: 'profesional', precio: 6 } });
      }
    }
  };

  return (
    <section id="pricing" className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 px-5 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Planes</span>
          <h2 className="text-5xl font-black mt-4 mb-4 text-gray-900">Elige tu Plan Perfecto</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Acceso ilimitado a todos los cursos con un pago único de por vida
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {planes.map((plan, idx) => (
            <div
              key={idx}
              className={`border-2 rounded-2xl p-8 transition-all duration-300 relative ${
                plan.highlighted
                  ? 'border-blue-600 shadow-2xl scale-105 bg-white'
                  : 'border-gray-200 hover:border-blue-600 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-blue-50/20 to-transparent'
              } shadow-md animate-fade-in-up`}
            >
              {plan.highlighted && plan.badge && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  ✨ {plan.badge}
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.nombre}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.descripcion}</p>
                <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {plan.precio}
                </div>
                {plan.periodo && <div className="text-gray-600 text-sm mb-6">{plan.periodo}</div>}
                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-6 transition ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-105'
                  }`}
                  onClick={() => elegirPlan(plan.id)}
                >
                  {plan.id === 'gratuito' ? 'Comenzar Gratis' : 'Comprar Ahora'}
                </button>
                <div className="text-left space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
