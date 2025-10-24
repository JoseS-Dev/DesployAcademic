import zod from 'zod';

// Defino el schema para la validacion de cursos con instructores
export const SchemaCourseInstructor = zod.object({
    course_id: zod.string().uuid(),
    instructor_id: zod.string().uuid(),
    is_primary: zod.boolean().optional(),
});

// Función para validar la asignación de un instructor a un curso
export function validateCourseInstructor(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    return SchemaCourseInstructor.safeParse(data);
}

// Función para validar la actualización de la asignación de un instructor a un curso
export function validateCourseInstructorUpdate(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    return SchemaCourseInstructor.partial().safeParse(data);
}

// Función para validar el establecimiento de un instructor principal en un curso
export function validatePrimaryInstructor(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    const SchemaPrimaryInstructor = zod.object({
        course_id: zod.string().uuid(),
        instructor_id: zod.string().uuid(),
    });
    return SchemaPrimaryInstructor.safeParse(data);
}