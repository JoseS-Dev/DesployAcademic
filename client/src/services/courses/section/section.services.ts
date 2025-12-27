// Defino el servicio para las secciones de los cursos
import type { CreateSection } from "../../../interfaces";


    // Servicio para obtener todas las secciones de un curso
export const getSectionsByCourseId = async(courseId: number) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/sections/course/${courseId}/all`);
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
}

    // Servicio para obtener una sección por su ID
export const getSectionById = async(sectionId: number) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/sections/section/${sectionId}`);
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
}

    // Servicio para cambiar el estado de publicación de una sección
export const changeSectionPublishStatus = async(sectionId: number, publishStatus: boolean) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/sections/section/${sectionId}/toggle-publication`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_published: publishStatus })
            });
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
}

    // Servicio para crear una nueva sección en un curso
export const createSection = async(sectionData: CreateSection) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/sections/create`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(sectionData)
            });
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
}

    // Servicio para actualizar una sección de un curso
export const updateSection = async(sectionId: number, sectionData: Partial<CreateSection>) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/sections/section/${sectionId}/update`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(sectionData)
            });
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
}

    // Servicio para eliminar una sección de un curso
export const deleteSection = async(sectionId: number) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/courses/sections/section/${sectionId}/delete`, {
                method: 'DELETE'
            });
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
}
