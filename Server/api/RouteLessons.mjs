import { Router } from "express";
import { ControllerLessons } from "../controller/ControllerLessons.mjs";
import { ModelLessons } from "../models/lessons.mjs";
import { verifyAuthMiddleware } from "../middlewares/Auth.mjs";
import { UploadLessonMedia } from "../middlewares/UploadLessonMedia.mjs";

const router = Router();

const controllerLesson = new ControllerLessons({ ModelLesson: ModelLessons });

export const RouteLessons = router;

// Ruta para crear una nueva lección
RouteLessons.post('/create/:sectionId', verifyAuthMiddleware, UploadLessonMedia, controllerLesson.createLesson);
// Ruta para actualizar una lección existente
RouteLessons.put('/update/:lessonId', verifyAuthMiddleware, UploadLessonMedia, controllerLesson.updateLesson);
// Ruta para obtener lecciones por curso
RouteLessons.get('/course/:courseId', verifyAuthMiddleware, controllerLesson.getLessonsBySection);
// Ruta para obtener una lección por su ID
RouteLessons.get('/:lessonId', verifyAuthMiddleware, controllerLesson.getLessonById);
// Ruta para eliminar una lección
RouteLessons.delete('/delete/:lessonId', verifyAuthMiddleware, controllerLesson.deleteLesson);