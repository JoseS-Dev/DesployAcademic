import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bcvAPI } from '../services/bcvAPI';

export default function Suscripcion() {
  const { usuarioActual } = useAuth();
  const [planActual, setPlanActual] = useState(usuarioActual?.plan || 'gratuito');
  const [tasaBCV, setTasaBCV] = useState(null);
  const [precioBS, setPrecioBS] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener tasa del BCV (en producción esto vendría de una API)
    obtenerTasaBCV();
  }, []);

  const obtenerTasaBCV = async () => {
    try {
      setLoading(true);
      // Usar la API real del BCV
      const tasaData = await bcvAPI.obtenerTasaBCV();
      setTasaBCV(tasaData.tasa);
      const precioEnBs = await bcvAPI.convertirUSDaVES(6);
      setPrecioBS(precioEnBs);
    } catch (error) {
      console.error('Error al obtener tasa BCV:', error);
      // Tasa por defecto en caso de error
      setTasaBCV(36.5);
      setPrecioBS((6 * 36.5).toFixed(2));
    } finally {
      setLoading(false);
    }
  };

  const planes = [
    {
      id: 'gratuito',
      nombre: 'Gratuito',
      precio: '0',
      precioBS: '0',
      periodo: 'por siempre',
      caracteristicas: [
        'Acceso limitado a 2 cursos básicos',
        'Sin certificados',
        'Sin descarga de materiales',
        'Soporte por correo (respuesta en 48h)',
        'Sin acceso a proyectos prácticos',
        'Contenido de introducción únicamente'
      ],
      limitaciones: [
        'Solo 2 cursos disponibles',
        'Sin acceso a contenido profesional',
        'Sin certificados de finalización'
      ],
      destacado: false
    },
    {
      id: 'profesional',
      nombre: 'Profesional',
      precio: '6',
      precioBS: precioBS || '364.63',
      periodo: 'pago único',
      caracteristicas: [
        'Acceso ilimitado a todos los cursos',
        'Certificados de finalización',
        'Descarga de materiales y recursos',
        'Soporte prioritario 24/7',
        'Acceso a proyectos prácticos',
        'Nuevos cursos cada mes',
        'Acceso anticipado a contenido exclusivo',
        'Comunidad profesional de estudiantes'
      ],
      destacado: true
    }
  ];

  const handleSeleccionarPlan = (planId) => {
    if (planId === 'gratuito') {
      // Lógica para activar plan gratuito
      setPlanActual('gratuito');
      alert('Plan gratuito activado');
    } else {
      // Redirigir a la pasarela de pago
      navigate('/checkout', { state: { plan: 'profesional', precio: 6, precioBS: precioBS } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Elige tu Plan
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Desbloquea todo el potencial de nuestra plataforma con un pago único.
          </p>
          {tasaBCV && (
            <p className="mt-2 text-sm text-gray-600">
              Tasa BCV: {tasaBCV} Bs/USD | Precio Profesional: ${planes[1].precio} USD ({planes[1].precioBS} Bs)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {planes.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden relative ${
                plan.destacado ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.destacado && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                  MÁS POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.nombre}</h3>
                <div className="mt-4 flex items-baseline">
                  {plan.id === 'profesional' ? (
                    <>
                      <span className="text-4xl font-extrabold text-gray-900">
                        ${plan.precio}
                      </span>
                      <span className="ml-2 text-lg font-medium text-gray-500">
                        USD
                      </span>
                      <div className="ml-4 text-sm text-gray-600">
                        <div className="font-semibold">{plan.precioBS} Bs</div>
                        <div className="text-xs">(Tasa BCV)</div>
                      </div>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-gray-900">
                      Gratis
                    </span>
                  )}
                </div>
                {plan.id === 'profesional' && (
                  <p className="text-sm text-gray-600 mt-2">
                    Pago único - Acceso de por vida
                  </p>
                )}
                
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Incluye:</h4>
                  <ul className="space-y-2">
                    {plan.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitaciones && plan.limitaciones.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-red-600 mb-2">Limitaciones:</h4>
                    <ul className="space-y-1">
                      {plan.limitaciones.map((limitacion, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-xs text-gray-600">{limitacion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8">
                  {planActual === plan.id ? (
                    <button
                      disabled
                      className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
                    >
                      Plan Actual
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSeleccionarPlan(plan.id)}
                      className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition ${
                        plan.id === 'gratuito' 
                          ? 'bg-gray-600 hover:bg-gray-700' 
                          : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
                      }`}
                    >
                      {plan.id === 'gratuito' ? 'Seleccionar Plan Gratuito' : 'Suscribirse Ahora'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg max-w-4xl mx-auto">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Preguntas frecuentes</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {[
                {
                  pregunta: '¿El pago es mensual o único?',
                  respuesta: 'El plan Profesional es un pago único de $6 USD. Una vez pagado, tendrás acceso de por vida a todos los cursos y contenido profesional.'
                },
                {
                  pregunta: '¿Ofrecen reembolsos?',
                  respuesta: 'Sí, ofrecemos un reembolso completo si cancelas dentro de los primeros 7 días.'
                },
                {
                  pregunta: '¿Qué incluye el pago único?',
                  respuesta: 'El pago único de $6 USD te da acceso de por vida a todos los cursos, certificados, materiales descargables, soporte prioritario y futuros contenidos que agreguemos a la plataforma.'
                },
                {
                  pregunta: '¿Cómo funciona el pago en Venezuela?',
                  respuesta: 'Aceptamos múltiples métodos de pago: Pagomovil (a tasa BCV), PayPal, Binance y Zelle. El precio se calcula según la tasa oficial del BCV.'
                }
              ].map((faq, index) => (
                <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-12 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{faq.pregunta}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-10">
                    {faq.respuesta}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
