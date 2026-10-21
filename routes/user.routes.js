
const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/auth.middleware");
const permissionMiddleware = require("../middleware/permission.middleware");

const {
    signup,
    login,
    getAllStudents,
    getStudentById,
    getAllTeachers,
    getTeacherById,
    updateMyProfile,
    updateStudent
} = require("../controller/user.controller");

// PUBLIC ROUTES
router.post("/signup", signup);
router.post("/login", login);

// STUDENT + TEACHER ROUTES
router.get(
    "/students",
    authMiddleware,
    permissionMiddleware("Student", "Teacher"),
    getAllStudents
);

router.get(
    "/students/:id",
    authMiddleware,
    permissionMiddleware("Student", "Teacher"),
    getStudentById
);

router.patch(
    "/profile",
    authMiddleware,
    permissionMiddleware("Student", "Teacher"),
    updateMyProfile
);

// TEACHER-ONLY ROUTES
router.get(
    "/teachers",
    authMiddleware,
    permissionMiddleware("Teacher"),
    getAllTeachers
);

router.get(
    "/teachers/:id",
    authMiddleware,
    permissionMiddleware("Teacher"),
    getTeacherById
);

router.patch(
    "/students/:id",
    authMiddleware,
    permissionMiddleware("Teacher"),
    updateStudent
);

module.exports = router;
