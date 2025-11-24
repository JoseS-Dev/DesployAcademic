import {z} from "zod";

// Defino el esquema de validación para uan lección de una sección de un curso
const SchemaLessonCourse = z.object({
    section_id: z.number().int().positive(),
    title_lesson: z.string().min(3).max(100),
    description_lesson: z.string().min(10).max(500),
    video_url: z.string().url(),
    thumbail_url: z.string().url(),
    lesson_order: z.number().int().min(1),
    lesson_type: z.enum(['video', 'quiz', 'article']),
});

// Función que valida los datos de una lección de una sección de un curso
export function validateLessonCourseData(lessonData){
    if(!lessonData) throw new Error("No lesson data provided");
    return SchemaLessonCourse.safeParse(lessonData);
}

// Función que valida los datos de una lección de una sección de un curso para actualizaciones
export function validateLessonCourseUpdateData(lessonData){
    if(!lessonData) throw new Error("No lesson data provided");
    return SchemaLessonCourse.partial().safeParse(lessonData);
}