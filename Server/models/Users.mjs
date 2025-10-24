import bcrypt from 'bcryptjs';
import pkg from 'lodash';
import { db } from '../database/db.mjs';
import { WithDBConnection } from '../utils.mjs';

const { omit } = pkg;


export class ModelUsers {
    
    // método que registra a un nuevo usuario en el sistema
    static registerUser = WithDBConnection(async ({userData}) => {
        if(!userData) return {error: 'No se proporcionaron datos del usuario'};
        // si todo esta bien, procedo a registrar el usuario
        const {name_user, email_user, password_hash, username, rol_user} = userData;
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
            VALUES ($1, $2, $3, $4) RETURNING id,name_user, email_user, username`,
            [name_user, email_user, hashedPassword, username]
        );
        // y relaciono el rol del usuario
        await db.query(
            `INSERT INTO user_roles (user_id, role, assigned_at) VALUES ($1, $2, NOW())`,
            [newUser.rows[0].id, rol_user]
        )
        if(newUser.rowCount === 0) return {error: 'No se pudo registrar el usuario'};
        return {user: newUser.rows[0], message: 'Usuario registrado exitosamente'};
    });

    // método que loguea a un usuario en el sistema
    static loginUser = WithDBConnection(async ({LoginData}) => {
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
    });

    // método para crear o actualizar la sesión de un usuario
    static createOrUpdateSession = WithDBConnection(async ({userId, sessionToken}) => {
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
    });

    // método que cierra la sesión de un usuario
    static logoutUser = WithDBConnection(async ({userId}) => {
        if(!userId) return {error: 'No se proporcionó el ID del usuario'};
        // Si todo esta bien, procedo a cerrar la sesión del usuario, quitando el token
        const deletedSession = await db.query(
            'UPDATE login_sessions SET session_token = NULL, logout_at = NOW(), is_active = false WHERE user_id = $1',
            [userId]
        );
        if(deletedSession.rowCount === 0) return {error: 'No se pudo cerrar la sesión del usuario'};
        return {message: 'Sesión cerrada exitosamente'};

    });

    // Método para obtener la información de un usuario por su ID
    static getUserById = WithDBConnection(async ({userId}) => {
        if(!userId) return {error: 'No se proporcionó el ID del usuario'};
        // Si todo esta bien, procedo a obtener la información del usuario
        const userResult = await db.query(
            `SELECT DU.*, R.role AS rol_user FROM users DU
            LEFT JOIN user_roles R ON DU.id = R.user_id
            WHERE DU.id = $1`,
            [userId]
        );
        if(userResult.rowCount === 0) return {error: 'No se encontró el usuario'};
        return {user: omit(userResult.rows[0], ['password_hash', 'id']), 
        message: 'Usuario encontrado exitosamente'};
    });

    // Método para actualizar la información de un usuario
    static updateUserById = WithDBConnection(async ({userId, updateData}) => {
        if(!userId || !updateData) return {error: 'No se proporcionaron datos para actualizar el usuario'};
        // Coloco las columnas que se pueden actualizar
        const allowField = ['name_user', 'email_user', 'phone_user',
        'avatar_url', 'bio', 'username'];
        const UpdateToFields = {};
        for(const field of allowField){
            if(updateData[field] !== undefined){
                UpdateToFields[field] = updateData[field];
            }
        }
        // Se verifica que existe el usuario
        const existingUser = await db.query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );
        if(existingUser.rowCount === 0) return {error: 'No existe un usuario con ese ID'};
        // Si existe, procedo a actualizar el usuario
        const fields = [];
        const values = [];

        Object.entries(UpdateToFields).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        })
        values.push(userId); // Agrego el userId al final de los valores
        // Construyo la consulta dinámica
        const updatedUser = await db.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        if(updatedUser.rowCount === 0) return {error: 'No se pudo actualizar el usuario'};
        return {message: 'Usuario actualizado exitosamente'};
    })
}