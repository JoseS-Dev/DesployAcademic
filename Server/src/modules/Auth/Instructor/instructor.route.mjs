import {Router} from 'express';
import { InstructorController } from './instructor.controller.mjs';
import { InstructorModel } from './instructor.model.mjs';
import { uploadMiddlewareInstructor } from '../../../api/middlewares/multer.middleware.mjs';

const router = Router();
const controllerInstructor = new InstructorController({InstructorModel: InstructorModel});

// Rutas relacionadas con los instructores
// Ruta para obtener a todos los instructores del sistema
router.get('/all', controllerInstructor.getAllInstructors);
// Ruta para obtener el perfil de un instructor por su ID
router.get('/instructor/:instructorId', controllerInstructor.getInstructorById);
// Ruta para obtener a los instructores según una categoria
router.get('/category/:categoryInstructor', controllerInstructor.getInstructorByCategory);
// Ruta para que un instructor cree su perfil
router.post('/create-profile', uploadMiddlewareInstructor, controllerInstructor.createInstructorProfile);
// Ruta para que un instructor actualice su perfil
router.patch('/update-profile/:instructorId', uploadMiddlewareInstructor, controllerInstructor.updateInstructorProfile);
// Ruta para que un usuario siga a un instructor
router.post('/follow/instructor/:instructorId/user/:userId', controllerInstructor.followInstructor);
// Ruta para eliminar el perfil de un instructor
router.delete('/delete-profile/:instructorId', controllerInstructor.deleteInstructorProfile);

export const instructorRoute = router;