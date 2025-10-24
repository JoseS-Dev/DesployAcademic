import { validateCategory } from "../validations/SchemaCategories.mjs";

export class ControllerCategory{
    constructor({ ModelCategory}){
        this.ModelCategory = ModelCategory;
    }
    // controlador para obtener todas las categorias
    getAllCategories = async (req, res) => {
        try{
            const result = await this.ModelCategory.getAllCategories();
            if(result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({
                categories: result.categories,
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // controlador para crear una nueva categoria
    createCategory = async (req, res) => {
        const validation = validateCategory(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({ error: 'Datos de categoria invalidos', details: validation.error.errors });
            }
            const result = await this.ModelCategory.createCategory({ categoryData: validation.data});
            if(result.error) return res.status(400).json({ error: result.error });
            return res.status(201).json({
                category: result.category,
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // controlador para asignar una categoria a un curso
    assignCategoryToCourse = async (req, res) => {
        const {courseId, categoryId} = req.params;
        try{
            const result = await this.ModelCategory.assignCategoryToCourse({courseId, categoryId});
            if(result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ message: result.message });
        }
        catch(error){
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // controlador para obtener todas las categorias de un curso
    getCategoriesOfCourse = async (req, res) => {
        const {courseId} = req.params;
        try{
            const result = await this.ModelCategory.getCategoriesOfCourse({courseId});
            if(result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({
                categories: result.categories,
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // controlador para eliminar una categoria de un curso
    removeCategoryFromCourse = async (req, res) => {
        const {courseId, categoryId} = req.params;
        try{
            const result = await this.ModelCategory.removeCategoryFromCourse({courseId, categoryId});
            if(result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ message: result.message });
        }
        catch(error){
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}