// Defino el servicio de los recursos de las lecciones
import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils";

export class ServiceResources{
    // Servicio para obtener todos los recursos de una lección
    getAllResourcesByLessonId = async(lessonId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/resources/lesson/${lessonId}/all`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.resources
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para obtener un recurso por su ID
    getResourceById = async(resourceId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/resources/resource/${resourceId}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.resource
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para crear un recurso para una lección
    createResource = async(resourceData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/resources/create`, {
                method: 'POST',
                body: resourceData
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.resource
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para actualizar un recurso por su ID
    updateResource = async(resourceId: number, resourceData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/resources/resource/${resourceId}/update`, {
                method: 'PATCH',
                body: resourceData
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

    // Servicio para eliminar un recurso por su ID
    deleteResource = async(resourceId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/resources/resource/${resourceId}/delete`, {
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