import { validateSectionCourseData, validateSectionCourseUpdateData } from "./section.schema.mjs";

// Controlador que maneja las operaciones relacionadas con las secciones de los cursos
export class ControllerSectionCourse {
    constructor({ModelSectionCourse}){
        this.ModelSectionCourse = ModelSectionCourse;
    }

    // Controlador para obtener todas las secciones de un curso
    getSectionsByCourseId = async (req, res) => {
        const {courseId} = req.params;
        try{
            const result = await this.ModelSectionCourse.getSectionsByCourseId(courseId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                sections: result.sections
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener una sección por su ID
    getSectionById = async (req, res) => {
        const {sectionId} = req.params;
        try{
            const result = await this.ModelSectionCourse.getSectionByID(sectionId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                section: result.section
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para cambiar el estado de publicación de una sección
    toggleSectionPublication = async (req, res) => {
        const {sectionId} = req.params;
        const {newStatus} = req.body;
        try{
            const result = await this.ModelSectionCourse.toggleSectionPublication(sectionId, newStatus);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para crear una nueva sección de un curso
    createSectionCourse = async (req, res) => {
        const validation = validateSectionCourseData(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ModelSectionCourse.createSectionCourse(validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(201).json({
                message: result.message,
                section: result.section
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para actualizar una sección de un curso
    updateSectionCourse = async (req, res) => {
        const {sectionId} = req.params;
        const validation = validateSectionCourseUpdateData(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ModelSectionCourse.updateSectionCourse(sectionId, validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para eliminar una sección de un curso
    deleteSectionCourse = async (req, res) => {
        const {sectionId} = req.params;
        try{
            const result = await this.ModelSectionCourse.deleteSectionCourse(sectionId);
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