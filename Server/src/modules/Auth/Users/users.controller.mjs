import { validateDataUser, validateDataLoginUser ,validateDataUpdateUser } from "./users.schema.mjs";
import { authMiddleware } from "../../../api/middlewares/auth.middleware.mjs";

// Controlador que maneja las operaciones relacionadas con los usuarios
export class ControllerUsers {
    constructor({ModelUsers}){
        this.ModelUsers = ModelUsers;
    }

    // Controlador para obtener a todos los usuarios (admin)
    getAllUsers = async (req, res) => {
        try{
            const result = await this.ModelUsers.getAllUsers();
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                users: result.users
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para registrar a un usuario
    registerUser = async (req, res) => {
        const validation = validateDataUser(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                })
            }
            const result = await this.ModelUsers.registerUser(validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(201).json({
                message: result.message,
                user: result.user
            })
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para loguear a un usuario
    LoginUser = async (req, res) => {
        const validation = validateDataLoginUser(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ModelUsers.LoginUser(validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                token: authMiddleware(result.user)
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para desloguar a un usuario
    LogoutUser = async (req, res) => {
        const {userId} = req.params;
        try{
            const result = await this.ModelUsers.LogoutUser(userId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({message: result.message});
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener la información de un usuario por su ID
    getUserById = async (req, res) => {
        const {userId} = req.params;
        try{
            const result = await this.ModelUsers.getUserById(userId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({user: result.user});
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para que el usuario pueda actualizar su información
    updateUser = async (req, res) => {
        if(!req.file) return res.status(400).json({error: "No se proporcionó una imagen de avatar"});
        const {userId} = req.params;
        const DataBody = {
            ...req.body,
            avatar_imagen: req.file.path
        };
        const validation = validateDataUpdateUser(DataBody);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ModelUsers.updateUser(userId, validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({message: result.message});
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para que el usuario pueda eliminar su cuenta
    deleteUser = async (req, res) => {
        const {userId} = req.params;
        try{
            const result = await this.ModelUsers.deleteUser(userId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({message: result.message});
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para verificar que el usuario esta verificado
    verifyUser = async (req, res) => {
        if(!req.user){
            return res.status(401).json({
                error: "Usuario no autenticado",
                isAuthenticated: false
            })
        }
        return res.status(200).json({
            message: "Usuario autenticado",
            isAuthenticated: true,
        })
    }

}