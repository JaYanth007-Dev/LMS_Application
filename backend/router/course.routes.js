const Router = require("express");
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getLecturesByCourseId,
  addLectureToCourseById,
} = require("../controller/course.controller");
const {
  isLoggedIn,
  authorizedRoles,
} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const router = Router();

router
  .route("/")
  .get(getAllCourses)
  .post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single("thumbnail"),
    createCourse
  );
router
  .route("/:id")
  .get(isLoggedIn, authorizedRoles('ADMIN'), getLecturesByCourseId)
  .put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn, authorizedRoles('ADMIN'), deleteCourse)
  .post(isLoggedIn, authorizedRoles('ADMIN'),upload.single('lecture'),addLectureToCourseById)

module.exports = router;
