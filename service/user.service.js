
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../jwt/token.service");

// SIGNUP
const signupUser = async (userData) => {
    const { name, email, password, department, phone } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        department,
        role: "Student"
    });

    return {
        message: "Signup successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

// LOGIN
const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    });

    return {
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    signupUser,
    loginUser
};
