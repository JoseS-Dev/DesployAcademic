import {z} from "zod";

// Defino el esquema de validación para un curso
const SchemaCourse = z.object({
    instructor_id: z.number().int().positive(),
    title_course: z.string().min(3).max(100),
    slug_course: z.string().min(3).max(100),
    description_course: z.string().min(10).max(500),
    short_description: z.string().min(10).max(150),
    price_course: z.number().min(0),
    type_course: z.enum(['free', 'premium']),
    level_course: z.enum(['beginner', 'intermediate', 'advanced']),
    duration_course: z.number().min(1),
    thumbnail_course: z.string().url(),
    preview_video: z.string().url(),
});

// Función para validar los datos de un curso a la hora de crearlo
export function validateCourseData(courseData){
    if(!courseData) throw new Error("No course data provided");
    return SchemaCourse.safeParse(courseData);
}

// Función para validar los datos de un curso a la hora de actualizarlo
export function validateCourseUpdateData(courseData){
    if(!courseData) throw new Error("No course data provided");
    return SchemaCourse.partial().safeParse(courseData);
}