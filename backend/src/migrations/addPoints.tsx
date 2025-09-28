// src/migrations/addPointsToUsers.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User'; // Adjust path if necessary

// Load environment variables
dotenv.config({ path: '../.env' }); // Adjust path to your .env file

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected for migration: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

const runMigration = async () => {
  await connectDB();

  try {
    const result = await User.updateMany(
      { points: { $exists: false } }, // Find all users who DON'T have a points field
      { $set: { points: 0 } }        // Set the points field to 0
    );

    console.log('Migration successful!');
    console.log(`Documents matched: ${result.matchedCount}`);
    console.log(`Documents modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.connection.close();
        
    process.exit(0);
  }
};

runMigration();