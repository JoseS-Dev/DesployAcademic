import { WithDBConnection } from "../../../core/utils/function.mjs";
import { db } from "../../../../database/db.mjs";

// Modelo que interactúa con la tabla categories_course de la base de datos
export class CategorieModel {
    // Método para crear una categoria de curso
    static createCategorie = WithDBConnection(async (categorieData) => {
        if(!categorieData) return {error: "Los datos de la categoría son requeridos"};
        const {name_categorie, slug_categorie, description_categorie} = categorieData;
        // Se verifica si ya existe una categoria cons el mimo slug
        const existingCategorie = await db.query(
            `SELECT * FROM categories_course WHERE slug_categorie = $1`,
            [slug_categorie]
        );
        if(existingCategorie.rowCount > 0) return {error: "Ya existe una categoría con este slug"};
        // Si no existe, se crea la categoria
        const newCategorie = await db.query(
            `INSERT INTO categories_course (name_categorie, slug_categorie, description_categorie)
            VALUES ($1, $2, $3) RETURNING *`,
            [
                name_categorie, slug_categorie, description_categorie
            ]
        );
        if(newCategorie.rowCount === 0) return {error: "No se pudo crear la categoría"};
        return {
            message: "Categoría creada exitosamente",
            categorie: newCategorie.rows[0]
        }
    });

    // Método para actualizar una categoria de curso
    static updateCategorie = WithDBConnection(async (categorieId, dataUpdate) => {
        if(!categorieId || !dataUpdate) return {error: "El ID de la categoría y los datos a actualizar son requeridos"};
        const allowedFields = ['name_categorie', 'slug_categorie', 'description_categorie'];
        const fielsToUpdate = {};
        for(const field of allowedFields){
            if(dataUpdate[field] !== undefined){
                fielsToUpdate[field] = dataUpdate[field];
            }
        }
        // Se verifica que exista la categoria
        const existingCategorie = await db.query(
            `SELECT * FROM categories_course WHERE id = $1`,
            [categorieId]
        );
        if(existingCategorie.rowCount === 0) return {error: "La categoría no existe"};
        // Si existe, se procede a actualizarla
        const fields = [];
        const values = [];

        Object.entries(fielsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        })
        values.push(categorieId);
        const updatedCategorie = await db.query(
            `UPDATE categories_course SET ${fields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        if(updatedCategorie.rowCount === 0) return {error: "No se pudo actualizar la categoría"};
        return {
            message: "Categoría actualizada exitosamente"
        }
    });

    // Método para obtener todas las categorías de cursos
    static getAllCategories = WithDBConnection(async () => {
        const categories = await db.query(
            `SELECT * FROM categories_course ORDER BY id ASC`
        );
        if(categories.rowCount === 0) return {error: "No hay categorías disponibles"};
        return {
            message: "Categorías obtenidas exitosamente",
            categories: categories.rows
        }
    });

    // Método para obtener una categoría por su ID
    static getCategorieById = WithDBConnection(async (categorieId) => {
        if(!categorieId) return {error: "El ID de la categoría es requerido"};
        // Se verifica que exista la categoría
        const existingCategorie = await db.query(
            `SELECT * FROM categories_course WHERE id = $1`,
            [categorieId]
        );
        if(existingCategorie.rowCount === 0) return {error: "La categoría no existe"};
        return {
            message: "Categoría obtenida exitosamente",
            categorie: existingCategorie.rows[0]
        }
    });

    // Método para eliminar una categoría de curso
    static deleteCategorie = WithDBConnection(async(categorieId) => {
        if(!categorieId) return {error: "El ID de la categoría es requerido"};
        // Se verifica que exista la categoría
        const existingCategorie = await db.query(
            `SELECT * FROM categories_course WHERE id = $1`,
            [categorieId]
        );
        if(existingCategorie.rowCount === 0) return {error: "La categoría no existe"};
        // Si existe, se procede a eliminarla
        const deletedCategorie = await db.query(
            `DELETE FROM categories_course WHERE id = $1`,
            [categorieId]
        );
        if(deletedCategorie.rowCount === 0) return {error: "No se pudo eliminar la categoría"};
        return {
            message: "Categoría eliminada exitosamente"
        }
    })
}