import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pagosAPI } from '../services/api';
import { bcvAPI } from '../services/bcvAPI';
import { paypalService } from '../services/paypalService';
import { binanceService } from '../services/binanceService';
import { zelleService } from '../services/zelleService';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function Checkout() {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || 'profesional';
  const precioUSD = location.state?.precio || 6;
  const precioBS = location.state?.precioBS || '364.63';

  const [metodoPago, setMetodoPago] = useState('');
  const [tasaBCV, setTasaBCV] = useState(null);
  const [datosPago, setDatosPago] = useState({
    // Pagomovil
    telefono: '',
    cedula: '',
    referencia: '',
    // PayPal
    emailPayPal: '',
    // Binance
    walletBinance: '',
    // Zelle
    emailZelle: '',
    nombreZelle: '',
  });
  const [comprobante, setComprobante] = useState(null);
  const [comprobantePreview, setComprobantePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zelleInfo, setZelleInfo] = useState(null);
  const [binanceWallet, setBinanceWallet] = useState(null);
  const paypalButtonsRef = useRef(null);

  useEffect(() => {
    obtenerTasaBCV();
    cargarInfoPagos();
  }, []);

  useEffect(() => {
    // Cargar información específica según el método de pago
    if (metodoPago === 'zelle') {
      cargarInfoZelle();
    } else if (metodoPago === 'binance') {
      cargarWalletBinance();
    } else if (metodoPago === 'paypal') {
      inicializarPayPal();
    }
  }, [metodoPago]);

  const obtenerTasaBCV = async () => {
    try {
      // Usar la API real del BCV
      const tasaData = await bcvAPI.obtenerTasaBCV();
      setTasaBCV(tasaData.tasa);
      const precioEnBs = await bcvAPI.convertirUSDaVES(precioUSD);
      // Actualizar precioBS si no viene en el state
      if (!location.state?.precioBS) {
        // El precioBS se mostrará calculado dinámicamente
      }
    } catch (error) {
      console.error('Error al obtener tasa BCV:', error);
      setTasaBCV(36.5);
    }
  };

  const cargarInfoPagos = async () => {
    // Cargar información de métodos de pago que la necesiten
  };

  const cargarInfoZelle = async () => {
    try {
      const info = await zelleService.getPaymentInfo();
      setZelleInfo(info);
    } catch (error) {
      console.error('Error al cargar info Zelle:', error);
    }
  };

  const cargarWalletBinance = async () => {
    try {
      const wallet = await binanceService.getWalletAddress();
      setBinanceWallet(wallet);
    } catch (error) {
      console.error('Error al cargar wallet Binance:', error);
      // Wallet por defecto para mostrar
      setBinanceWallet('0x1234567890abcdef1234567890abcdef12345678');
    }
  };

  const inicializarPayPal = async () => {
    try {
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (clientId) {
        await paypalService.initialize(clientId);
      }
    } catch (error) {
      console.error('Error al inicializar PayPal:', error);
    }
  };

  const handleMetodoPagoChange = (metodo) => {
    setMetodoPago(metodo);
    // Limpiar datos al cambiar método
    setDatosPago({
      telefono: '',
      cedula: '',
      referencia: '',
      emailPayPal: '',
      walletBinance: '',
      emailZelle: '',
      nombreZelle: '',
    });
    setComprobante(null);
    setComprobantePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosPago(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComprobanteChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB máximo
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }
      setComprobante(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprobantePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!metodoPago) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    // Validaciones según método
    if (metodoPago === 'pagomovil' && (!datosPago.telefono || !datosPago.cedula || !comprobante)) {
      alert('Por favor completa todos los campos de Pagomovil y sube el comprobante');
      return;
    }

    if (metodoPago === 'paypal') {
      // PayPal se maneja con el botón de PayPal, no necesita validación aquí
      // El proceso se completa en handlePayPalSuccess
      return;
    }

    if (metodoPago === 'binance' && !comprobante) {
      alert('Por favor sube el comprobante de pago de Binance');
      return;
    }

    if (metodoPago === 'zelle' && (!datosPago.emailZelle || !datosPago.nombreZelle || !comprobante)) {
      alert('Por favor completa todos los campos de Zelle y sube el comprobante');
      return;
    }

    setLoading(true);

    try {
      let response;

      // Procesar según el método de pago
      if (metodoPago === 'pagomovil') {
        const formData = new FormData();
        formData.append('plan', plan);
        formData.append('metodoPago', metodoPago);
        formData.append('precioUSD', precioUSD.toString());
        formData.append('precioBS', precioBS);
        formData.append('tasaBCV', tasaBCV?.toString() || '36.5');
        formData.append('datosPago', JSON.stringify(datosPago));
        if (comprobante) {
          formData.append('comprobante', comprobante);
        }
        response = await pagosAPI.procesarPago(formData);
      } else if (metodoPago === 'binance') {
        // Crear orden en Binance
        const binanceOrder = await binanceService.createOrder(
          precioUSD,
          'Suscripción Profesional',
          datosPago.walletBinance
        );
        
        // Si hay comprobante, enviarlo para verificación
        if (comprobante) {
          const formData = new FormData();
          formData.append('orderId', binanceOrder.prepayId);
          formData.append('comprobante', comprobante);
          formData.append('walletAddress', datosPago.walletBinance);
          response = await pagosAPI.procesarPago(formData);
        } else {
          response = binanceOrder;
        }
      } else if (metodoPago === 'zelle') {
        // Enviar comprobante de Zelle
        const formData = new FormData();
        formData.append('plan', plan);
        formData.append('metodoPago', metodoPago);
        formData.append('precioUSD', precioUSD.toString());
        formData.append('emailZelle', datosPago.emailZelle);
        formData.append('nombreZelle', datosPago.nombreZelle);
        if (comprobante) {
          formData.append('comprobante', comprobante);
        }
        response = await zelleService.submitPaymentProof(formData);
      }
      
      if (response && response.success) {
        alert('¡Pago procesado exitosamente! Tu suscripción será activada en breve.');
        navigate('/dashboard');
      } else {
        throw new Error(response?.message || 'Error al procesar el pago');
      }

    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert(error.message || 'Error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para PayPal (se ejecuta cuando el usuario completa el pago en PayPal)
  const handlePayPalSuccess = async (details, data) => {
    try {
      setLoading(true);
      const response = await paypalService.captureOrder(data.orderID);
      
      if (response.success) {
        // Registrar el pago en nuestro backend
        const formData = new FormData();
        formData.append('plan', plan);
        formData.append('metodoPago', 'paypal');
        formData.append('precioUSD', precioUSD.toString());
        formData.append('orderId', data.orderID);
        formData.append('payerId', details.payer.payer_id);
        formData.append('email', details.payer.email_address);

        await pagosAPI.procesarPago(formData);

        alert('¡Pago procesado exitosamente! Tu suscripción será activada en breve.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error al procesar pago PayPal:', error);
      alert('Error al procesar el pago de PayPal. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const metodosPago = [
    {
      id: 'pagomovil',
      nombre: 'Pagomovil',
      icono: '📱',
      descripcion: 'Pago a tasa BCV',
      color: 'blue'
    },
    {
      id: 'paypal',
      nombre: 'PayPal',
      icono: '💳',
      descripcion: 'Pago con PayPal',
      color: 'indigo'
    },
    {
      id: 'binance',
      nombre: 'Binance',
      icono: '₿',
      descripcion: 'Pago con criptomonedas',
      color: 'yellow'
    },
    {
      id: 'zelle',
      nombre: 'Zelle',
      icono: '💵',
      descripcion: 'Transferencia bancaria',
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => navigate('/suscripcion')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a planes
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al inicio
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Pasarela de Pago</h1>
          <p className="mt-2 text-gray-600">
            Plan Profesional - ${precioUSD} USD (Pago único - Acceso de por vida)
            {tasaBCV && ` - ${(precioUSD * tasaBCV).toFixed(2)} Bs (Tasa BCV: ${tasaBCV})`}
            {!tasaBCV && ` - ${precioBS} Bs (Tasa BCV)`}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Resumen del pedido */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Resumen del pedido</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plan Profesional (Pago único)</span>
                <span className="font-semibold">${precioUSD} USD</span>
              </div>
              {tasaBCV && (
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Equivalente en Bs (Tasa BCV: {tasaBCV})</span>
                  <span className="font-semibold">{(precioUSD * tasaBCV).toFixed(2)} Bs</span>
                </div>
              )}
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-blue-600">${precioUSD} USD</span>
              </div>
            </div>

            {/* Selección de método de pago */}
          <div>
              <h3 className="font-semibold text-gray-900 mb-4">Selecciona método de pago</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metodosPago.map((metodo) => (
                  <button
                    key={metodo.id}
                    type="button"
                    onClick={() => handleMetodoPagoChange(metodo.id)}
                    className={`p-4 border-2 rounded-lg transition ${
                      metodoPago === metodo.id
                        ? `border-${metodo.color}-500 bg-${metodo.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{metodo.icono}</span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{metodo.nombre}</div>
                        <div className="text-sm text-gray-600">{metodo.descripcion}</div>
                      </div>
                      {metodoPago === metodo.id && (
                        <svg className="ml-auto w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
          </div>
                  </button>
                ))}
          </div>
            </div>

            {/* Formularios según método de pago */}
            {metodoPago && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Datos de pago</h3>

                {/* Pagomovil */}
                {metodoPago === 'pagomovil' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Instrucciones:</strong> Realiza el pago de {precioBS} Bs a través de Pagomovil y sube el comprobante.
                      </p>
                      <p className="text-sm text-blue-800 mt-2">
                        <strong>Número de cuenta:</strong> 0414-1234567 (Banco de Venezuela)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono (Pagomovil) *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={datosPago.telefono}
                        onChange={handleInputChange}
                        placeholder="0414-1234567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cédula *
                      </label>
                      <input
                        type="text"
                        name="cedula"
                        value={datosPago.cedula}
                        onChange={handleInputChange}
                        placeholder="V-12345678"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de referencia (opcional)
                      </label>
                      <input
                        type="text"
                        name="referencia"
                        value={datosPago.referencia}
                        onChange={handleInputChange}
                        placeholder="Número de referencia del pago"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {metodoPago === 'paypal' && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-indigo-800">
                        Completa el pago de ${precioUSD} USD usando PayPal. Serás redirigido a PayPal para autenticarte.
                      </p>
                    </div>
                    <PayPalScriptProvider 
                      options={{ 
                        'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
                        currency: 'USD'
                      }}
                    >
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [{
                              amount: {
                                value: precioUSD.toString(),
                                currency_code: 'USD'
                              },
                              description: 'Suscripción Profesional - DesployAcademic'
                            }]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order.capture();
                          await handlePayPalSuccess(details, data);
                        }}
                        onError={(err) => {
                          console.error('Error en PayPal:', err);
                          alert('Error al procesar el pago de PayPal. Por favor intenta de nuevo.');
                        }}
                        style={{
                          layout: 'vertical',
                          color: 'blue',
                          shape: 'rect',
                          label: 'paypal'
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}

                {/* Binance */}
                {metodoPago === 'binance' && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Instrucciones:</strong> Realiza el pago equivalente a ${precioUSD} USD en USDT a través de Binance Pay y sube el comprobante.
                      </p>
                      {binanceWallet && (
                        <div className="mt-2 p-2 bg-white rounded">
                          <p className="text-xs font-semibold text-yellow-900 mb-1">Wallet para recibir pago:</p>
                          <p className="text-xs text-yellow-800 font-mono break-all">{binanceWallet}</p>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(binanceWallet);
                              alert('Billetera copiada');
                            }}
                            className="mt-2 text-xs flex items-center text-yellow-700 hover:text-yellow-900 underline"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copiar dirección
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tu Wallet de Binance (opcional, para verificación)
                      </label>
                      <input
                        type="text"
                        name="walletBinance"
                        value={datosPago.walletBinance}
                        onChange={handleInputChange}
                        placeholder="0x... o dirección de tu wallet"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hash de transacción (opcional)
                      </label>
                      <input
                        type="text"
                        name="txHash"
                        value={datosPago.txHash || ''}
                        onChange={handleInputChange}
                        placeholder="Hash de la transacción blockchain"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                )}

                {/* Zelle */}
                {metodoPago === 'zelle' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-green-800">
                        <strong>Instrucciones:</strong> Realiza el pago de ${precioUSD} USD a través de Zelle y sube el comprobante.
                      </p>
                      {zelleInfo ? (
                        <>
                          <p className="text-sm text-green-800 mt-2 flex items-center">
                            <strong>Email Zelle:</strong> 
                            <span className="ml-1 font-mono">{zelleInfo.email}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(zelleInfo.email);
                                alert('Email copiado');
                              }}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                          </p>
                          <p className="text-sm text-green-800">
                            <strong>Nombre:</strong> {zelleInfo.nombre}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-green-800 mt-2 flex items-center">
                          <strong>Email Zelle:</strong> 
                          <span className="ml-1 font-mono">pagos@desployacademic.com</span>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('pagos@desployacademic.com');
                              alert('Email copiado');
                            }}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </p>
                      )}
                    </div>
          <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de Zelle *
                      </label>
                      <input
                        type="email"
                        name="emailZelle"
                        value={datosPago.emailZelle}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        required
                      />
          </div>
          <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo (como aparece en Zelle) *
                      </label>
                      <input
                        type="text"
                        name="nombreZelle"
                        value={datosPago.nombreZelle}
                        onChange={handleInputChange}
                        placeholder="Juan Pérez"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Captura de comprobante (requerido para Pagomovil, Binance y Zelle) */}
                {(metodoPago === 'pagomovil' || metodoPago === 'binance' || metodoPago === 'zelle') && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comprobante de pago * (JPG, PNG, PDF - Máx. 5MB)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition">
                      <div className="space-y-1 text-center">
                        {comprobantePreview ? (
                          <div>
                            <img
                              src={comprobantePreview}
                              alt="Preview"
                              className="mx-auto h-32 w-auto rounded"
                            />
                            <p className="text-xs text-gray-500 mt-2">{comprobante?.name}</p>
                            <button
                              type="button"
                              onClick={() => {
                                setComprobante(null);
                                setComprobantePreview(null);
                              }}
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              Eliminar
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Subir archivo</span>
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handleComprobanteChange}
                                  className="sr-only"
                                  required
                                />
                              </label>
                              <p className="pl-1">o arrastra y suelta</p>
          </div>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 5MB</p>
                          </>
                        )}
            </div>
            </div>
          </div>
                )}
              </div>
            )}

            {/* Botón de pago */}
            <div className="border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={!metodoPago || loading}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando pago...
                  </>
                ) : (
                  `Pagar $${precioUSD} USD`
                )}
              </button>
              <p className="mt-3 text-xs text-center text-gray-500">
                Al continuar, aceptas nuestros términos y condiciones de pago.
              </p>
            </div>
        </form>
          </div>
      </div>
    </div>
  );
}
