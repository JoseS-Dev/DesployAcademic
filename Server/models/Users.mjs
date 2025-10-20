import bcrypt from 'bcryptjs';
import pkg from 'lodash';
import { db, verifyDBConnection } from '../database/db.mjs';
import { authMiddleware } from '../middlewares/Auth.mjs';

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
            'SELECT id_user FROM users WHERE email_user = $1 OR username = $2',
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
            // Si la contraseña es correcta, se procede a generar el token y guardar la sesión
            const auth = authMiddleware(omit(user, ['password_hash']));
            if(auth.error) return {error: 'Error al generar el token de autenticación'};
            // Antes de guardar la sesión, se verifica si ya existe una sesión activa 
            const existingSession = await db.query(
                'SELECT id_session FROM login_sessions WHERE user_id = $1',
                [user.id_user]
            );
            if(existingSession.rowCount > 0){
                // Se procede a actualizar el token de la sesión existente
                await db.query(
                    `UPDATE login_sessions
                    SET session_token = $1, login_at = NOW()
                    WHERE user_id = $2`,
                    [auth, user.id_user]
                );
                return {user: omit(user, ['password_hash']), token: auth, 
                message: 'Inicio de sesión exitoso'};
            }else{
                // Si no existe una sesión activa, se procede a crear una nueva sesión
                await db.query(
                    `INSERT INTO login_sessions (user_id, session_token)
                    VALUES ($1, $2)`,
                    [user.id_user, auth]
                );
                return {user: omit(user, ['password_hash']), token: auth, 
                message: 'Inicio de sesión exitoso'};
            }
        }
    }

    // método que cierra la sesión de un usuario
    static async logoutUser({userId}){
        if(!await verifyDBConnection()) return {error: 'No se pudo conectar a la base de datos'};
        if(!userId) return {error: 'No se proporcionó el ID del usuario'};
        // Si todo esta bien, procedo a cerrar la sesión del usuario, quitando el token
        const deletedSession = await db.query(
            'UPDATE login_sessions SET session_token = NULL, logout_at = NOW() WHERE user_id = $1',
            [userId]
        );
        if(deletedSession.rowCount === 0) return {error: 'No se pudo cerrar la sesión del usuario'};
        return {message: 'Sesión cerrada exitosamente'};

    }
}