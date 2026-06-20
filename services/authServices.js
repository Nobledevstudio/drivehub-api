import validator from 'validator'
import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js';

// Register User
export const registerUser = async ({ name, email, password, role }) => {

  // Check if user already exists
  const existingUser = await userModel.findOne({ email });

  // If user exists, throw an error
  if (existingUser) {
    throw new Error("User already exists");
  }
  // Validate email format
  if (!validator.isEmail(email)) {
    throw new Error("Please Enter a Valid Email");
  }
  // Validate password length
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Hash the password before saving to the database
  const salt = await bcrypt.genSalt(10)

  // Hash the password using the generated salt
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create a new user in the database with the provided details
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role: role || "customer", // Default role is "customer" if not provided
    isApproved: role === "dealer" ? false : true, // dealer needs aprroval
  })

  // Generate a token for the newly registered user
  const token = generateToken(user._id)

  // Return the user details along with the generated token
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    },
    token
  }
}

export const loginUser = async ({ email, password }) => {

  // Find the user in the database based on the provided email
  const user = await userModel.findOne({ email })
  
  if (!user) {
    throw new Error('Invalid Credentials')
  }

  // Compare the provided password with the hashed password stored in the database
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Invalid Credentials')
  }

  // If the user is a dealer and their account is not approved, throw an error

  if (user.role === "admin") {
    user.isApproved = true
  }


  if (user.role === "dealer" && !user.isApproved) {
    throw new Error("Your account is pending approval. Please wait for the admin to approve your account.")
  }


  // Generate a token for the authenticated user
  const token = generateToken(user._id)
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    },
    token
  }

}

