import zod, { email } from "zod";

// Defino el esquema de validación para los datos del usuario
const SchemaUser = zod.object({
    name_user: zod.string().min(3).max(50),
    email_user: zod.string().email(),
    password_user: zod.string().min(6).max(100),
    phone_user: zod.string().min(10).max(15).optional(),
    username: zod.string().min(3).max(30),
    plan_user: zod.enum(['free', 'premium']).optional(),
    role_user: zod.enum(['student', 'instructor']).optional(),
    avatar_imagen: zod.string().url().optional()
});

// Defino el esquma de validación para el Login del usuario
export const SchemaLoginUser = zod.object({
    email_user: zod.string().email(),
    password_user: zod.string().min(6).max(100)
});

// Functión para validar los datos del usuario a la hora del registro
export function validateDataUser(data){
    if(!data) throw new Error("Los datos no fueron propocionados");
    return SchemaUser.safeParse(data)
};

// Function para validar los datos del usuario a la hora de hacer login
export function validateDataLoginUser(data){
    if(!data) throw new Error("Los datos no fueron propocionados");
    return SchemaLoginUser.safeParse(data)
}

// Function para validar los datos del usuario a la hora de actualizar
export function validateDataUpdateUser(data){
    if(!data) throw new Error("Los datos no fueron propocionados");
    return SchemaUser.partial().safeParse(data)
}