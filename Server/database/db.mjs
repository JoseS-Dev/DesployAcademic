import pg from 'pg';
import { CONFIG_DB } from '../config/config.mjs';

// Nos conectamos a la base de datos
const { Pool } = pg;

export const db = new Pool({
    host: CONFIG_DB.host,
    port: CONFIG_DB.port,
    user: CONFIG_DB.user,
    password: CONFIG_DB.password,
    database: CONFIG_DB.database,
})

// Functión que verifica si se conecto a la db
export async function verifyDBConnection(){
    try{
        await db.connect();
        return true
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        return false
    }
}
