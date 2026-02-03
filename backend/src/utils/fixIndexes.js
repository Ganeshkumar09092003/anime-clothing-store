
import mongoose from 'mongoose';
import { env } from '../config/env.js';

async function fixIndexes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        // Get the users collection
        const usersCollection = db.collection('users');

        // List all indexes
        const indexes = await usersCollection.indexes();
        console.log('\nCurrent indexes on users collection:');
        indexes.forEach(index => {
            console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        });

        // Check for and drop the username index if it exists
        const usernameIndex = indexes.find(idx => idx.key && idx.key.username !== undefined);
        if (usernameIndex) {
            console.log(`\nDropping stale username index: ${usernameIndex.name}`);
            await usersCollection.dropIndex(usernameIndex.name);
            console.log('Username index dropped successfully!');
        } else {
            console.log('\nNo stale username index found.');
        }

        // List indexes after cleanup
        const updatedIndexes = await usersCollection.indexes();
        console.log('\nUpdated indexes on users collection:');
        updatedIndexes.forEach(index => {
            console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        });

        console.log('\nIndex cleanup completed!');

    } catch (error) {
        console.error('Error fixing indexes:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

fixIndexes();
