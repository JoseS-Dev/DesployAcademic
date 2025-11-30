import { validateEnrollment } from "./enrollment.schema.mjs";

// Controlador para manejar las inscripciones de estudiantes en cursos
export class EnrollmentController{
    constructor({EnrollmentModel}){
        this.EnrollmentModel = EnrollmentModel;
    }

    // Método que obtiene a todos los estudiantes inscritos en un curso especifico
    getEnrollmentsByCourse = async (req, res) => {
        const {courseId} = req.params;
        try{
            const result = await this.EnrollmentModel.getEnrollmentsByCourse(Number(courseId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                enrollments: result.enrollments,
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Método que obtiene todos los cursos en los que un estudiante está inscrito
    getEnrollmentByUser = async (req, res) => {
        const {userId} = req.params;
        try{
            const result = await this.EnrollmentModel.getEnrollmentsByUser(Number(userId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                enrollments: result.enrollments,
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Método que obtiene el progreso de un estudiante en especifico
    getEnrollmentById = async (req, res) => {
        const {userId, courseId} = req.params;
        try{
            const result = await this.EnrollmentModel.getEnrollmentById(Number(userId), Number(courseId));
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                enrollment: result.enrollment,
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Método para cambiar el progreso de un estudiante en un curso
    updateEnrollmentProgress = async (req, res) => {
        const {userId, courseId} = req.params;
        const {progressPercentage} = req.body;
        try{
            const result = await this.EnrollmentModel.updateEnrollmentProgress(
                Number(userId), Number(courseId), Number(progressPercentage)
            );
            if(result.error) return res.status(404).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    // Método para inscribir a un estudiante en un curso
    enrollStudentInCourse = async (req, res) => {
        const validation = validateEnrollment(req.body);
        try{
            if(!validation.success){
                return res.status(400).json({
                    error: "Datos de inscripción inválidos",
                    details: validation.error
                });
            }
            const result = await this.EnrollmentModel.enrollStudentInCourse(validation.data);
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(201).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }


    // Método para desinscribir a un estudiante de un curso
    deleteEnrollment = async (req, res) => {
        const {userId, courseId} = req.params;
        try{
            const result = await this.EnrollmentModel.deleteEnrollment(Number(userId), Number(courseId));
            if(result.error) return res.status(400).json({error: result.error});
            return res.status(200).json({
                message: result.message
            });
        }
        catch(error){
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }
}