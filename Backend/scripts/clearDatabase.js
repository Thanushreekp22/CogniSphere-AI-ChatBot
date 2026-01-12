import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import dotenv from "dotenv";

dotenv.config();

const clearDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");

        // Clear all threads/chats
        const result = await Thread.deleteMany({});
        console.log(`Deleted ${result.deletedCount} threads from database`);

        // If you have a User model, uncomment the lines below:
        // const User = mongoose.model('User');
        // const userResult = await User.deleteMany({});
        // console.log(`Deleted ${userResult.deletedCount} users from database`);

        console.log("Database cleared successfully!");
        
    } catch (error) {
        console.error("Error clearing database:", error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log("Database connection closed");
        process.exit(0);
    }
};

clearDatabase();
