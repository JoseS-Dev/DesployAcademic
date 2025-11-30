import { WithDBConnection } from "../../../../core/utils/function.mjs";
import { db } from "../../../../../database/db.mjs";

// Modelo que interactúa con la tabla resources_lesson de la base de datos
export class ResourceModel {
    // Método que obtiene todos los recursos de una lección especifica
    static getAllResourcesByLessonId = WithDBConnection(async(lessonId) => {
        if(!lessonId) return {error: "El ID de la lección es requerido"};
        // Se verifica si existe la lección
        const existingLesson = await db.query(
            `SELECT * FROM lessons_course WHERE id = $1`,
            [lessonId]
        );
        if(existingLesson.rowCount === 0) return {error: "La lección no existe"};
        // Si existe, se obtienen los recursos asociados a la lección
        const resources = await db.query(
            `SELECT * FROM resources_lesson WHERE lesson_id = $1`,
            [lessonId]
        );
        if(resources.rowCount === 0) return {error: "No se encontraron recursos para esta lección"};
        return {
            message: "Recursos obtenidos exitosamente",
            resources: resources.rows
        }
    });

    // Método para obtener una lección por su ID
    static getResourceById = WithDBConnection(async (resourceId) => {
        if(!resourceId) return {error: "El ID del recurso es requerido"};
        // Se verifica si existe el recurso
        const existingResource = await db.query(
            `SELECT * FROM resources_lesson WHERE id = $1`,
            [resourceId]
        );
        if(existingResource.rowCount === 0) return {error: "El recurso no existe"};
        return {
            message: "Recurso obtenido exitosamente",
            resource: existingResource.rows[0]
        }
    });

    // Método para crear un nuevo recurso de una lección
    static createResource = WithDBConnection(async (resourceData) => {
        if(!resourceData) return {error: "Los datos del recurso son requeridos"};
        const {lesson_id, ...rest} = resourceData;
        // Se verifica si existe la lección
        const existingLesson = await db.query(
            `SELECT * FROM lessons_course WHERE id = $1`,
            [lesson_id]
        );
        if(existingLesson.rowCount === 0) return {error: "La lección no existe"};
        // Si existe, se crea el recurso
        const newResource = await db.query(
            `INSERT INTO resources_lesson (lesson_id, title_resource, file_url, file_type, file_size)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                lesson_id, rest.title_resource, 
                rest.file_url, rest.file_type, 
                rest.file_size
            ]
        );
        if(newResource.rowCount === 0) return {error: "No se pudo crear el recurso"};
        return {
            message: "Recurso creado exitosamente",
            resource: newResource.rows[0]
        }
    })

    // Método para actualizar un recurso de una lección
    static updateResource = WithDBConnection(async (resourceId, dataUpdate) => {
        if(!resourceId || !dataUpdate) return {error: "El ID del recurso y los datos a actualizar son requeridos"};
        const allowedFields = ['title_resource', 'file_url', 'file_type', 'file_size'];
        const fielsToUpdate = {};
        for(const field of allowedFields){
            if(dataUpdate[field] !== undefined){
                fielsToUpdate[field] = dataUpdate[field];
            }
        }

        // Se verifica si existe el recurso
        const existingResource = await db.query(
            `SELECT * FROM resources_lesson WHERE id = $1`,
            [resourceId]
        );
        if(existingResource.rowCount === 0) return {error: "El recurso no existe"};
        // Si existe, se procede a actualizarlo
        const fields = [];
        const values = [];

        Object.entries(fielsToUpdate).forEach(([key, value], index) => {
            fields.push(`${key} = $${index + 1}`);
            values.push(value);
        });
        values.push(resourceId); // Agregar el ID del recurso al final para la cláusula WHERE
        const updatedResource = await db.query(
            `UPDATE resources_lesson SET ${fields.join(', ')} WHERE id = $${values.length}`,
            values
        );
        if(updatedResource.rowCount === 0) return {error: "No se pudo actualizar el recurso"};
        return {
            message: "Recurso actualizado exitosamente"
        }
    })

    // Método para eliminar un recurso de una lección
    static deleteResource = WithDBConnection(async (resourceId) => {
        if(!resourceId) return {error: "El ID del recurso es requerido"};
        // Se verifica si existe el recurso
        const existingResource = await db.query(
            `SELECT * FROM resources_lesson WHERE id = $1`,
            [resourceId]
        );
        if(existingResource.rowCount === 0) return {error: "El recurso no existe"};
        // Si existe, se procede a eliminarlo
        const deletedResource = await db.query(
            `DELETE FROM resources_lesson WHERE id = $1`,
            [resourceId]
        );
        if(deletedResource.rowCount === 0) return {error: "No se pudo eliminar el recurso"};
        return {
            message: "Recurso eliminado exitosamente"
        }
    })
}