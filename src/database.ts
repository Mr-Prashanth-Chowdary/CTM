import mongoose from 'mongoose';

const MONGO_URL: string = process.env.MONGO_URL!;

export async function connectToDB() {
  try {
    mongoose.connect(MONGO_URL);
  } catch (error: any) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export async function mongooseConnection() {
  try {
    const db = mongoose.connection;
    return db;
  } catch (error: any) {
    console.error('Unable to return db connection:', error);
    throw error;
  }
}
