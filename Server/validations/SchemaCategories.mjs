import zod from 'zod';

// Defino el schema para la validacion de categorias
const SchemaCategory = zod.object({
    name: zod.string().min(3),
    description: zod.string().min(10).optional()
});

// Function que valida la creacion de una categoria
export function validateCategory(data){
    if(!data) return {error: 'Los datos no fueron proporcionados'};
    return SchemaCategory.safeParse(data);
}