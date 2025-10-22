import { Router } from "express";
import { ControllerCourses } from "../controller/ControllerCourses.mjs";
import { ModelCourses } from "../models/Courses.mjs";
import { verifyAuthMiddleware } from "../middlewares/Auth.mjs";

const router = Router();

const controllerCourses = new ControllerCourses({ ModelCourse: ModelCourses });
export const RouteCourses = router;

// Ruta para crear un nuevo curso

RouteCourses.post('/', verifyAuthMiddleware, controllerCourses.createCourse);
// Ruta para obtener todos los cursos
RouteCourses.get('/', controllerCourses.getAllCourses);
// Ruta para obtener un curso por su ID
RouteCourses.get('/:id', controllerCourses.getCourseById);
// Ruta para actualizar un curso por su ID
RouteCourses.put('/:id', verifyAuthMiddleware, controllerCourses.updateCourse);
// Ruta para eliminar un curso por su ID
RouteCourses.delete('/:id', verifyAuthMiddleware, controllerCourses.deleteCourse);
// Ruta para obtener un curso por su slug
RouteCourses.get('/slug/:slug', controllerCourses.getCourseBySlug);
// Ruta para obtener los cursos publicados
RouteCourses.get('/published/all', controllerCourses.getPublishedCourses);


