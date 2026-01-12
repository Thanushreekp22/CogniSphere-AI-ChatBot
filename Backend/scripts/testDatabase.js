import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import dotenv from "dotenv";

dotenv.config();

const testDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");

        // Check all threads in database
        const allThreads = await Thread.find({});
        console.log('All threads in database:', allThreads.length);
        
        allThreads.forEach(thread => {
            console.log(`Thread: ${thread.threadId}, User: ${thread.userId}, Title: ${thread.title}`);
        });

        // Test creating a thread
        const testThread = new Thread({
            threadId: 'test-123',
            userId: 'test-user@example.com',
            userEmail: 'test-user@example.com',
            title: 'Test Thread',
            messages: [{
                role: 'user',
                content: 'Test message'
            }]
        });

        await testThread.save();
        console.log('Test thread created successfully');

        // Test finding the thread
        const foundThread = await Thread.findOne({ userId: 'test-user@example.com' });
        console.log('Found test thread:', !!foundThread);

        // Clean up test thread
        await Thread.deleteOne({ threadId: 'test-123' });
        console.log('Test thread cleaned up');

    } catch (error) {
        console.error("Error testing database:", error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log("Database connection closed");
        process.exit(0);
    }
};

testDatabase();
