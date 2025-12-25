// Servicio para las lecciones de las secciones de los cursos
import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils";

export class ServiceLessons{
    // Servicio para obtener todas las lecciones de una sección
    getLessonsBySectionId = async(sectionId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/section/${sectionId}/all`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.lessons
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para obtener una lección por su ID
    getLessonById = async(lessonId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/lesson/${lessonId}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.lesson
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para obtener las lecciones gratuitas de una sección
    getFreeLessonsBySectionId = async(sectionId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/section/${sectionId}/free-lessons`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.lessons
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para cambiar el estado de acceso gratuito de una lección
    changeLessonFreeAccessStatus = async(lessonId: number, freeAccess: boolean) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/lesson/${lessonId}/change-free-access`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_preview: freeAccess })
            })
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

    // Servicio para cambiar el estado de publicación de una lección
    changeLessonPublishStatus = async(lessonId: number, publishStatus: boolean) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/lesson/${lessonId}/change-status`, {
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

    // Servicio para crear una nueva lección en una sección
    createLesson = async(lessonData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/create`, {
                method: 'POST',
                body: lessonData
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.lesson
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para actualizar una lección de una sección
    updateLesson = async(lessonId: number, lessonData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/lesson/${lessonId}/update`, {
                method: 'PATCH',
                body: lessonData
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

    // Servicio para eliminar una lección de una sección
    deleteLesson = async(lessonId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/courses/lessons/lesson/${lessonId}/delete`, {
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
