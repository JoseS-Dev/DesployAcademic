import {Router} from 'express';
import { ControllerSectionCourse } from './section.controller.mjs';
import { ModelSectionCourse} from './section.model.mjs';

const router = Router();
const controllerSectionCourse = new ControllerSectionCourse({ModelSectionCourse: ModelSectionCourse});

// Rutas para las secciones de los cursos
// Ruta para obtener todas las secciones de un curso
router.get('/course/:courseId/all', controllerSectionCourse.getSectionsByCourseId);
// Ruta para obtener una sección por su ID
router.get('/section/:sectionId', controllerSectionCourse.getSectionById);
// Ruta para cambiar el estado de publicación de una sección
router.patch('/section/:sectionId/toggle-publication', controllerSectionCourse.toggleSectionPublication);
// Ruta para crear una nueva sección de un curso
router.post('/create', controllerSectionCourse.createSectionCourse);
// Ruta para actualizar una sección de un curso
router.patch('/section/:sectionId/update', controllerSectionCourse.updateSectionCourse);
// Ruta para eliminar una sección de un curso
router.delete('/section/:sectionId/delete', controllerSectionCourse.deleteSectionCourse);

export const sectionRoute = router;