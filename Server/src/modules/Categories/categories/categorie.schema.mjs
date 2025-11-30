import {z} from "zod";

// Defino el esquema de validación para la categoria del curso
const SchemaCategorie = z.object({
    name_categorie: z.string().min(3).max(50),
    slug_categorie: z.string().min(3).max(50),
    description_categorie: z.string().min(10).max(300)
});

// Función que valida los datos de una categoria del curso
export function validateCategorieData(categorieData){
    if(!categorieData) throw new Error("No categorie data provided");
    return SchemaCategorie.safeParse(categorieData);
}

// Función que valida los datos de una categoria del curso para actualizaciones
export function validateCategorieUpdateData(categorieData){
    if(!categorieData) throw new Error("No categorie data provided");
    return SchemaCategorie.partial().safeParse(categorieData);
}