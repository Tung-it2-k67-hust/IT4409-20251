
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ============================================
// 1. KẾT NỐI MONGODB ATLAS
// ============================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    process.exit(1);
  }
};

// ============================================
// 2. ĐỊNH NGHĨA SCHEMA & MODEL
// ============================================
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Provide a valid email address'
    ]
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// ============================================
// 3. CRUD CONTROLLERS
// ============================================

// CREATE - Tạo user mới
const createUser = async (req, res, next) => {
  try {
    const { name, email, age, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      age,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    next(error);
  }
};

// READ - Lấy tất cả users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// READ - Lấy user theo ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    next(error);
  }
};

// UPDATE - Cập nhật user
const updateUser = async (req, res, next) => {
  try {
    const { name, email, age, role, isActive } = req.body;

    // Kiểm tra user tồn tại
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Kiểm tra email trùng lặp nếu đổi email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Cập nhật user
    user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age, role, isActive },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    next(error);
  }
};

// DELETE - Xóa user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {}
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    next(error);
  }
};

// ============================================
// 4. ERROR HANDLING MIDDLEWARE
// ============================================
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: err.message
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
      error: `${field} already exists`
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

// 404 Not Found handler
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// ============================================
// 5. EXPRESS APP SETUP
// ============================================
const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// 6. ĐỊNH NGHĨA ROUTES
// ============================================

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User Management API - CRUD Operations',
    version: '1.0.0',
    endpoints: {
      getAllUsers: 'GET /api/users',
      getUserById: 'GET /api/users/:id',
      createUser: 'POST /api/users',
      updateUser: 'PUT /api/users/:id',
      deleteUser: 'DELETE /api/users/:id'
    }
  });
});

// CRUD Routes
app.post('/api/users', createUser);      // CREATE
app.get('/api/users', getAllUsers);      // READ (All)
app.get('/api/users/:id', getUserById);  // READ (By ID)
app.put('/api/users/:id', updateUser);   // UPDATE
app.delete('/api/users/:id', deleteUser); // DELETE

// Error handling (phải đặt sau routes)
app.use(notFound);
app.use(errorHandler);

// ============================================
// 7. KHỞI ĐỘNG SERVER
// ============================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API: http://localhost:${PORT}`);
  console.log(`${'='.repeat(50)}\n`);
});

// Xử lý unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});

