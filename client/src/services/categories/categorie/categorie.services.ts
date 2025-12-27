import type { CreateCategory } from "../../../interfaces";


    // Servicio para obtener todas las categorias de los cursos
    export const getAllCategories = async() => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/categories/all`);
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
    }

    // Servicio para crear una nueva categoria de curso
    export const createCategory = async(categorieData: CreateCategory) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/categories/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categorieData)
            });
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
    }

    // Servicio para obtener una categoria por su ID
    export const getCategoryById = async(categorieId: number) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/categories/categorie/${categorieId}`);
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
    }

    // Servicio para actualizar una categoria por su ID
    export const updateCategory = async(categorieId: number, categorieData: CreateCategory) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/categories/categorie/${categorieId}/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categorieData)
            });
            if(!response.ok) throw new Error('Error del servidor');
            const result = await response.json();
            return result;
        }
        catch(error){
            throw new Error('Error del servidor');
        }
    }

    // Servicio para eliminar una categoria por su ID
    export const deleteCategory = async(categoryId: number) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/categories/categorie/${categoryId}/delete`, {
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
