// Defino el servicio de las categorias de los cursos
import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils";
import type { CreateCategory } from "../../../interfaces";

export class ServiceCategories{
    // Servicio para obtener todas las categorias de los cursos
    getAllCategories = async() => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/categories/all`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.categories
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para crear una nueva categoria de curso
    createCategory = async(categorieData: CreateCategory) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/categories/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categorieData)
            });
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.category
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para obtener una categoria por su ID
    getCategoryById = async(categorieId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/categories/categorie/${categorieId}`);
            if(!response.ok) return {success: false, data: null};
            const result = await response.json();
            if(result.error) return {success: false, error: result.error};
            return {
                success: true,
                message: result.message,
                data: result.categorie
            }
        }
        catch(error){
            return {success: false, error: 'Error del servidor'};
        }
    }

    // Servicio para actualizar una categoria por su ID
    updateCategory = async(categorieId: number, categorieData: CreateCategory) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/categories/categorie/${categorieId}/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categorieData)
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

    // Servicio para eliminar una categoria por su ID
    deleteCategory = async(categoryId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/categories/categorie/${categoryId}/delete`, {
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