import zod from 'zod';

// Defino el schema para la validacion de secciones de cursos
export const SchemaCourseSection = zod.object({
    course_id: zod.string().uuid(),
    title: zod.string().min(3).max(100),
    description: zod.string().min(10).max(1000),
    section_order: zod.number().min(0),
    is_published: zod.boolean().optional(),
});

// Función para validar una sección de curso
export function validateCourseSection(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    return SchemaCourseSection.safeParse(data);
}
// Función para validar una sección de curso, si se va actualizar
export function validateCourseSectionUpdate(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    return SchemaCourseSection.partial().safeParse(data);
}