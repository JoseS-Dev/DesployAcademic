import { Router } from "express";
import { ControllerInstructors } from "../controller/ControllerInstructors.mjs";
import { ModelInstructors } from "../models/Instructors.mjs";
import { verifyAuthMiddleware } from "../middlewares/Auth.mjs";
import { UploadProfilePicture } from "../middlewares/SubImage.mjs";

const router = Router();
const controllerInstructors = new ControllerInstructors({ ModelInstructor: ModelInstructors });
export const RouteInstructors = router;

// Ruta para registrar un nuevo instructor
RouteInstructors.post('/register', verifyAuthMiddleware, UploadProfilePicture, controllerInstructors.registerInstructor);
// Ruta para obtener todos los instructores
RouteInstructors.get('/', controllerInstructors.getAllInstructors);
// Ruta para obtener un instructor por su ID
RouteInstructors.get('/:instructorId', controllerInstructors.getInstructorById);
// Ruta para actualizar el perfil de un instructor
RouteInstructors.patch('/:instructorId', verifyAuthMiddleware, controllerInstructors.updateInstructorProfile);
// Ruta para seguir a un instructor
RouteInstructors.post('/:instructorId/follow', verifyAuthMiddleware, controllerInstructors.followInstructor);
