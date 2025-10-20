import { Router } from "express";
import { ControllerUser } from "../controller/ControllerUser.mjs";
import { ModelUsers } from "../models/Users.mjs";
import { verifyAuthMiddleware } from "../middlewares/Auth.mjs";

const router = Router();
const controllerUser = new ControllerUser({ModelUser: ModelUsers});
export const RouteAuth = router;

// Ruta para registrar un usuario
router.post('/register', controllerUser.registerUser);
// Ruta para loguear un usuario
router.post('/login', controllerUser.LoginUser);
// Ruta para cerrar sesión de un usuario
router.post('/logout', verifyAuthMiddleware, controllerUser.LogoutUser);
// Ruta de verificación de token 
router.get('/verify-token', verifyAuthMiddleware, controllerUser.verifyAuth);