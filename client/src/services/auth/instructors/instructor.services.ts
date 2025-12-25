// Defino el servicio para los instructores
import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils";

export class ServiceInstructors {
    // Servicio para obtener a todos los instructores
    getInstructors = async () => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/instructors/all`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.instructors
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para obtener un perfil de un instructor por su ID
    getInstructorById = async (instructorId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/instructors/instructor/${instructorId}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.instructor
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para obtener un instructor por su categoria
    getInstructorsByCategory = async (categoryInstructor: string) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/instructors/category/${categoryInstructor}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.instructors
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para crear un instructor
    createInstructor = async (instructorData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/instructors/create-profile`, {
                method: 'POST',
                body: instructorData
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.instructor
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para actualizar un instructor
    updateInstructor = async (instructorId: number, instructorData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/instructors/update-profile/${instructorId}`, {
                method: 'PATCH',
                body: instructorData
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

    // Servicio para seguir a un instructor
    followInstructor = async (instructorId: number, userId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/instructors/follow/instructor/${instructorId}/user/${userId}`, {
                method: 'POST'
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

    // Servicio para eliminar un perfil de un instructor
    deleteInstructor = async (instructorId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/instructors/delete-profile/${instructorId}`, {
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