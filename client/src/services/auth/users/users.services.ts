import { LIST_CONSTANTS } from "../../../utils/constants/constant.utils"
import { authFetch } from "../../../utils/functions/functions.utils";
import type { RegisterUser, LoginUser } from "../../../interfaces";
// Clase para manejar los servicios relacionados con los usuarios
export class ServiceUsers {
    // Servicio para obtener a todos los usuarios del sistema (admin)
    getAllUsers = async () => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/users/all`);
            if(!response.ok) return { success: false, data: null}
            const result = await response.json();
            if(result.error) return { success: false, error: result.error }
            return {
                success: true,
                message: result.message,
                data: result.users
            }
        }
        catch(error){
            return { success: false, error: 'Error del servidor' }
        }
    }

    // Servicio para registrar un nuevo usuario
    registerUser = async (userData: RegisterUser) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if(!response.ok) return { success: false, data: null}
            const result = await response.json();
            if(result.error) return { success: false, error: result.error }
            return {
                success: true,
                message: result.message,
                data: result.user
            }
        }
        catch(error){
            return { success: false, error: 'Error del servidor' }
        }
    }

    // Servicio para loguear un usuario
    LoginUser = async (UserData: LoginUser) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(UserData)
            });
            if(!response.ok) return { success: false, data: null}
            const result = await response.json();
            if(result.error) return {success: false, error: result.error }
            return {
                success: true,
                message: result.message,
                data: {
                    user: result.user,
                    token: result.token
                }
            }
        }
        catch(error){
            return { success: false, error: 'Error del servidor' }
        }
    }

    // Servicio para desloguear un usuario
    LogoutUser = async (userId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/users/logout/${userId}`, {
                method: 'POST'
            });
            if(!response.ok) return { success: false, data: null}
            const result = await response.json();
            if(result.error) return { success: false, error: result.error }
            return {
                success: true,
                message: result.message
            }
        }
        catch(error){
            return { success: false, error: 'Error del servidor' }
        }
    }

    // Servicio para obtener la información de un usuario por su ID
    getUserById = async (userId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/users/${userId}`);
            if(!response.ok) return { success: false, data: null}
            const result = await response.json();
            if(result.error) return { success: false, error: result.error }
            return {
                success: true,
                message: result.message,
                data: result.user
            }
        }
        catch(error){
            return { success: false, error: 'Error del servidor' }
        }
    }

    // Servicio para actualizar la información de un usuario
    updateUser = async(userId: number, updateData: FormData) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/users/update/${userId}`, {
                method: 'PATCH',
                body: updateData
            });
            if(!response.ok) return { success: false, data: null}
            const result = await response.json();
            if(result.error) return { success: false, error: result.error }
            return {
                success: true,
                message: result.message,
            }
        }
        catch(error){
            return { success: false, error: 'Error del servidor' }
        }
    }
    
    // Servicio para que el usuario borre su cuenta
    deleteUser = async(userId: number) => {
        try{
            const response = await fetch(`${LIST_CONSTANTS.API_BACKEND_URL}/users/delete/${userId}`, {
                method: 'DELETE'
            });
            if(!response.ok) return { success: false, data: null}
            const result = await response.json();
            if(result.error) return { success: false, error: result.error }
            return {
                success: true,
                message: result.message,
            }
        }
        catch(error){
            return { success: false, error: 'Error del servidor' }
        }
    }

    // Servicio para verificar si un usuario esta autenticado
    verifyAuth = async () => {
        try{
            const response = await authFetch(`${LIST_CONSTANTS.API_BACKEND_URL}/users/verify-auth`, {
                method: 'POST'
            });
            if(!response.ok) return { success: false, data: null}
            const result = await response.json();
            if(result.error) return { success: false, error: result.error }
            return {
                success: true,
                message: result.message,
                isAuthenticated: result.isAuthenticated
            }
        }
        catch(error){
            return { success: false, error: 'Error del servidor' }
        }
    }

}