import {z} from "zod";

// Defino el esuqem ade validación para el desarrollo de un estudiante en un curso
const EnrollmentSchema = z.object({
    user_id: z.number().int().positive(),
    course_id: z.number().int().positive(),
    progress_percentage: z.number().min(0).max(100).optional().default(0),
    completed_at: z.string().refine((date) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
    }).transform((date) => new Date(date)).optional()
});

// Defino la función qeu valida los datos de inscripción de un estudiante en un curso
export function validateEnrollment(data){
    if(!data) throw new Error("No data provided for enrollment validation");
    return EnrollmentSchema.safeParse(data);
}

// Defino la función que valida los datos de incripción a la hora de actualizar el progreso
export function validateEnrollmentUpdate(data){
    if(!data) throw new Error("No data provided for enrollment update validation");
    return EnrollmentSchema.partial().safeParse(data);
}