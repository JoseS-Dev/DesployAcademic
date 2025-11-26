import {Router} from 'express';
import { CategorieController } from './categorie.controller.mjs';
import { CategorieModel } from './categorie.model.mjs';

const router = Router();
const categorieController = new CategorieController({CategorieModel: CategorieModel});

// Rutas para las categorías de los cursos
// Ruta para obtener todas las categorías de los cursos
router.get('/all', categorieController.getAllCategories);
// Ruta para obtener una categoría por su ID
router.get('/categorie/:categorieId', categorieController.getCategorieById);
// Ruta para crear una nueva categoría de curso
router.post('/create', categorieController.createCategorie);
// Ruta para actualizar una categoría de curso
router.patch('/categorie/:categorieId/update', categorieController.updateCategorie);
// Ruta para eliminar una categoría de curso
router.delete('/categorie/:categorieId/delete', categorieController.deleteCategorie);

export const categorieRoute = router;