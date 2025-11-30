import {Router} from 'express';
import { CONFIG_SERVER } from '../../../config/config.mjs';
import { userRoute } from '../../modules/Auth/Users/users.route.mjs';
import { instructorRoute } from '../../modules/Auth/Instructor/instructor.route.mjs';
import { courseRoute } from '../../modules/Courses/course/course.route.mjs';
import { sectionRoute } from '../../modules/Courses/sections_course/section.route.mjs';
import { lessonRoute } from '../../modules/Courses/lessons/lesson/lesson.route.mjs';
import { resourceRoute } from '../../modules/Courses/lessons/resources/resource.route.mjs';
import { reviewRoute } from '../../modules/Reviews/review.route.mjs';
import { categorieRoute } from '../../modules/Categories/categories/categorie.route.mjs';
import { enrollmentRouter } from '../../modules/Enrollment/enrollment.route.mjs';

const router = Router();

export const RoutesModules = {
    users: {
        user: router.use(`${CONFIG_SERVER.basePath}/users`, userRoute),
        instructor: router.use(`${CONFIG_SERVER.basePath}/instructors`, instructorRoute)
    },
    courses: {
        course: router.use(`${CONFIG_SERVER.basePath}/courses`, courseRoute),
        section: router.use(`${CONFIG_SERVER.basePath}/courses/sections`, sectionRoute),
        lesson: router.use(`${CONFIG_SERVER.basePath}/courses/lessons`, lessonRoute),
        resource: router.use(`${CONFIG_SERVER.basePath}/courses/lessons/resources`, resourceRoute),
        review: router.use(`${CONFIG_SERVER.basePath}/courses/reviews`, reviewRoute)
    },
    categories: {
        categorie: router.use(`${CONFIG_SERVER.basePath}/categories`, categorieRoute)
    },
    enrollment: {
        enrollment: router.use(`${CONFIG_SERVER.basePath}/enrollments`, enrollmentRouter)
    }
}