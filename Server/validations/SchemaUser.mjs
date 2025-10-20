import zod from 'zod';

// Defino el schema para la validacion de usuarios
export const SchemaUser = zod.object({
    name_user: zod.string().min(3).max(50),
    email_user: zod.string().email(),
    password_hash: zod.string().min(6).max(100),
    phone_user: zod.string().min(7).max(11).optional(),
    avatar_url: zod.string().url().optional(),
    bio: zod.string().max(500).optional(),
    username: zod.string().min(3).max(30)
});

// Defino el schema para la validación del Login
export const SchemaLogin = zod.object({
    email_user: zod.string().email(),
    password_hash: zod.string().min(6).max(100),
    session_token: zod.string().optional()
})

// Función para validar un usuario
export function validateUser(data){
    if(!data) return {error: 'Los datos no fueron proporcionados'};
    return SchemaUser.safeParse(data);
}
// Función para validar un usuario, si se va actualizar
export function validateUserUpdate(data){
    if(!data) return {error: 'Los datos no fueron proporcionados'};
    return SchemaUser.partial().safeParse(data);
}
// Función para validar el login
export function validateLogin(data){
    if(!data) return {error: 'Los datos no fueron proporcionados'};
    return SchemaLogin.safeParse(data);
}