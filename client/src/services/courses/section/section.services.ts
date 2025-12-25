// Defino el servicio para las secciones de los cursos
import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils";
import type { CreateSection } from "../../../interfaces";

export class ServiceSections{
    // Servicio para obtener todas las secciones de un curso
    getSectionsByCourseId = async(courseId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/sections/course/${courseId}/all`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.sections
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para obtener una sección por su ID
    getSectionById = async(sectionId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/sections/section/${sectionId}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.section
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para cambiar el estado de publicación de una sección
    changeSectionPublishStatus = async(sectionId: number, publishStatus: boolean) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/sections/section/${sectionId}/toggle-publication`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_published: publishStatus })
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para crear una nueva sección en un curso
    createSection = async(sectionData: CreateSection) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/sections/create`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(sectionData)
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.section
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para actualizar una sección de un curso
    updateSection = async(sectionId: number, sectionData: Partial<CreateSection>) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/sections/section/${sectionId}/update`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(sectionData)
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.section
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para eliminar una sección de un curso
    deleteSection = async(sectionId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/sections/section/${sectionId}/delete`, {
                method: 'DELETE'
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }
}