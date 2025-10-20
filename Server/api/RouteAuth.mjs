import { Router } from "express";
import { ControllerUser } from "../controller/ControllerUser.mjs";
import { ModelUsers } from "../models/Users.mjs";
import { verifyAuthMiddleware } from "../middlewares/Auth.mjs";

const router = Router();
const controllerUser = new ControllerUser({ModelUser: ModelUsers});
export const RouteAuth = router;

// Ruta para registrar un usuario
RouteAuth.post('/register', controllerUser.registerUser);
// Ruta para loguear un usuario
RouteAuth.post('/login', controllerUser.LoginUser);
// Ruta para cerrar sesión de un usuario
RouteAuth.post('/logout', verifyAuthMiddleware, controllerUser.LogoutUser);
// Ruta de verificación de token 
RouteAuth.get('/verify-token', verifyAuthMiddleware, controllerUser.verifyAuth);
// Ruta para obtener información del usuario autenticado
RouteAuth.get('/me', verifyAuthMiddleware, controllerUser.getUserById);
// Ruta para actualizar la información del usuario autenticado
RouteAuth.patch('/update', verifyAuthMiddleware, controllerUser.updateUserById);