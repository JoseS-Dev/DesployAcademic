import { validateCourse, validateCourseUpdate } from "../validations/SchemaCourses.mjs";

export class ControllerCourses {
    constructor({ ModelCourse }) {
        this.ModelCourse = ModelCourse;
    }
    // Controlador para obtener todos los cursos
    getAllCourses = async (req, res) => {
        try {
            const result = await this.ModelCourse.getAllCourses();
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ courses: result.courses });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para obtener un curso por su ID
    getCourseById = async (req, res) => {
        const courseId = req.params.id;
        try {
            const result = await this.ModelCourse.getCourseById({ courseId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ course: result.course });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    //controlador para obtener cursos publicados
    getPublishedCourses = async (req, res) => {
        try {
            const result = await this.ModelCourse.getPublishedCourses();
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ courses: result.courses });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para obtener un curso por su slug
    getCourseBySlug = async (req, res) => {
        const courseSlug = req.params.slug;
        try {
            const result = await this.ModelCourse.getCourseBySlug({ courseSlug });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ course: result.course });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Controlador para crear un nuevo curso
    createCourse = async (req, res) => {
        const courseData = req.body;
        // Validar los datos del curso
        const validation = validateCourse(courseData);
        if (!validation.success) {
            console.log(validation.error);
            return res.status(400).json({ error: 'Datos de curso inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelCourse.createCourse({ courseData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(201).json({ course: result.course, message: result.message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para actualizar un curso
    updateCourse = async (req, res) => {
        const courseId = req.params.id;
        const updateData = req.body;
        // Validar los datos de actualización del curso
        const validation = validateCourseUpdate(updateData);
        if (!validation.success) {
            return res.status(400).json({ error: 'Datos de actualización inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelCourse.updateCourse({ courseId, updateData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ course: result.course, message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para eliminar un curso
    deleteCourse = async (req, res) => {
        const courseId = req.params.id;
        try {
            const result = await this.ModelCourse.deleteCourse({ courseId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }


}
