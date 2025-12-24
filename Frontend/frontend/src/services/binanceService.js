// Servicio para integración con Binance Pay API
// Documentación: https://developers.binance.com/docs/binance-pay/api-overview

const BINANCE_API_URL = 'https://bpay.binanceapi.com/binancepay/openapi/v2';

export const binanceService = {
  /**
   * Crea una orden de pago en Binance Pay
   * @param {number} amount - Monto en USD (se convertirá a USDT)
   * @param {string} description - Descripción del pago
   * @param {string} walletAddress - Dirección de wallet del usuario (opcional)
   * @returns {Promise<Object>} - Respuesta de Binance Pay
   */
  createOrder: async (amount, description = 'Suscripción Premium', walletAddress = null) => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      // Llamar a nuestro backend que se comunica con Binance Pay
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/binance/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          amount: amount.toString(),
          currency: 'USDT', // Binance Pay usa principalmente USDT
          description: description,
          walletAddress: walletAddress
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la orden de Binance Pay');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear orden Binance:', error);
      throw error;
    }
  },

  /**
   * Verifica el estado de una orden de Binance Pay
   * @param {string} prepayId - ID de la orden prepagada
   * @returns {Promise<Object>} - Estado de la orden
   */
  checkOrderStatus: async (prepayId) => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/binance/order-status/${prepayId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Error al verificar el estado de la orden');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al verificar orden Binance:', error);
      throw error;
    }
  },

  /**
   * Obtiene la dirección de wallet para recibir pagos
   * @returns {Promise<string>} - Dirección de wallet
   */
  getWalletAddress: async () => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/binance/wallet-address`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener la dirección de wallet');
      }

      const data = await response.json();
      return data.walletAddress;
    } catch (error) {
      console.error('Error al obtener wallet Binance:', error);
      throw error;
    }
  },

  /**
   * Valida una transacción de Binance usando el hash de la transacción
   * @param {string} txHash - Hash de la transacción blockchain
   * @param {string} walletAddress - Dirección de wallet
   * @returns {Promise<Object>} - Resultado de la validación
   */
  validateTransaction: async (txHash, walletAddress) => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}').token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/binance/validate-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          txHash,
          walletAddress
        })
      });

      if (!response.ok) {
        throw new Error('Error al validar la transacción');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al validar transacción Binance:', error);
      throw error;
    }
  }
};

export default binanceService;

