import bcrypt from 'bcryptjs';
import pkg from 'lodash';
import { db, verifyDBConnection } from '../database/db.mjs';

const { omit } = pkg;

export class ModelUsers {
    
    // método que registra a un nuevo usuario en el sistema
    static async registerUser({userData}){
        if(!await verifyDBConnection()) return {error: 'No se pudo conectar a la base de datos'};
        if(!userData) return {error: 'No se proporcionaron datos del usuario'};
        // si todo esta bien, procedo a registrar el usuario
        const {name_user, email_user, password_hash, username} = userData;
        // Se verifica , si ya existe un usuario con ese email o username
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email_user = $1 OR username = $2',
            [email_user, username]
        );
        if(existingUser.rowCount > 0) return {error: 'Ya existe un usuario con ese email o username'};
        // Si no existe, procedo a hashear la contraseña
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        // Inserto el nuevo usuario en la base de datos
        const newUser = await db.query(
            `INSERT INTO users (name_user, email_user, password_hash, username)
            VALUES ($1, $2, $3, $4) RETURNING name_user, email_user, username`,
            [name_user, email_user, hashedPassword, username]
        );
        if(newUser.rowCount === 0) return {error: 'No se pudo registrar el usuario'};
        return {user: newUser.rows[0], message: 'Usuario registrado exitosamente'};
    }

    // método que loguea a un usuario en el sistema
    static async loginUser({LoginData}){
        if(!await verifyDBConnection()) return {error: 'No se pudo conectar a la base de datos'};
        if(!LoginData) return {error: 'No se proporcionaron datos de login'};
        // Si todo esta bien, procedo a loguear al usuario
        const {email_user, password_hash} = LoginData;
        // Se verifica si existe el usuario con ese email
        const existingUser = await db.query(
            'SELECT * FROM users WHERE email_user = $1',
            [email_user]
        );
        if(existingUser.rowCount === 0) return {error: 'No existe un usuario con ese email'};
        const user = existingUser.rows[0];
        // Si existe, se procede a verificar la contraseña
        const verifyPassword = await bcrypt.compare(password_hash, user.password_hash);
        if(verifyPassword){
            return {
                user: omit(user, ['password_hash']),
                message: 'credenciales correctas',
            }
        }
    }

    // método para crear o actualizar la sesión de un usuario
    static async createOrUpdateSession({userId, sessionToken}){
        if(!await verifyDBConnection()) return {error: 'No se pudo conectar a la base de datos'};
        if(!userId || !sessionToken) return {error: 'No se proporcionaron datos de sesión'};
        // Se verifica si ya existe una sesión para ese usuario
        const existingUser = await db.query(
            'SELECT id FROM login_sessions WHERE user_id = $1',
            [userId]
        );
        if(existingUser.rowCount > 0){
            // Si existe, se procede a actualizar el token de sesión
            const updatedSession = await db.query(
                `UPDATE login_sessions SET session_token = $1, login_at = NOW(), logout_at = NULL, 
                is_active = true WHERE user_id = $2 RETURNING session_token`,
                [sessionToken, userId]
            )
            if(updatedSession.rowCount === 0) return {error: 'No se pudo actualizar la sesión'};
            return {sessionToken: updatedSession.rows[0].session_token};
        }
        // Si no existe, se procede a crear una nueva sesión
        const newSession = await db.query(
            `INSERT INTO login_sessions (user_id, session_token, login_at)
            VALUES ($1, $2, NOW()) RETURNING session_token`,
            [userId, sessionToken]
        );
        if(newSession.rowCount === 0) return {error: 'No se pudo crear la sesión'};
        return {token: newSession.rows[0].session_token};
    }

    // método que cierra la sesión de un usuario
    static async logoutUser({userId}){
        if(!await verifyDBConnection()) return {error: 'No se pudo conectar a la base de datos'};
        if(!userId) return {error: 'No se proporcionó el ID del usuario'};
        // Si todo esta bien, procedo a cerrar la sesión del usuario, quitando el token
        const deletedSession = await db.query(
            'UPDATE login_sessions SET session_token = NULL, logout_at = NOW(), is_active = false WHERE user_id = $1',
            [userId]
        );
        if(deletedSession.rowCount === 0) return {error: 'No se pudo cerrar la sesión del usuario'};
        return {message: 'Sesión cerrada exitosamente'};

    }
}