import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from the .env file

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI is not defined in the .env file');
}

const connectDB = async () => {
  try {
    // Removed useNewUrlParser and useUnifiedTopology as they are not needed in recent mongoose versions
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;
