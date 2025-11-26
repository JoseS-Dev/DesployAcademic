import { Router } from "express";
import { ResourceModel } from "./resource.model.mjs";
import { ResourceController } from "./resource.controller.mjs";
import { uploadMiddlewareResources } from "../../../../api/middlewares/multer.middleware.mjs";

const router = Router();
const resourceController = new ResourceController({ResourceModel: ResourceModel});

// Rutas para los recursos de las lecciones
// Ruta para obtener todos los recursos de una lección especifica
router.get('/lesson/:lessonId/all', resourceController.getAllResourcesByLessonId);
// Ruta para obtener un recurso por su ID
router.get('/resource/:resourceId', resourceController.getResourceById);
// Ruta para crear un nuevo recurso de una lección
router.post('/create', uploadMiddlewareResources, resourceController.createResource);
// Ruta para actualizar un recurso de una lección
router.patch('/resource/:resourceId/update', uploadMiddlewareResources, resourceController.updateResource);
// Ruta para eliminar un recurso de una lección
router.delete('/resource/:resourceId/delete', resourceController.deleteResource);

export const resourceRoute = router;