import {z} from "zod";

// Defino el esquema de validación para un recurso de una lección
const ResourceSchema = z.object({
    lesson_id: z.number().int().positive(),
    title_resource: z.string().min(1).max(255),
    file_url: z.string().url().optional(),
    file_type: z.enum(['video', 'document', 'audio', 'other']),
    file_size: z.number().int().positive().optional()
});

// Función para validar un recurso de una lección a la hora de registrarlo
export function validateResource(data){
    if(!data) throw new Error("No data provided for validation");
    return ResourceSchema.safeParse(data);
}

// Función para validar un recurso de una lección a la hora de actualizarlo
export function validateResourceUpdate(data){
    if(!data) throw new Error("No data provided for validation");
    return ResourceSchema.partial().safeParse(data);
}