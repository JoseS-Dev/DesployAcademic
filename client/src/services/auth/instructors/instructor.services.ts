
// Servicio para obtener a todos los instructores
export const getInstructors = async () => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/instructors/all`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para obtener un perfil de un instructor por su ID
export const getInstructorById = async (instructorId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/instructors/instructor/${instructorId}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para obtener un instructor por su categoria
export const getInstructorsByCategory = async (categoryInstructor: string) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/instructors/category/${categoryInstructor}`);
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para crear un instructor
export const createInstructor = async (instructorData: FormData) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/instructors/create-profile`, {
            method: 'POST',
            body: instructorData
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para actualizar un instructor
export const updateInstructor = async (instructorId: number, instructorData: FormData) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/instructors/update-profile/${instructorId}`, {
            method: 'PATCH',
            body: instructorData
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para seguir a un instructor
export const followInstructor = async (instructorId: number, userId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/instructors/follow/instructor/${instructorId}/user/${userId}`, {
            method: 'POST'
        });
        if(!response.ok) throw new Error('Error del servidor');
        const result = await response.json();
        return result;
    }
    catch(error){
        throw new Error('Error del servidor');
    }
}
// Servicio para eliminar un perfil de un instructor
export const deleteInstructor = async (instructorId: number) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/instructors/delete-profile/${instructorId}`, {
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
