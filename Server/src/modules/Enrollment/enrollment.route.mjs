import {Router} from "express";
import { EnrollmentController } from "./enrollment.controller.mjs";
import { EnrollmentModel } from "./enrollment.model.mjs";

const router = Router();
const enrollmentController = new EnrollmentController({EnrollmentModel});

// Rutas para manejar las inscripciones de estudiantes en cursos
// Ruta para obtener todos los estudiantes inscritos en un curso especifico
router.get('/course/:courseId', enrollmentController.getEnrollmentsByCourse);
// Ruta para obtener todos los cursos en los que un estudiante está inscrito
router.get('/user/:userId', enrollmentController.getEnrollmentByUser);
// Ruta para obtener el progreso de un estudiante en especifico
router.get('/user/:userId/course/:courseId/enrollment', enrollmentController.getEnrollmentById);
// Ruta para actualizar el progreso de un estudiante en un curso
router.patch('/user/:userId/course/:courseId/progress', enrollmentController.updateEnrollmentProgress);
// Ruta para inscribir a un estudiante en un curso
router.post('/enroll/create', enrollmentController.enrollStudentInCourse);
// Ruta para actualizar la inscripción de un estudiante en un curso
router.patch('/user/:userId/course/:courseId/update', enrollmentController.updateEnrollment);
// Ruta para eliminar la inscripción de un estudiante en un curso
router.delete('/user/:userId/course/:courseId/delete', enrollmentController.deleteEnrollment);

export const enrollmentRouter = router;