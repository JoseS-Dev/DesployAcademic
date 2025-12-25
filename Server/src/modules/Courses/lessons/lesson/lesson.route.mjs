import {Router} from 'express';
import { ControllerLessonCourse } from './lesson.controller.mjs';
import { ModelLessonCourse } from './lesson.model.mjs';
import { uploadMiddlewareLessons } from '../../../../api/middlewares/multer.middleware.mjs';

const router = Router();
const controllerLessonCourse = new ControllerLessonCourse({ModelLessonCourse: ModelLessonCourse});

// Rutas para las lecciones de las secciones de los cursos
// Ruta para obtener todas las lecciones de una sección de un curso
router.get('/section/:sectionId/all', controllerLessonCourse.getLessonsBySectionId);
// Ruta para obtener una lección por su ID
router.get('/lesson/:lessonId', controllerLessonCourse.getLessonById);
// Ruta para obtener las lecciones gratuitas de una sección
router.get('/section/:sectionId/free-lessons', controllerLessonCourse.getFreeLessonsBySectionId);
// Ruta para cambiar el estado de publicación de una lección
router.patch('/lesson/:lessonId/change-status', controllerLessonCourse.toggleLessonPublication);
// Ruta para cambiar el estado de acceso gratuito de una lección
router.patch('/lesson/:lessonId/change-free-access', controllerLessonCourse.toggleLessonPreview);
// Ruta para obtener las lecciones según su tipo
router.get('/section/:sectionId/lessons-by-type/:type', controllerLessonCourse.getLessonsByType);
// Ruta para crear una nueva lección en una sección
router.post('/create',uploadMiddlewareLessons, controllerLessonCourse.createLessonCourse);
// Ruta para actualizar una lección
router.patch('/lesson/:lessonId/update', uploadMiddlewareLessons, controllerLessonCourse.updateLessonCourse);
// Ruta para eliminar una lección
router.delete('/lesson/:lessonId/delete', controllerLessonCourse.deleteLessonCourse);

export const lessonRoute = router;