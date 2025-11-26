import { validateCategorieData, validateCategorieUpdateData } from "./categorie.schema.mjs";

// Controlador que maneja las operaciones relacionadas con las categorias de los cursos
export class CategorieController {
    constructor({CategorieModel}){
        this.CategorieModel = CategorieModel;
    }

    // Controlador para obtener todas las categorias de los cursos
    getAllCategories = async (req, res) => {
        try{
            const result = await this.CategorieModel.getAllCategories();
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                categories: result.categories
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener una categoria por su ID
    getCategorieById = async (req, res) => {
        const {categorieId} = req.params;
        try{
            const result = await this.CategorieModel.getCategorieById(Number(categorieId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                categorie: result.categorie
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para crear una nueva categoria de curso
    createCategorie = async (req, res) => {
        const validation = validateCategorieData(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                })
            }
            const result = await this.CategorieModel.createCategorie(validation.data);
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(201).json({
                message: result.message,
                categorie: result.categorie
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para actualizar una categoria de curso
    updateCategorie = async (req, res) => {
        const {categorieId} = req.params;
        const validation = validateCategorieUpdateData(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                })
            }
            const result = await this.CategorieModel.updateCategorie(Number(categorieId), validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para eliminar una categoria de curso
    deleteCategorie = async (req, res) => {
        const {categorieId} = req.params;
        try{
            const result = await this.CategorieModel.deleteCategorie(Number(categorieId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }
}