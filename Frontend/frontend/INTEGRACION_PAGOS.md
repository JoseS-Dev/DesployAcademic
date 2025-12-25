# Guía de Integración de APIs de Pago

Este documento explica cómo configurar e integrar las APIs reales de los métodos de pago.

## Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz de `Frontend/frontend/` con las siguientes variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
VITE_BINANCE_API_KEY=tu_binance_api_key
VITE_BINANCE_SECRET_KEY=tu_binance_secret_key
```

## 1. Banco Central de Venezuela (BCV)

### API Utilizada
- **Endpoint**: `https://bcv-api.deno.dev/v1/exchange`
- **Método**: GET
- **Respuesta**: Tasa de cambio USD/VES oficial del BCV

### Implementación
El servicio `bcvAPI.js` obtiene automáticamente la tasa del BCV. No requiere configuración adicional.

### Fallback
Si la API principal falla, se intenta con una API alternativa y finalmente se usa una tasa por defecto.

## 2. PayPal

### Configuración

1. **Crear cuenta de desarrollador**:
   - Visita: https://developer.paypal.com/
   - Crea una cuenta o inicia sesión

2. **Crear aplicación**:
   - Ve a "My Apps & Credentials"
   - Crea una nueva aplicación
   - Copia el **Client ID**

3. **Configurar en el proyecto**:
   - Agrega `VITE_PAYPAL_CLIENT_ID` en tu `.env`
   - El SDK de PayPal se carga automáticamente

### SDK Utilizado
- **Paquete**: `@paypal/react-paypal-js`
- **Documentación**: https://developer.paypal.com/docs/checkout/

### Backend Requerido
Tu backend debe tener estos endpoints:
- `POST /api/paypal/create-order` - Crear orden de pago
- `POST /api/paypal/capture-order` - Capturar pago después de aprobación

## 3. Binance Pay

### Configuración

1. **Registrarse como comerciante**:
   - Visita: https://www.binance.com/en/binancepay
   - Regístrate como comerciante
   - Completa la verificación

2. **Obtener credenciales API**:
   - Ve a Merchant Dashboard
   - Genera API Key y Secret Key
   - Configura en tu backend (NO en el frontend por seguridad)

3. **Configurar en el proyecto**:
   - Las credenciales se manejan en el backend
   - El frontend solo necesita el endpoint de tu API

### Backend Requerido
Tu backend debe tener estos endpoints:
- `POST /api/binance/create-order` - Crear orden de pago
- `GET /api/binance/order-status/:prepayId` - Verificar estado
- `GET /api/binance/wallet-address` - Obtener dirección de wallet
- `POST /api/binance/validate-transaction` - Validar transacción blockchain

### Documentación
- **API Docs**: https://developers.binance.com/docs/binance-pay/api-overview

## 4. Zelle

### Limitaciones
Zelle **NO tiene API pública** para integraciones directas. La implementación actual permite:
- Mostrar información de pago (email, nombre)
- Recibir comprobantes de pago
- Verificación manual en el backend

### Backend Requerido
Tu backend debe tener estos endpoints:
- `GET /api/zelle/payment-info` - Obtener información de pago
- `POST /api/zelle/verify-payment` - Verificar comprobante
- `GET /api/zelle/payment-status/:paymentId` - Estado del pago

### Proceso Manual
1. Usuario realiza pago a través de Zelle
2. Usuario sube comprobante
3. Backend verifica manualmente
4. Se activa la suscripción

## 5. Pagomovil

### Configuración
Pagomovil requiere integración con bancos venezolanos. Algunas opciones:

1. **Banco de Venezuela**:
   - API: Botón de Pago BDV
   - Documentación: https://www.bancodevenezuela.com/boton-pago/

2. **Banesco**:
   - API: APIs Banesco
   - Documentación: https://www.banesco.com/empresas/gestiona-tu-empresa/apis-banesco/

3. **Mercantil Banco**:
   - API: C2P (Pagos Móviles)
   - Documentación: https://apiportal.mercantilbanco.com/

### Backend Requerido
Tu backend debe:
- Integrar con el banco elegido
- Validar transferencias Pagomovil
- Procesar comprobantes

## Instalación de Dependencias

```bash
cd Frontend/frontend
npm install @paypal/react-paypal-js axios
```

## Estructura de Servicios

```
src/services/
├── bcvAPI.js          # API del Banco Central
├── paypalService.js   # Servicio de PayPal
├── binanceService.js  # Servicio de Binance Pay
├── zelleService.js    # Servicio de Zelle
└── api.js            # API general del backend
```

## Notas de Seguridad

⚠️ **IMPORTANTE**:
- **NUNCA** expongas API keys o secret keys en el frontend
- Todas las credenciales sensibles deben estar en el backend
- El frontend solo debe tener el Client ID de PayPal (es público)
- Usa HTTPS en producción
- Valida todos los pagos en el backend

## Testing

### Modo Sandbox/Test

1. **PayPal**: Usa el Client ID de sandbox para pruebas
2. **Binance**: Usa el entorno de prueba de Binance Pay
3. **BCV**: La API funciona en tiempo real
4. **Zelle**: No hay modo de prueba, solo producción

## Soporte

Para problemas con las integraciones:
- PayPal: https://developer.paypal.com/support/
- Binance: https://www.binance.com/en/support
- BCV: Consulta el sitio oficial del BCV

