import mongoose from "mongoose";

// Function to connect to MongoDB
const connectDB = async () => {
  try {

    // Connect to MongoDB using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URL);

    // Log the connection details
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database: ${conn.connection.name}`);

  } catch (error) {
    // Log any errors that occur during the connection process
    console.error(`Error: ${error.message}`);
    // Exit the process with a failure code
    process.exit(1); 
  }
};

export default connectDB;