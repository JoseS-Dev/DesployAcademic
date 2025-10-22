import { Router } from "express";
import { ControllerInstructors } from "../controller/ControllerInstructors.mjs";
import { ModelInstructors } from "../models/Instructors.mjs";
import { verifyAuthMiddleware } from "../middlewares/Auth.mjs";

const router = Router();
const controllerInstructors = new ControllerInstructors({ ModelInstructor: ModelInstructors });
export const RouteInstructors = router;

// Ruta para registrar un nuevo instructor
RouteInstructors.post('/', verifyAuthMiddleware, controllerInstructors.registerInstructor);
// Ruta para obtener todos los instructores
RouteInstructors.get('/', controllerInstructors.getAllInstructors);
// Ruta para obtener un instructor por su ID
RouteInstructors.get('/:id', controllerInstructors.getInstructorById);
// Ruta para actualizar el perfil de un instructor
RouteInstructors.patch('/:id', verifyAuthMiddleware, controllerInstructors.updateInstructorProfile);
