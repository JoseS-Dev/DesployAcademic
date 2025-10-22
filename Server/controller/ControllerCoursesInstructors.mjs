import { validateCourseInstructor, validateCourseInstructorUpdate, validatePrimaryInstructor } from "../validations/SchemaCourses-Instructors.mjs";

export class ControllerCoursesInstructors {
    constructor({ ModelCourseInstructor }) {
        this.ModelCourseInstructor = ModelCourseInstructor;
    }
    // Controlador para asignar un instructor a un curso
    assignInstructorToCourse = async (req, res) => {
        const assignmentData = req.body;
        // Validar los datos de la asignación
        const validation = validateCourseInstructor(assignmentData);
        if (!validation.success) {
            return res.status(400).json({ error: 'Datos de asignación inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelCourseInstructor.assignInstructorToCourse({ assignmentData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(201).json({ assignment: result.assignment, message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Controlador para actualizar la asignación de un instructor a un curso
    updateInstructorAssignment = async (req, res) => {
        const assignmentId = req.params.id;
        const updateData = req.body;
        // Validar los datos de actualización de la asignación
        const validation = validateCourseInstructorUpdate(updateData);
        if (!validation.success) {
            return res.status(400).json({ error: 'Datos de actualización inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelCourseInstructor.updateInstructorAssignment({ assignmentId, updateData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ assignment: result.assignment, message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // Controlador para establecer un instructor principal en un curso
    setPrimaryInstructor = async (req, res) => {
        const primaryData = req.body;
        // Validar los datos del instructor principal
        const validation = validatePrimaryInstructor(primaryData);
        if (!validation.success) {
            return res.status(400).json({ error: 'Datos de instructor principal inválidos', details: validation.error.errors });
        }
        try {
            const result = await this.ModelCourseInstructor.setPrimaryInstructor({ primaryData: validation.data });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ assignment: result.assignment, message: result.message });
        }
        catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para eliminar la asignación de un instructor a un curso
    removeInstructorFromCourse = async (req, res) => {
        const assignmentId = req.params.id;
        try {
            const result = await this.ModelCourseInstructor.removeInstructorFromCourse({ assignmentId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para obtener todos los instructores asignados a un curso
    getInstructorsByCourse = async (req, res) => {
        const courseId = req.params.courseId;
        try {
            const result = await this.ModelCourseInstructor.getInstructorsByCourse({ courseId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ instructors: result.instructors });
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Controlador para obtener todos los cursos asignados a un instructor

    getCoursesByInstructor = async (req, res) => {
        const instructorId = req.params.instructorId;
        try {
            const result = await this.ModelCourseInstructor.getCoursesByInstructor({ instructorId });
            if (result.error) return res.status(400).json({ error: result.error });
            return res.status(200).json({ courses: result.courses });
        }
        catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}