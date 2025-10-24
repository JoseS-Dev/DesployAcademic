import { Router } from "express";
import { ControllerCategory } from "../controller/ControllerCategory.mjs";
import { ModelCategory } from "../models/Category.mjs";

const router = Router();
const controllerCategory = new ControllerCategory({ ModelCategory: ModelCategory });
export const RouteCategory = router;

// Ruta para obtener todas las categorias
RouteCategory.get('/', controllerCategory.getAllCategories);
// Ruta para crear una nueva categoria
RouteCategory.post('/create', controllerCategory.createCategory);
// Ruta para asignar una categoria a un curso
RouteCategory.post('/assign/:courseId/:categoryId', controllerCategory.assignCategoryToCourse);
// Ruta para obtener todas las categorias de un curso
RouteCategory.get('/course/:courseId', controllerCategory.getCategoriesOfCourse);
// Ruta para quitar una categoria de un curso
RouteCategory.delete('/remove/:courseId/:categoryId', controllerCategory.removeCategoryFromCourse);
