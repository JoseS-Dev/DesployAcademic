import dotenv from 'dotenv';

dotenv.config();
// Configuraciones Globales del servidor
export const CONFIG_SERVER = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'http://localhost',
    basePath: process.env.BASE_PATH || '/api/v1',
    node: process.env.NODE_ENV || 'development',
}

// Configuraciones de la base de datos
export const CONFIG_DB = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'desploy_academic_db'
}

// Configuraciones de JWT
export const CONFIG_JWT = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
}