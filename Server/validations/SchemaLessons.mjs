import zod from 'zod';

export const SchemaLesson = zod.object({
    section_id: zod.number().int().positive(),
    title: zod.string().min(3).max(255),
    description: zod.string().min(10).max(2000).optional(),
    video_url: zod.string().url(),
    video_duration: zod.number().int().positive().optional(),
    thumbnail_url: zod.string().url().optional(),
    lesson_order: zod.number().int().positive(),
    lesson_type: zod.enum(['video', 'article', 'quiz', 'assignment', 'live_session']),
    is_preview: zod.boolean().optional(),
    is_published: zod.boolean().optional(),
    updated_at: zod.date()

});

// funcion para validar una lección
export function validateLesson(data) {
    if (!data) return { error: 'No se proporcionaron datos de la lección' };
    return SchemaLesson.safeParse(data);
}

// función para validar una lección si se va a actualizar
export function validateLessonUpdate(data) {
    if (!data) return { error: 'No se proporcionaron datos de la lección' };
    return SchemaLesson.partial().safeParse(data);
}
