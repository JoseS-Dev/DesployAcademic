import { Router } from "express";
import { ControllerCourseSections } from "../controller/ControllerCourseSections.mjs";
import { ModelCourseSections } from "../models/CourseSections.mjs";
import { verifyAuthMiddleware } from "../middlewares/Auth.mjs";

const router = Router();
const controllerCourseSections = new ControllerCourseSections({ ModelCourseSection: ModelCourseSections });
export const RouteCourseSections = router;
// Ruta para crear una nueva sección en un curso
RouteCourseSections.post('/', verifyAuthMiddleware, controllerCourseSections.createCourseSection);
// Ruta para obtener todas las secciones de un curso
RouteCourseSections.get('/course/:courseId', controllerCourseSections.getSectionsByCourse);
// Ruta para actualizar una sección de un curso
RouteCourseSections.put('/:sectionId', verifyAuthMiddleware, controllerCourseSections.updateCourseSection);
// Ruta para obtener una sección por su ID
RouteCourseSections.get('/:id', controllerCourseSections.getSectionById);
// Ruta para eliminar una sección de un curso
RouteCourseSections.delete('/:sectionId', verifyAuthMiddleware, controllerCourseSections.deleteCourseSection);
//ruta para eliminar todas las secciones de un curso
RouteCourseSections.delete('/course/:courseId', verifyAuthMiddleware, controllerCourseSections.deleteSectionsByCourse);
// Ruta para reordenar las secciones de un curso
RouteCourseSections.post('/reorder/:courseId', verifyAuthMiddleware, controllerCourseSections.reorderCourseSections);