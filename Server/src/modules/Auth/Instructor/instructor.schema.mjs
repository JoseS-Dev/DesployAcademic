import zod from "zod";

// Defino el esquema de validación de loscampos que contiene social_links
const SchemaSocialLink = zod.object({
    platform: zod.string().min(2).max(50),
    url: zod.string().url()
})

// Defino el esquema de datos de validación para los instructores del sistema
const SchemaInstructor = zod.object({
    user_id: zod.number().int().positive(),
    description_instructor: zod.string().max(500).optional(),
    profile_picture: zod.string().url().optional(),
    website: zod.string().url().optional(),
    social_links: zod.array(SchemaSocialLink).optional(),
    category_instructor: zod.string().min(2).max(100)
});

// Functión para validar los datos de un instructor
export function validateInstructor(data){
    if(!data) throw new Error('No data provided for validation');
    return SchemaInstructor.safeParse(data);
}

// Functión para validar los datos de actaulización de un instructor
export function validateDataUpdateInstructor(data){
    if(!data) throw new Error('No data provided for validation');
    return SchemaInstructor.partial().safeParse(data);
}