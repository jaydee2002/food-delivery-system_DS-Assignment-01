import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import validator from 'validator';

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // validation
  if (!name || !email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'Name, email, and password are required',
      code: 'MISSING_FIELDS',
    });
  }

  // check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      status: 409,
      message: 'User already exists',
      code: 'USER_EXISTS',
    });
  }

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // if role is undefined, schema default ('customer') will apply
    });

    // send response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Registration error:', error); // log the full error
    res.status(500).json({
      status: 500,
      message: 'Failed to register user',
      code: 'SERVER_ERROR',
      error: error.message, // include error message for debugging
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'Email and password are required',
      code: 'MISSING_FIELDS',
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid email format',
      code: 'INVALID_EMAIL',
    });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      status: 401,
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};
