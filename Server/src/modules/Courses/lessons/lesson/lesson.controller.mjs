import { validateLessonCourseData, validateLessonCourseUpdateData } from "./lesson.schema.mjs";

// Controlador que maneja las operaciones relacionadas con las lecciones de las secciones de los cursos
export class ControllerLessonCourse {
    constructor({ModelLessonCourse}){
        this.ModelLessonCourse = ModelLessonCourse;
    }
    // Controlador para obtener todas las lecciones de una sección de un curso
    getLessonsBySectionId = async (req, res) => {
        const {sectionId} = req.params;
        try{
            const result = await this.ModelLessonCourse.getLessonsBySectionId(sectionId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                lessons: result.lessons
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener una lección por su ID
    getLessonById = async (req, res) => {
        const {lessonId} = req.params;
        try{
            const result = await this.ModelLessonCourse.getLessonByID(lessonId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                lesson: result.lesson
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador que obtiene las lecciones que son gratuitas de una sección
    getFreeLessonsBySectionId = async (req, res) => {
        const {sectionId} = req.params;
        try{
            const result = await this.ModelLessonCourse.getFreeLessonsBySectionId(sectionId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                lessons: result.lessons
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para cambiar el estado de publicación de una lección
    toggleLessonPublication = async (req, res) => {
        const {lessonId} = req.params;
        const {newStatus} = req.body;
        try{
            const result = await this.ModelLessonCourse.toggleLessonPublication(lessonId, newStatus);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para cambiar el estado de vista de una lección
    toggleLessonPreview = async (req, res) => {
        const {lessonId} = req.params;
        const {newStatus} = req.body;
        try{
            const result = await this.ModelLessonCourse.toggleLessonPreview(lessonId, newStatus);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener las lecciones según su tipo
    getLessonsByType = async (req, res) => {
        const {sectionId, type} = req.params;
        try{
            const result = await this.ModelLessonCourse.getLessonsByType(sectionId, type);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                lessons: result.lessons
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para crear una nueva lección en una sección de un curso
    createLessonCourse = async (req, res) => {
        if(!req.files) return res.status(400).json({error: "Los archivos de la lección son requeridos"});
        const lessonData = {
            ...req.body,
            lesson_order: parseInt(req.body.lesson_order),
            video_url: req.files['video_url'] ? req.files['video_url'][0].path : null,
            thumbail_url: req.files['thumbail_url'] ? req.files['thumbail_url'][0].path : null
        }
        const validation = validateLessonCourseData(lessonData);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ModelLessonCourse.createLessonCourse(validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(201).json({
                message: result.message,
                lesson: result.lesson
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para actualizar una lección de una sección de un curso
    updateLessonCourse = async (req, res) => {
        if(!req.files) return res.status(400).json({error: "Los archivos de la lección son requeridos"});
        const LessonData = {
            ...req.body,
            video_url: req.files['video_url'] ? req.files['video_url'][0].path : null,
            thumbail_url: req.files['thumbail_url'] ? req.files['thumbail_url'][0].path : null
        }
        const {lessonId} = req.params;
        const validation = validateLessonCourseUpdateData(LessonData);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                })
            }
            const result = await this.ModelLessonCourse.updateLessonCourse(lessonId, validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para eliminar una lección de una sección de un curso
    deleteLessonCourse = async (req, res) => {
        const {lessonId} = req.params;
        try{
            const result = await this.ModelLessonCourse.deleteLessonCourse(lessonId);
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