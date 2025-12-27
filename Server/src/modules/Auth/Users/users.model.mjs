import { WithDBConnection, hashPassword, comparePassword } from "../../../core/utils/function.mjs";
import { db } from "../../../../database/db.mjs";
import pkg from 'lodash';
const { omit } = pkg;

// Modelo que interactúa con la tabla users de la base de datos
export class ModelUsers {
    // Método que registrar a un usuario en el sistema
    static registerUser = WithDBConnection(async (userData) => {
        if(!userData) return {error: "Los datos del usuario no fueron proporcionados"};
        const { 
            name_user, email_user, 
            password_user, username, role_user, plan_user
        } = userData;
        // Se verifica si ya existe un usuario con ese email o username
        const existingUser = await db.query(
            `SELECT id FROM users WHERE email_user = $1 OR username = $2`,
            [email_user, username]
        );
        if(existingUser.rowCount > 0) return {error: "Ya existe un usuario con ese email o username"};
        // Si no existe, se procede a hashear la contraseña
        const hashedPassword = await hashPassword(password_user);
        // Se inserta el nuevo usuario en la base de datos
        const newUser = await db.query(
            `INSERT INTO users (name_user, email_user, password_user, username, plan_user)
            VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [name_user, email_user, hashedPassword, username, plan_user]
        );
        if(newUser.rowCount === 0) return {error: "No se pudo registrar el usuario"};
        // A su vez asignamos el rol al usuario que por defecto es estudiante
        const rolUser = await db.query(
            `INSERT INTO roles (user_id, role_user) VALUES($1, $2) RETURNING *`,
            [newUser.rows[0].id, role_user || 'student']
        );
        if(rolUser.rowCount === 0) return {error: "No se pudo asignar el rol al usuario"};
        return {message: "Usuario registrado exitosamente", user: {
            ...omit(newUser.rows[0], ['password_user']),
            role: rolUser.rows[0].role_user
        }}
    });

    // Método que loguea a un usuario en el sistema
    static LoginUser = WithDBConnection(async (LoginData) => {
        if(!LoginData) return {error: "Los datos de login no fueron proporcionados"};
        const {email_user, password_user} = LoginData;
        // Se verifica si el usuario existe
        const existingUser = await db.query(
            `SELECT U.*, UR.role_user FROM users U
            JOIN roles UR ON U.id = UR.user_id WHERE email_user = $1`,
            [email_user]
        );
        if(existingUser.rowCount === 0) return {error: "No existe un usuario con ese email"};
        // Si existe, se procede a loguearlo
        const user = existingUser.rows[0];
        // Se compara la contraseña proporcionada con la almacenada
        const isPasswordValid = await comparePassword(password_user, user.password_user);
        if(!isPasswordValid) return {error: "La contraseña es incorrecta"};
        // Si la contraseña es correcta, se loguea al usuario, pero antes se verifica si ya habia loguado antes
        const LoginUser = await db.query(
            `SELECT * FROM login_sessions WHERE user_id = $1`,
            [user.id]
        );
        if(LoginUser.rowCount > 0){
            // Si ya habia logueado antes, se actualiza la sesión
            await db.query(
                `UPDATE login_sessions SET is_active = true, login_at = NOW() WHERE user_id = $1`,
                [user.id]
            )
            return {message: "Usuario logueado exitosamente", user:omit(user, ['password_user'])};
        }
        else{
            // Si es la primera vez que se loguea, se crea una nueva sesión
            await db.query(
                `INSERT INTO login_sessions (user_id) VALUES ($1)`,
                [user.id]
            )
            return {message: "Usuario logueado exitosamente", user:omit(user, ['password_user'])};
        }
    })

    // Método que desloguea a un usuario en el sistema
    static LogoutUser = WithDBConnection(async (userId) => {
        if(!userId) return {error: "El ID del usuario no fue proporcionado"};
        // Se verifica si el usuario tiene una sesión activa
        const LoginUser = await db.query(
            `SELECT * FROM login_sessions WHERE user_id = $1 AND is_active = true`,
            [userId]
        );
        if(LoginUser.rowCount === 0) return {error: "El usuario no tiene una sesión activa"};
        // Si existe, se procede a desloguearlo
        await db.query(
            `UPDATE login_sessions SET is_active = false, logout_at = NOW() WHERE user_id = $1`,
            [userId]
        )
        return {message: "Usuario deslogueado exitosamente"};
    })

    // Método para obtener la información de un usuario por su ID
    static getUserById = WithDBConnection(async (userId) => {
        if(!userId) return {error: "El ID del usuario no fue proporcionado"};
        const user = await db.query(
            `SELECT U.*, UR.role_user FROM users U
            JOIN roles UR ON U.id = UR.user_id WHERE U.id = $1`,
            [userId]
        );
        if(user.rowCount === 0) return {error: "No se encontró un usuario con ese ID"};
        return {user: omit(user.rows[0], ['password_user'])};
    })

    // Método para que el usuario pueda actualizar su información
    static updateUser = WithDBConnection(async (userId, updateData) => {
        if(!userId || !updateData) return {error: "Faltan datos para actualizar"};
        // Agrego los campos aptos para actualizar
        const allowedFields = [
            'name_user', 'email_user',
            'phone_user',
            'username', 'avatar_imagen'
        ];
        const fieldsToUpdate = {};
        for (const field of allowedFields) {
            if(updateData[field] !== undefined){
                fieldsToUpdate[field] = updateData[field];
            }
        }
        // Se verifica si el usuario existe
        const existingUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        if(existingUser.rowCount === 0) return {error: "No existe un usuario con ese ID"};
        // Si existe, se procede a actualizarlo
        const fields = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(userId); // Agrego el ID del usuario al final de los valores
        const updatedUser = await db.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        if(updatedUser.rowCount === 0) return {error: "No se pudo actualizar el usuario"};
        return {message: "Usuario actualizado exitosamente"}
    });

    // Método para obtener a todos los usuarios del sistema (admin)
    static getAllUsers = WithDBConnection(async () => {
        const users = await db.query('SELECT * FROM users');
        if(users.rowCount === 0) return {error: "No se encontraron usuarios"};
        return {message: `Se encontraron ${users.rowCount} usuarios`, users: users.rows};
    })

    // Método para que el usuario elimine su cuenta del sistema
    static deleteUser = WithDBConnection(async (userId) => {
        if(!userId) return {error: "El ID del usuario no fue proporcionado"};
        // Se verifica si el usuario existe
        const existingUser = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        if(existingUser.rowCount === 0) return {error: "No existe un usuario con ese ID"};
        // Si existe, se procede a eliminarlo
        await db.query(
            `DELETE FROM users WHERE id = $1`,
            [userId]
        )
        return {message: "Usuario eliminado exitosamente"};
    });
}