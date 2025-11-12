import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Suscripcion() {
  const { usuarioActual, checkSubscription } = useAuth();
  const [planActual, setPlanActual] = useState(usuarioActual?.plan || 'gratuito');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        const status = await checkSubscription();
        setSubscriptionStatus(status);
      } catch (error) {
        console.error('Error verificando suscripción:', error);
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [checkSubscription]);

  const planes = [
    {
      id: 'gratuito',
      nombre: 'Gratuito',
      precio: '0',
      periodo: 'por siempre',
      caracteristicas: [
        'Acceso a cursos básicos',
        'Contenido de introducción',
        'Soporte por correo electrónico',
        'Acceso limitado a recursos'
      ],
      destacado: false
    },
    {
      id: 'profesional',
      nombre: 'Profesional',
      precio: '9.99',
      periodo: 'por mes',
      caracteristicas: [
        'Acceso a todos los cursos',
        'Certificados de finalización',
        'Soporte prioritario',
        'Acceso a proyectos prácticos',
        'Recursos descargables'
      ],
      destacado: true
    },
    {
      id: 'empresarial',
      nombre: 'Empresarial',
      precio: '29.99',
      periodo: 'por mes',
      caracteristicas: [
        'Todas las características del plan Profesional',
        'Acceso para equipos (hasta 5 usuarios)',
        'Soporte 24/7',
        'Sesiones de mentoría',
        'Acceso anticipado a nuevos cursos'
      ],
      destacado: false
    }
  ];

  const handleSeleccionarPlan = async (planId) => {
    // Aquí iría la lógica para procesar el pago
    console.log('Seleccionado plan:', planId);
    // Simulación de éxito después de 1.5 segundos
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPlanActual(planId);
    // Recargar la página para actualizar el estado de autenticación
    window.location.reload();
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
            Elige el mejor plan para ti
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Desbloquea todo el potencial de nuestra plataforma con una suscripción.
          </p>
        </div>

        {subscriptionStatus && !subscriptionStatus.isActive && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Tu suscripción actual ha caducado o no está activa. Por favor, actualiza tu plan para continuar disfrutando de todos los beneficios.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {planes.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                plan.destacado ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.destacado && (
                <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">
                  MÁS POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{plan.nombre}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.precio}
                  </span>
                  <span className="ml-1 text-lg font-medium text-gray-500">
                    /{plan.periodo}
                  </span>
                </div>
                
                <ul className="mt-6 space-y-4">
                  {plan.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3 text-gray-700">{caracteristica}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {planActual === plan.id ? (
                    <button
                      disabled
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
                    >
                      Plan Actual
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSeleccionarPlan(plan.id)}
                      className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        plan.id === 'gratuito' 
                          ? 'bg-gray-600 hover:bg-gray-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {plan.id === 'gratuito' ? 'Seleccionar' : 'Suscribirse'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Preguntas frecuentes</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {[
                {
                  pregunta: '¿Puedo cambiar de plan más tarde?',
                  respuesta: 'Sí, puedes cambiar de plan en cualquier momento. El cambio se reflejará en tu próxima factura.'
                },
                {
                  pregunta: '¿Ofrecen reembolsos?',
                  respuesta: 'Sí, ofrecemos un reembolso completo si cancelas dentro de los primeros 30 días.'
                },
                {
                  pregunta: '¿Puedo cancelar en cualquier momento?',
                  respuesta: 'Sí, puedes cancelar tu suscripción en cualquier momento sin cargos adicionales.'
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
