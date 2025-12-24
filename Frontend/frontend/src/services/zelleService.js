// Servicio para integración con Zelle
// Nota: Zelle no tiene API pública, pero podemos crear una integración
// que permita a los usuarios enviar comprobantes y verificar pagos manualmente

export const zelleService = {
  /**
   * Obtiene la información de pago de Zelle (email y nombre)
   * Esta información debe estar configurada en el backend
   * @returns {Promise<Object>} - Información de pago de Zelle
   */
  getPaymentInfo: async () => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/zelle/payment-info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener información de Zelle');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener info Zelle:', error);
      // Retornar información por defecto
      return {
        email: 'pagos@desployacademic.com',
        nombre: 'DesployAcademic',
        instrucciones: 'Realiza el pago a través de Zelle usando el email proporcionado'
      };
    }
  },

  /**
   * Envía un comprobante de pago de Zelle para verificación
   * @param {FormData} formData - FormData con el comprobante y datos del pago
   * @returns {Promise<Object>} - Respuesta de la verificación
   */
  submitPaymentProof: async (formData) => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/zelle/verify-payment`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
          // No incluir Content-Type, el navegador lo establecerá para FormData
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al enviar el comprobante de Zelle');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al enviar comprobante Zelle:', error);
      throw error;
    }
  },

  /**
   * Verifica el estado de un pago de Zelle
   * @param {string} paymentId - ID del pago
   * @returns {Promise<Object>} - Estado del pago
   */
  checkPaymentStatus: async (paymentId) => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/zelle/payment-status/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Error al verificar el estado del pago');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al verificar pago Zelle:', error);
      throw error;
    }
  }
};

export default zelleService;

