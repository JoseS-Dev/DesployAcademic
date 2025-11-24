import {Router} from 'express';
import { ControllerCourses } from './course.controller.mjs';
import { ModelCourses } from './course.model.mjs';
import { uploadmiddlewareCourses } from '../../../api/middlewares/multer.middleware.mjs';
const router = Router();
const controllerCourses = new ControllerCourses({ModelCourses: ModelCourses});

// Rutas para los cursos
// Ruta para obtener todos los cursos de un instructor
router.get('/instructor/:instructorId', controllerCourses.getCoursesByInstructor);
// Ruta para obtener todos los cursos registrados en el sistema
router.get('/all', controllerCourses.getAllCourses);
// Ruta para buscar un curso por su slug
router.get('/slug/:slug', controllerCourses.getCoursesBySlug);
// Ruta para buscar cursos según su nivel de dificultad
router.get('/level/:level', controllerCourses.getCoursesByLevel);
// Ruta para buscar cursos según su tipo (gratuito o premium)
router.get('/type/:type', controllerCourses.getCoursesByType);
// Ruta para crear un nuevo curso
router.post('/create', uploadmiddlewareCourses, controllerCourses.createCourse);
// Ruta para actualizar un curso
router.patch('/course/:courseId/update',uploadmiddlewareCourses, controllerCourses.updateCourse);
// Ruta para cambiar el estado de un curso (publicado o no publicado)
router.patch('/course/:courseId/change-status', controllerCourses.toggleCourseStatus);
// Ruta para eliminar un curso
router.delete('/course/:courseId/delete', controllerCourses.deleteCourse);

export const courseRoute = router;