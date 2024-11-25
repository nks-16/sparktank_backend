import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import teamRouter from './routes/teamRouter';
import transactionRouter from './routes/transactionRouter';
import cors from 'cors';
dotenv.config();  // Load environment variables

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection URL from .env
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  throw new Error('MONGO_URI is not defined in the environment variables.');
}

// Function to check and create collections if they don't exist
const ensureCollectionsExist = async () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('Database connection is not initialized.');
  }

  // Check and create 'teams' collection
  const teamCollection = await db.listCollections({ name: 'teams' }).next();
  if (!teamCollection) {
    console.log("Creating 'teams' collection...");
    await db.createCollection('teams');
    console.log("'teams' collection created.");
  }

  // Check and create 'transactions' collection
  const transactionCollection = await db.listCollections({ name: 'transactions' }).next();
  if (!transactionCollection) {
    console.log("Creating 'transactions' collection...");
    await db.createCollection('transactions');
    console.log("'transactions' collection created.");
  }
};

// Connect to MongoDB Atlas
mongoose.connect(dbURI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    await ensureCollectionsExist(); // Ensure collections exist
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/teams', teamRouter);
app.use('/transactions', transactionRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
