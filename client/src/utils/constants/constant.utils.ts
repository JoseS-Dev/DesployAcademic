import { 
    ServiceSections,
    ServiceCourses,
    ServiceLessons,
    ServiceResources,
    ServiceCategories,
    ServiceUsers,
    ServiceInstructors,
    ServiceEnrollment,
    ServiceReviews 
} from "../../services"


// Lista de constantes para la aplicación
export const LIST_CONSTANTS = {
    API_BACKEND_URL: import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:4000/api/v1',
    SERVICES: {
        sections: new ServiceSections(),
        courses: new ServiceCourses(),
        lessons: new ServiceLessons(),
        resources: new ServiceResources(),
        categories: new ServiceCategories(),
        users: new ServiceUsers(),
        instructors: new ServiceInstructors(),
        enrollments: new ServiceEnrollment(),
        reviews: new ServiceReviews()
    }
}