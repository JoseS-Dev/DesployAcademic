import { WithDBConnection } from "../../../core/utils/function.mjs";
import {db} from "../../../../database/db.mjs";

// Modelo que interectúa con la tabla sections_course de la base de datos
export class ModelSectionCourse {
    // Método para obtener todas las secciones de un curso por su ID
    static getSectionsByCourseId = WithDBConnection(async (courseId) => {
        if(!courseId) return {error: "El ID del curso es requerido"};
        // Se verifica que existan el curso
        const existingCourse = await db.query(
            'SELECT * FROM courses WHERE id = $1',
            [courseId]
        );
        if(existingCourse.rowCount === 0) return {error: "El curso no existe"};
        // Se obtienen las secciones del curso
        const sections = await db.query(
            `SELECT * FROM sections_course WHERE course_id = $1 ORDER BY section_order ASC`,
            [courseId]
        );
        return {
            message: "Secciones obtenidas correctamente",
            sections: sections.rows
        }
    });

    // Método para para cambiar el estado de publicación de una sección
    static toggleSectionPublication = WithDBConnection(async (courseId, newStatus) => {
        if(!courseId) return {error: "El ID de la sección es requerido"};
        if(typeof newStatus !== 'boolean') return {error: "El nuevo estado de publicación debe ser un booleano"};
        // Se verifica que exista la sección
        const existingSection = await db.query(
            `SELECT * FROM sections_course WHERE id = $1`,
            [courseId]
        );
        if(existingSection.rowCount === 0) return {error: "La sección no existe"};
        // Si existe, se actualiza su estado de publicación
        const updatedSection = await db.query(
            `UPDATE sections_course SET is_published = $1 WHERE id = $2`,
            [newStatus, courseId]
        );
        if(updatedSection.rowCount === 0) return {error: "No se pudo actualizar el estado de la sección"};
        return {
            message: "Estado de la sección actualizado correctamente"
        }
    });

    // Método para obtener una sección por su ID
    static getSectionByID = WithDBConnection(async (sectionId) => {
        if(!sectionId) return {error: "El ID de la sección es requerido"};
        // Se verifica que exista la sección
        const existingSection = await db.query(
            `SELECT * FROM sections_course WHERE id = $1`,
            [sectionId]
        );
        if(existingSection.rowCount === 0) return {error: "La sección no existe"};
        return {
            message: "Sección obtenida correctamente",
            section: existingSection.rows[0]
        }
    });

    // Método para crear una nueva sección de un curso
    static createSectionCourse = WithDBConnection(async (sectionData) => {
        if(!sectionData) return {error: "Los datos de la sección son requeridos"};
        const {course_id, ...restData} = sectionData;
        // Se verifica que exista el curso
        const existingCourse = await db.query(
            'SELECT * FROM courses WHERE id = $1',
            [course_id]
        );
        if(existingCourse.rowCount === 0) return {error: "El curso no existe"};
        // Además, se verifica si ya existe una sección con el mismo título en ese curso
        const existingSection = await db.query(
            `SELECT * FROM sections_course WHERE course_id = $1 AND title_section = $2`,
            [course_id, restData.title_section]
        );
        if(existingSection.rowCount > 0) return {error: "Ya existe una sección con ese título en este curso"};
        // Si todo es correcto, se crea la nueva sección
        const newSection = await db.query(
            `INSERT INTO sections_course (course_id, title_section, description_section, section_order)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                course_id, restData.title_section, 
                restData.description_section, 
                restData.section_order
            ]
        );
        if(newSection.rowCount === 0) return {error: "No se pudo crear la sección"};
        return {
            message: "Sección creada correctamente",
            section: newSection.rows[0]
        }
    });

    // Método para actualizar una sección de un curso
    static updateSectionCourse = WithDBConnection(async (sectionId, sectionData) => {
        if(!sectionId || !sectionData) return {error: "El ID de la sección y los datos son requeridos"};
        const allowedFields = ['title_section', 'description_section', 'section_order'];
        const fieldsToUpdate = {};
        for(const field of allowedFields){
            if(sectionData[field] !== undefined){
                fieldsToUpdate[field] = sectionData[field];
            }
        };

        // Se verifica que exista la sección
        const existingSection = await db.query(
            `SELECT * FROM sections_course WHERE id = $1`,
            [sectionId]
        );
        if(existingSection.rowCount === 0) return {error: "La sección no existe"};

        // Si existe, se procede a actualizarla
        const fields = [];
        const values = [];

        Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(sectionId); // Agrego el ID de la sección al final para la cláusula WHERE
        const updatedSection = await db.query(
            `UPDATE sections_course SET ${fields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        if(updatedSection.rowCount === 0) return {error: "No se pudo actualizar la sección"};
        return {
            message: "Sección actualizada correctamente"
        }
    });

    // Método para eliminar una sección de un curso
    static deleteSectionCourse = WithDBConnection(async (sectionId) => {
        if(!sectionId) return {error: "El ID de la sección es requerido"};
        // Se verifica que exista la sección
        const existingSection = await db.query(
            `SELECT * FROM sections_course WHERE id = $1`,
            [sectionId]
        );
        if(existingSection.rowCount === 0) return {error: "La sección no existe"};
        // Si existe, se procede a eliminarla
        const deletedSection = await db.query(
            `DELETE FROM sections_course WHERE id = $1`,
            [sectionId]
        );
        if(deletedSection.rowCount === 0) return {error: "No se pudo eliminar la sección"};
        return {
            message: "Sección eliminada correctamente"
        }
    });
}