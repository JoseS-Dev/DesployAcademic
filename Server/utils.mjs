import { verifyDBConnection } from "./database/db.mjs"

export const acceptedImage = [
    '.png', '.jpg', '.jpeg', '.gif', '.webp',
    '.avid'
]

// Functión para la validación si se conecto a la base de datos
export const WithDBConnection = (fn) => {
    return async (...args) => {
        const isConnected = await verifyDBConnection();
        if (!isConnected) return { error: 'No se pudo conectar a la base de datos' };
        return fn(...args);
    }
}