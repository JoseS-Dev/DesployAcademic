import zod from 'zod';

// Defino el schema para la validacion de instructores
export const SchemaInstructor = zod.object({
    user_id: zod.uuid(),
    profile_picture: zod.string().url().optional(),
    description: zod.string().min(10).max(1000),
    website: zod.string().url().optional(),
    social_links: zod.array(zod.string().url()).optional(),
});

// Función para validar un instructor
export function validateInstructor(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    return SchemaInstructor.safeParse(data);
}

// Función para validar un instructor, si se va actualizar
export function validateInstructorUpdate(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    return SchemaInstructor.partial().safeParse(data);
}
