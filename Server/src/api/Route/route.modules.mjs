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

// Monta todas las rutas en el router principal
router.use(`${CONFIG_SERVER.basePath}/users`, userRoute);
router.use(`${CONFIG_SERVER.basePath}/instructors`, instructorRoute);
router.use(`${CONFIG_SERVER.basePath}/courses`, courseRoute);
router.use(`${CONFIG_SERVER.basePath}/courses/sections`, sectionRoute);
router.use(`${CONFIG_SERVER.basePath}/courses/lessons`, lessonRoute);
router.use(`${CONFIG_SERVER.basePath}/courses/lessons/resources`, resourceRoute);
router.use(`${CONFIG_SERVER.basePath}/courses/reviews`, reviewRoute);
router.use(`${CONFIG_SERVER.basePath}/categories`, categorieRoute);
router.use(`${CONFIG_SERVER.basePath}/enrollments`, enrollmentRouter);

// Exporta solo el router principal
export const RoutesModules = router;