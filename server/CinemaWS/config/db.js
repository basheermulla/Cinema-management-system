const mongoose = require('mongoose');
const { MONGO_URL } = process.env;

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(MONGO_URL, {});
        console.log('MongoDB Connected...');
    } catch (err) {
        console.log("database connection failed. exiting now...");
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;