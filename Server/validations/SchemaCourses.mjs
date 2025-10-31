
import zod from 'zod';

// Defino el schema para la validacion de cursos
export const SchemaCourse = zod.object({
    title: zod.string().min(3).max(100),
    description: zod.string().min(10).max(1000),
    short_description: zod.string().min(10).max(255),
    slug: zod.string().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    price: zod.number().min(0),
    level: zod.enum(['beginner', 'intermediate', 'advanced']),
    course_type: zod.enum(['free', 'premium']),
    duration_hours: zod.number().min(1),
    thumbnail_url: zod.string().url().optional(),
    preview_video_url: zod.string().url().optional(),
    is_published: zod.boolean().optional(),
    total_reviews: zod.number().min(0).optional(),
    total_students: zod.number().min(0).optional(),
    is_approved: zod.boolean().optional(),
    updated_at: zod.date().optional(),
    average_rating: zod.number().min(0).max(5).optional(),
});

// Función para validar un curso
export function validateCourse(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    return SchemaCourse.safeParse(data);
}

// Función para validar un curso, si se va actualizar
export function validateCourseUpdate(data) {
    if (!data) return { error: 'Los datos no fueron proporcionados' };
    return SchemaCourse.partial().safeParse(data);
}