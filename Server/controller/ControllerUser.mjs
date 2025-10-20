import { is } from "zod/v4/locales";
import { validateLogin, validateUser } from "../validations/SchemaUser.mjs";

export class ControllerUser {
    constructor({ModelUser}){
        this.ModelUser = ModelUser;
    }

    // Controlador para registrar un usuario
    registerUser = async (req, res) => {
        const validation = validateUser(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: 'Error de validación',
                    details: validation.error.errors
                });
            }
            const result = await this.ModelUser.registerUser({userData: validation.data});
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(201).json({user: result.user, message: result.message});
        }catch(error){
            return res.status(500).json({error: 'Error interno del servidor'});
        }
    }

    // Controlador para loguear un usuario
    LoginUser = async (req, res) => {
        const validation = validateLogin(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: 'Error de validación',
                    details: validation.error.errors
                })
            }
            const result = await this.ModelUser.loginUser({LoginData: validation.data});
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(200).json({
                token: result.token,
                message: 'Usuario logueado exitosamente'
            });
        }
        catch(error){
            return res.status(500).json({error: 'Error interno del servidor'});
        }
    }

    // Controlador para cerrar sesión de un usuario
    LogoutUser = async (req, res) => {
        const userId = req.user.id;
        try{
            const result = await this.ModelUser.logoutUser({userId});
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(200).json({message: result.message});
        }
        catch(error){
            return res.status(500).json({error: 'Error interno del servidor'});
        }
    }

    // Controlador para verificar si el usuario está autenticado
    verifyAuth = async (req, res) => {
        if(!req.user){
            return res.status(401).json({
                error: 'Usuario no autenticado',
                isAuthenticated: false
            });
        }
        return res.status(200).json({
            message: 'Usuario autenticado',
            isAuthenticated: true,
        });
    }
}