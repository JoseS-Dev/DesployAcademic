import { db } from "../database/db.mjs";
import { WithDBConnection } from "../utils.mjs";

export class ModelCategory {
    // método que obtiene todas las categorias
    static getAllCategories = WithDBConnection(async () => {
        const allCategory = await db.query(`SELECT * FROM categories`);
        if(allCategory.rowCount === 0) return { error: 'No se encontraron categorias' };
        return {categories: allCategory.rows, message: 'Categorias obtenidas exitosamente' };
    });

    // método para crear una nueva categoria
    static createCategory = WithDBConnection(async ({ categoryData}) => {
        if(!categoryData) return { error: 'No se proporcionaron datos de la categoria' };
        const {name, description } = categoryData;
        // Se verifica si ya existe una categoria con ese nombre
        const existingCategory = await db.query(
            `SELECT id FROM categories WHERE name = $1`,
            [name]
        );
        if(existingCategory.rowCount > 0) return { error: 'Ya existe una categoria con ese nombre' };
        // Si no existe, se procede a crear la nueva categoria
        const newCategory = await db.query(
            `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
            [name, description]
        );
        if(newCategory.rowCount === 0) return { error: 'No se pudo crear la categoria' };
        return { category: newCategory.rows[0], message: 'Categoria creada exitosamente' };
    });

    // método para asignar una categoria a un curso
    static assignCategoryToCourse = WithDBConnection(async ({ courseId, categoryId}) => {
        if(!courseId || !categoryId) return { error: 'Faltan datos para asignar la categoria al curso' };
        // Se verifica sie xiste el curso y la categoria
        const courseCheck = await db.query(`SELECT id FROM courses WHERE id = $1`, [courseId]);
        const categoryCheck = await db.query(`SELECT id FROM categories WHERE id = $1`, [categoryId]);
        if(courseCheck.rowCount === 0 || categoryCheck.rowCount === 0){
            return { error: 'El curso o la categoria no existen' };
        }
        // Si existen, se procede a asignar la categoria al curso
        const assigment = await db.query(
            `INSERT INTO course_categories (course_id, category_id) VALUES ($1, $2)`,
            [courseId, categoryId]
        );
        if(assigment.rowCount === 0) return { error: 'No se pudo asignar la categoria al curso' };
        return { message: 'Categoria asignada al curso exitosamente' };
    });

    // método para obtener todas las categorias de un curso
    static getCategoriesOfCourse = WithDBConnection(async ({courseId}) => {
        if(!courseId) return { error: 'No se proporcionó un ID de curso' };
        const categories = await db.query(
            `SELECT CC.*, C.name FROM courses_categories CC
            JOIN categories C ON CC.category_id = C.id
            WHERE CC.course_id = $1`,
            [courseId]
        );
        if(categories.rowCount === 0) return { error: 'No se encontraron categorias para este curso' };
        return { categories: categories.rows, message: 'Categorias obtenidas exitosamente' };
    })

    // Método para eliminar una categoria de un curso
    static removeCategoryFromCourse = WithDBConnection(async ({courseId, categoryId}) => {
        if(!courseId || !categoryId){
            return { error: 'Faltan datos para eliminar la categoria del curso' };
        }
        // Se verifica si existe la asignación
        const assigmentCheck = await db.query(
            `SELECT * FROM course_categories WHERE course_id = $1 AND category_id = $2`,
            [courseId, categoryId]
        );
        if(assigmentCheck.rowCount === 0){
            return { error: 'La categoria no está asignada a este curso' };
        }
        // Si existe, se procede a eliminar la asignación
        await db.query(
            `DELETE FROM course_categories WHERE course_id = $1 AND category_id = $2`,
            [courseId, categoryId]
        );
        return { message: 'Categoria eliminada del curso exitosamente' };
    })
}