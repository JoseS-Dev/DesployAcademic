import { validateCourseData, validateCourseUpdateData } from "./course.schema.mjs";

// Controlador que maneja las operaciones relacionadas con los cursos
export class ControllerCourses {
    constructor({ModelCourses}){
        this.ModelCourses = ModelCourses;
    }
    // Controlador para obtener todos los cursos de un instructor
    getCoursesByInstructor = async (req, res) => {
        const {instructorId} = req.params;
        try{
            const result = await this.ModelCourses.getCoursesByInstructor(instructorId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                courses: result.courses
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para obtener todos los cursos registrados en el sistema
    getAllCourses = async (req, res) => {
        try{
            const result = await this.ModelCourses.getAllCourses();
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                courses: result.courses
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para buscar un curso por su slug
    getCoursesBySlug = async (req, res) => {
        const {slug} = req.params;
        try{
            const result = await this.ModelCourses.getCourseBySlug(slug);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                course: result.course
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para buscar cursos según su nivel de dificultad
    getCoursesByLevel = async (req, res) => {
        const {level} = req.params;
        try{
            const result = await this.ModelCourses.getCourseByLevel(level);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                courses: result.courses
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para buscar cursos según su tipo (gratuito o premium)
    getCoursesByType = async (req, res) => {
        const {type} = req.params;
        try{
            const result = await this.ModelCourses.getCourseByType(type);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                courses: result.courses
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para crear un nuevo curso
    createCourse = async (req, res) => {
        if(!req.files || !req.files['thumbnail_course'] || !req.files['preview_video']){
            return res.status(400).json({error: "Faltan archivos obligatorios: thumbnail_course y preview_video"});
        }
        const courseData = {
            ...req.body,
            instructor_id: parseInt(req.body.instructor_id),
            price_course: parseFloat(req.body.price_course),
            duration_course: parseInt(req.body.duration_course),
            thumbnail_course: req.files['thumbnail_course'][0].path,
            preview_video: req.files['preview_video'][0].path
        }
        const validation = validateCourseData(courseData);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ModelCourses.createCourse(validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(201).json({
                message: result.message,
                course: result.course
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para actualizar un curso existente
    updateCourse = async (req, res) => {
        if(!req.files) return res.status(400).json({error: "No se han subido archivos"});
        const {courseId} = req.params;
        const courseData = {
            ...req.body,
            price_course: req.body.price_course ? parseFloat(req.body.price_course) : undefined,
            duration_course: req.body.duration_course ? parseInt(req.body.duration_course) : undefined,
            thumbnail_course: req.files['thumbnail_course'] ? req.files['thumbnail_course'][0].path : undefined,
            preview_video: req.files['preview_video'] ? req.files['preview_video'][0].path : undefined
        }
        const validation = validateCourseUpdateData(courseData);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Error de validación",
                    details: validation.error
                });
            }
            const result = await this.ModelCourses.updatedCourse(courseId, validation.data);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message,
                course: result.course
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Controlador para cambiar el estado de un curso (activo/inactivo)
    toggleCourseStatus = async (req, res) => {
        const {courseId} = req.params;
        const {newStatus} = req.body;
        try{
            const result = await this.ModelCourses.toggleCourseStatus(courseId, newStatus);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Método para eliminar un curso
    deleteCourse = async (req, res) => {
        const {courseId} = req.params;
        try{
            const result = await this.ModelCourses.deleteCourse(courseId);
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }
}