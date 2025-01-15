const Course = require("../models/course.model");
const AppError = require("../utils/appError");
const cloudinary = require("cloudinary");
const fs = require("fs/promises");


const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select("--lectures");
    res.status(200).json({
      success: true,
      message: "All courses",
      courses,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const getLecturesByCourseId = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new AppError("Course not found", 404));
        }
        
        res.status(200).json({
            success: true,
            message: "Lectures by course id",
            lectures
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};
    
const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy } = req.body;
        
        if (!title || !createdBy || !category || !description) {
            return next(new AppError("Please fill all fields", 400));
        }
        

        const course = await Course.create({
          title,
          description,
          category,
            createdBy,
            thumbnail: {
                public_id: "undefined",
                secure_url:"undefined"
          }
        });


        if (req.file) {
            console.log("--------if file")
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
                width: 250,
                height: 250,
                gravity: "faces",
                crop: "fill",
            }); 
            
            console.log("--------if result",result)
            if (result) {
                console.log("--------if insides result",result)
                course.thumbnail.public_id = result.public_id;
               course.thumbnail.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`)
         
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: "Course created successfully",
            course
        });
     
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}


const updateCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findByIdAndUpdate(courseId,
            {
            $set: req.body
            }, {
                runValidators:true
            })
        
        if (!course) {
            return next(new AppError("Course does not exists", 400))
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        });  
    } catch (error) {
        return next(new AppError(e.message,500))
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new AppError("Course does not exists", 400))
        }

        await Course.findByIdAndDelete(courseId);
        res.status(204).json({
            success: true,
            message: "Course deleted successfully"
        });
        
    } catch (e) {
        return next(new AppError(e.message,500))
    }
}

module.exports = {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    deleteCourse
  
};
