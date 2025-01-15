const Router = require("express");
const {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse, 
    getLecturesByCourseId} = require("../controller/course.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const router = Router();

router
    .route("/")
    .get(getAllCourses)
    .post(
        upload.single('thumbnail'),
        createCourse);
router
    .route("/:id")
    .get(isLoggedIn, getLecturesByCourseId)
    .put(updateCourse)
    .delete(deleteCourse); 

module.exports = router;
