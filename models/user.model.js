const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // exclude from queries by default
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ['student', 'teacher'],
        message: 'Role must be either student or teacher',
      },
    },
    department: {
      type: String,
      trim: true,
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true, // allow null for teachers
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true, // allow null for students
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Conditional validation for role‑specific fields
userSchema.pre('validate', function (next) {
  if (this.role === 'student' && !this.rollNumber) {
    this.invalidate('rollNumber', 'Roll number is required for students');
  }
  if (this.role === 'teacher' && !this.employeeId) {
    this.invalidate('employeeId', 'Employee ID is required for teachers');
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare entered password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
