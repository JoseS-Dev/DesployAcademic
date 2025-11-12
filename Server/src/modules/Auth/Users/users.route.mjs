import {Router} from 'express';
import { ControllerUsers } from './users.controller.mjs';
import { ModelUsers } from './users.model.mjs';
import { verifyAuthMiddleware } from '../../../api/middlewares/Auth.mjs';


const router = Router();
const controllerUsers = new ControllerUsers({ModelUsers: ModelUsers});

// Rutas para el manejo de usuarios
// Ruta para registrar a un usuario
router.post('/register', controllerUsers.registerUser);
// Ruta para loguear a un usuario
router.post('/login', controllerUsers.LoginUser);
// Ruta para desloguar a un usuario
router.post('/logout/:userId', controllerUsers.LogoutUser);
// Ruta que verifica si el usuario esta autenticado
router.post('/verify-auth',verifyAuthMiddleware, controllerUsers.verifyUser);
// Ruta para actualizar la información de un usuario (Ruta protegida)
router.patch('/update/:userId', controllerUsers.updateUser);
// Ruta para obtener la información de un usuario por su ID 
router.get('/:userId', controllerUsers.getUserById);
// Ruta para que el usuario pueda eliminar su cuenta ( Ruta protegida )
router.delete('/delete/:userId', controllerUsers.deleteUser);


export const userRoute = router

