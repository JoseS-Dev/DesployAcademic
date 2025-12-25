// Servicio para integración con PayPal usando su API oficial
// Requiere: @paypal/react-paypal-js

import { loadScript } from '@paypal/paypal-js';

let paypalLoaded = false;

export const paypalService = {
  /**
   * Inicializa PayPal SDK
   * @param {string} clientId - Client ID de PayPal (desde variables de entorno)
   * @returns {Promise<Object>} - Instancia de PayPal
   */
  initialize: async (clientId) => {
    if (paypalLoaded) {
      return window.paypal;
    }

    try {
      const paypal = await loadScript({
        'client-id': clientId || import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
        currency: 'USD',
        intent: 'capture',
        'data-client-token': null
      });

      paypalLoaded = true;
      window.paypal = paypal;
      return paypal;
    } catch (error) {
      console.error('Error al cargar PayPal SDK:', error);
      throw error;
    }
  },

  /**
   * Crea una orden de pago en PayPal
   * @param {number} amount - Monto en USD
   * @param {string} description - Descripción del pago
   * @returns {Promise<Object>} - Respuesta de la API de PayPal
   */
  createOrder: async (amount, description = 'Suscripción Profesional') => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          amount: amount.toString(),
          currency: 'USD',
          description: description
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la orden de PayPal');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear orden PayPal:', error);
      throw error;
    }
  },

  /**
   * Captura el pago de PayPal después de la aprobación
   * @param {string} orderId - ID de la orden de PayPal
   * @returns {Promise<Object>} - Respuesta de la captura
   */
  captureOrder: async (orderId) => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/paypal/capture-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
        throw new Error('Error al capturar el pago de PayPal');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al capturar orden PayPal:', error);
      throw error;
    }
  },

  /**
   * Procesa un pago directo usando PayPal (sin SDK, solo API)
   * @param {string} email - Email de PayPal del usuario
   * @param {number} amount - Monto en USD
   * @returns {Promise<Object>} - Respuesta del pago
   */
  processPayment: async (email, amount) => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/paypal/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          email,
          amount: amount.toString(),
          currency: 'USD'
        })
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago de PayPal');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al procesar pago PayPal:', error);
      throw error;
    }
  }
};

export default paypalService;

