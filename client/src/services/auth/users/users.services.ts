
import { authFetch } from "../../../utils/functions/functions.utils";
import type { RegisterUser, LoginUser } from "../../../interfaces";

// Servicio para obtener a todos los usuarios del sistema (admin)
export const getAllUsers = async () => {
     try{
         const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/all`);
         if(!response.ok) throw new Error('Error al obtener los usuarios');
         const result = await response.json();
         return result;
     }
     catch(error){
         throw new Error('Error del servidor')
     }
}
 // Servicio para registrar un nuevo usuario
export const registerUser = async (userData: RegisterUser) => {
     try{
         const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/register`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(userData)
         });
         if(!response.ok) throw new Error('Error al registrar el usuario');
         const result = await response.json();
         return result;
     }
     catch(error){
         console.log(error);
     }
} 
 // Servicio para loguear un usuario
export const LoginUsers = async (UserData: LoginUser) => {
     try{
         const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/login`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(UserData)
         });
         console.log(response);
         if(!response.ok) throw new Error('Error al iniciar sesión');
         const result = await response.json();
         return result;
     }
     catch(error){
         console.log(error);
     }
} 
 // Servicio para desloguear un usuario
export const LogoutUser = async (userId: number) => {
     try{
         const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/logout/${userId}`, {
             method: 'POST'
         });
         if(!response.ok) throw new Error('Error del servidor')
         const result = await response.json();
         return result
     }
     catch(error){
         throw new Error('Error del servidor')
     }
} 
// Servicio para obtener la información de un usuario por su ID
export const getUserById = async (userId: number) => {
     try{
         const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/${userId}`);
         if(!response.ok) throw new Error('Error del servidor')
         const result = await response.json();
         return result
     }
     catch(error){
         throw new Error('Error del servidor')
     }
} 
// Servicio para actualizar la información de un usuario
export const updateUser = async(userId: number, updateData: FormData) => {
     try{
         const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/update/${userId}`, {
             method: 'PATCH',
             body: updateData
         });
         if(!response.ok) throw new Error('Error del servidor')
         const result = await response.json();
         return result
     }
     catch(error){
         throw new Error('Error del servidor')
     }
} 
// Servicio para que el usuario borre su cuenta
export const deleteUser = async(userId: number) => {
     try{
         const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/delete/${userId}`, {
             method: 'DELETE'
         });
         if(!response.ok) throw new Error('Error del servidor')
         const result = await response.json();
         return result
     }
     catch(error){
         throw new Error('Error del servidor')
     }
} 
// Servicio para verificar si un usuario esta autenticado
export const verifyAuth = async () => {
     try{
         const response = await authFetch(`${import.meta.env.VITE_API_BACKEND_URL}/users/verify-auth`, {
             method: 'POST'
         });
         if(!response.ok) throw new Error('Error del servidor')
         const result = await response.json();
         return result
     }
     catch(error){
         throw new Error('Error del servidor')
     }
}