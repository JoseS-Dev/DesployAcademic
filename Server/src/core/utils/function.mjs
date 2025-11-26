import bcrypt from 'bcryptjs';
import { verifyDBConnection, db } from "../../../database/db.mjs"
// Functión para la validación si se conecto a la base de datos
export const WithDBConnection = (fn) => {
    return async (...args) => {
        const isConnected = await verifyDBConnection();
        if (!isConnected) return { error: 'No se pudo conectar a la base de datos' };
        return fn(...args);
    }
}

// Functión que hashea la contraseña del usuario
export const hashPassword = async (password) => {
    if(!password) return {error: "La contraseña no fue proporcionada"};
    return await bcrypt.hash(password, 10);
}

// Function que compara la contraseña hasheada con la contraseña proporcionada
export const comparePassword = async (password, hashedPassword) => {
    if(!password || !hashedPassword) return {error: "Las contraseñas no fueron proporcionadas"};
    return await bcrypt.compare(password, hashedPassword);
}

// Function para cargar todas las rutas de todos los modulos
export function registerRoutes(app, routes) {
    Object.values(routes).forEach(moduleRoutes => {
        if(typeof moduleRoutes === 'object') {
            Object.values(moduleRoutes).forEach(route => {
                app.use(route);
            });
        }
    });
}

// Función para los seed para cargar los mocks dependiendo de la tabla
export async function getSeedFunctionByTable(tableName, mock){
    for(const item of mock){
        const columns = Object.keys(item).join(', ');
        const values = Object.values(item);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        await db.query(query, values);
    }
}