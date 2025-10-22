import { Router } from "express";
import { ControllerCoursesInstructors } from "../controller/ControllerCoursesInstructors.mjs";
import { verifyAuthMiddleware } from "../middlewares/Auth.mjs";
import { ModelCoursesInstructors } from "../models/CoursesInstructors.mjs";

const router = Router();
const controllerCoursesInstructors = new ControllerCoursesInstructors({ ModelCourseInstructor: ModelCoursesInstructors });
export const RouteCoursesInstructors = router;

// Ruta para asignar un instructor a un curso
router.post('/assign', verifyAuthMiddleware, controllerCoursesInstructors.assignInstructorToCourse);
// Ruta para actualizar la asignación de un instructor a un curso
router.put('/update/:id', verifyAuthMiddleware, controllerCoursesInstructors.updateInstructorAssignment);
// Ruta para establecer un instructor principal en un curso
router.put('/primary', verifyAuthMiddleware, controllerCoursesInstructors.setPrimaryInstructor);
// Ruta para eliminar la asignación de un instructor a un curso
router.delete('/remove/:id', verifyAuthMiddleware, controllerCoursesInstructors.removeInstructorFromCourse);
// Ruta para obtener todos los instructores asignados a un curso
router.get('/course/:courseId', controllerCoursesInstructors.getInstructorsByCourse);
// Ruta para obtener todos los cursos asignados a un instructor
router.get('/instructor/:instructorId', controllerCoursesInstructors.getCoursesByInstructor);