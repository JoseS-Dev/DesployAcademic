// Servicio para obtener la tasa de cambio del Banco Central de Venezuela
// Usando API pública que consulta el BCV

const BCV_API_URL = 'https://bcv-api.deno.dev/v1/exchange';

export const bcvAPI = {
  /**
   * Obtiene la tasa de cambio USD/VES del Banco Central de Venezuela
   * @returns {Promise<{usd: number, fecha: string}>}
   */
  obtenerTasaBCV: async () => {
    try {
      // API pública que consulta el BCV
      const response = await fetch(BCV_API_URL);
      
      if (!response.ok) {
        throw new Error('Error al obtener la tasa del BCV');
      }
      
      const data = await response.json();
      
      // La API devuelve el valor en formato string, lo convertimos a número
      const tasa = parseFloat(data.usd?.replace(',', '.') || data.rate || '0');
      
      if (!tasa || tasa === 0) {
        throw new Error('Tasa no disponible');
      }
      
      return {
        tasa: tasa,
        fecha: data.fecha || new Date().toISOString(),
        moneda: 'VES',
        base: 'USD'
      };
    } catch (error) {
      console.error('Error al obtener tasa BCV:', error);
      
      // Fallback: intentar con otra API alternativa
      try {
        const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const fallbackData = await fallbackResponse.json();
        const tasaVES = fallbackData.rates?.VES || 36.5; // Tasa aproximada si no está disponible
        
        return {
          tasa: tasaVES,
          fecha: new Date().toISOString(),
          moneda: 'VES',
          base: 'USD',
          fuente: 'fallback'
        };
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        // Último recurso: tasa por defecto
        return {
          tasa: 36.5,
          fecha: new Date().toISOString(),
          moneda: 'VES',
          base: 'USD',
          fuente: 'default'
        };
      }
    }
  },

  /**
   * Convierte USD a VES usando la tasa del BCV
   * @param {number} usd - Cantidad en USD
   * @returns {Promise<number>} - Cantidad en VES
   */
  convertirUSDaVES: async (usd) => {
    const tasaData = await bcvAPI.obtenerTasaBCV();
    return (usd * tasaData.tasa).toFixed(2);
  }
};

export default bcvAPI;

