import {z} from "zod";

// Defino el esquema de validación para una sección de curso
const SchemaSectionCourse = z.object({
    course_id: z.number().int().positive(),
    title_section: z.string().min(3).max(100),
    description_section: z.string().min(10).max(500),
    section_order: z.number().int().min(1),
});

// Función que valida los datos de una sección de un curso
export function validateSectionCourseData(sectionData){
    if(!sectionData) throw new Error("No section data provided");
    return SchemaSectionCourse.safeParse(sectionData);
}

// Función que valida los datos de una sección de un curso para actualizaciones
export function validateSectionCourseUpdateData(sectionData){
    if(!sectionData) throw new Error("No section data provided");
    return SchemaSectionCourse.partial().safeParse(sectionData);
}