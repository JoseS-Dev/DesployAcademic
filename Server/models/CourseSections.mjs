import slugify from 'slugify';
import { db } from '../database/db.mjs';
import { WithDBConnection } from '../utils.mjs';
import pkg from 'lodash';

const { omit } = pkg;

export class ModelCourseSections {
    // método que obtiene todas las secciones de un curso
    static getSectionsByCourseId = WithDBConnection(async ({ courseId }) => {
        if (!courseId) return { error: 'No se proporcionó un ID de curso' };
        const sections = await db.query(
            `SELECT * FROM course_sections WHERE course_id = $1`,
            [courseId]
        );
        if (sections.rowCount === 0) return { error: 'No se encontraron secciones para este curso' };
        return { sections: omit(sections.rows, [['id', 'course_id']]), message: 'Secciones obtenidas correctamente' };
    });

    //metodo que obtiene una sección por su ID
    static getSectionById = WithDBConnection(async ({ sectionId }) => {
        if (!sectionId) return { error: 'No se proporcionó un ID de sección' };
        const section = await db.query(
            `SELECT * FROM course_sections WHERE id = $1`,
            [sectionId]
        );
        if (section.rowCount === 0) return { error: 'No se encontró la sección' };
        return { section: omit(section.rows[0], ['id', 'course_id']), message: 'Sección obtenida correctamente' };
    });

    // método que crea una nueva sección en un curso
    static createSection = WithDBConnection(async ({ courseId, sectionData }) => {
        if (!courseId || !sectionData) {
            return { error: 'Datos incompletos para crear sección' };
        }
        const { course_id, title, description, section_order, is_published } = sectionData;
        const newSection = await db.query(
            `INSERT INTO course_sections (course_id, title, description, section_order, is_published)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [courseId, title, description, section_order, is_published]
        );

        if (newSection.rowCount === 0) {
            return { error: 'No se pudo crear la sección' };
        }
        return { section: omit(newSection.rows[0], ['id', 'course_id']), message: 'Sección creada correctamente' };
    });

    // método que actualiza una sección existente
    static updateSection = WithDBConnection(async ({ sectionId, sectionData }) => {
        if (!sectionId || !sectionData) {
            return { error: 'Datos incompletos para actualizar sección' };
        }
        const allowedFields = ['title', 'description', 'position', 'is_published'];

        //verifica que exista la sección
        const existingSection = await db.query(
            `SELECT * FROM course_sections WHERE id = $1`,
            [sectionId]
        );
        if (existingSection.rowCount === 0) {
            return { error: 'La sección no existe' };
        }

        // Construir la consulta de actualización dinámicamente
        const setClauses = [];
        const values = [];
        let index = 1;
        for (const field of allowedFields) {
            if (sectionData[field] !== undefined) {
                setClauses.push(`${field} = $${index}`);
                values.push(sectionData[field]);
                index++;
            }
        }

        if (setClauses.length === 0) {
            return { error: 'No se proporcionaron campos válidos para actualizar' };
        }

        setClauses.push(`updated_at = NOW()`);
        values.push(sectionId);

        const updatedSection = await db.query(
            `UPDATE course_sections SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`,
            values
        );
        if (updatedSection.rowCount === 0) {
            return { error: 'No se pudo actualizar la sección' };
        }
        return { section: omit(updatedSection.rows[0], ['id', 'course_id']), message: 'Sección actualizada correctamente' };
    });

    // método que elimina una sección por su ID
    static deleteSection = WithDBConnection(async ({ sectionId }) => {
        if (!sectionId) return { error: 'No se proporcionó un ID de sección' };
        const deletedSection = await db.query(
            `DELETE FROM course_sections WHERE id = $1 RETURNING *`,
            [sectionId]
        );
        if (deletedSection.rowCount === 0) return { error: 'No se pudo eliminar la sección' };
        return { message: 'Sección eliminada correctamente' };
    });

    // método que elimina todas las secciones de un curso
    static deleteSectionsByCourseId = WithDBConnection(async ({ courseId }) => {
        if (!courseId) return { error: 'No se proporcionó un ID de curso' };
        const deletedSections = await db.query(
            `DELETE FROM course_sections WHERE course_id = $1`,
            [courseId]
        );
        return { message: 'Secciones del curso eliminadas correctamente' };
    });

    // método que reordena las secciones de un curso
    static reorderSections = WithDBConnection(async ({ courseId, newOrder }) => {
        if (!courseId || !Array.isArray(newOrder)) {
            return { error: 'Datos incompletos para reordenar secciones' };
        }
        for (let i = 0; i < newOrder.length; i++) {
            const sectionId = newOrder[i];
            await db.query(
                `UPDATE course_sections SET section_order = $1 WHERE id = $2 AND course_id = $3`,
                [i + 1, sectionId, courseId]
            );
        }
        return { message: 'Secciones reordenadas correctamente' };
    });

}