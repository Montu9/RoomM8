const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose
        .connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("Successfully connect to MongoDB."))
        .catch((err) => console.error("Connection error", err));
};

module.exports = connectDB;
