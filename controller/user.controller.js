
const User = require("../models/user.model");
const {
    signupUser,
    loginUser
} = require("../service/user.service");

// SIGNUP
const signup = async (req, res) => {
    try {
        const result = await signupUser(req.body);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await loginUser(email, password);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

// GET ALL STUDENTS
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "Student" })
            .select("-password");

        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch students"
        });
    }
};

// GET STUDENT BY ID
const getStudentById = async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: "Student"
        }).select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json(student);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }
};

// GET ALL TEACHERS
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: "Teacher" })
            .select("-password");

        return res.status(200).json(teachers);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch teachers"
        });
    }
};

// GET TEACHER BY ID
const getTeacherById = async (req, res) => {
    try {
        const teacher = await User.findOne({
            _id: req.params.id,
            role: "Teacher"
        }).select("-password");

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        return res.status(200).json(teacher);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid teacher ID"
        });
    }
};

// UPDATE OWN PROFILE
const updateMyProfile = async (req, res) => {
    try {
        const { name, department, phone } = req.body;

        const updates = {};

        if (name !== undefined) updates.name = name;
        if (department !== undefined) updates.department = department;
        if (phone !== undefined) updates.phone = phone;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to update profile"
        });
    }
};

// TEACHER UPDATES A STUDENT
const updateStudent = async (req, res) => {
    try {
        const { name, department, phone } = req.body;

        const updates = {};

        if (name !== undefined) updates.name = name;
        if (department !== undefined) updates.department = department;
        if (phone !== undefined) updates.phone = phone;

        const student = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "Student"
            },
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json({
            message: "Student updated successfully",
            student
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to update student"
        });
    }
};

module.exports = {
    signup,
    login,
    getAllStudents,
    getStudentById,
    getAllTeachers,
    getTeacherById,
    updateMyProfile,
    updateStudent
};
