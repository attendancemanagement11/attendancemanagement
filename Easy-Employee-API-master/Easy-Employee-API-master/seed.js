const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user-model')
// Connect to MongoDB (replace with your own connection string)
mongoose.connect('mongodb+srv://kuleswariexpertsolutions:w5F2FkJHr8TKnOyU@cluster0.unm3o.mongodb.net/hrms1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");

    // Function to create an admin
    const createAdmin = async () => {
        const admin = new User({
            name: "Admin User",
            email: "admin@example.com",
            username: "adminuser",
            mobile: 1234567890,  // Example mobile number
            password: "adminPassword123",  // Example password
            type: "admin",  // Set user type as admin
            status: "active",
        });

        try {
            // Save the admin user to the database
            await admin.save();
            console.log("Admin user created successfully");
            mongoose.connection.close();  // Close connection
        } catch (error) {
            console.error("Error creating admin user:", error);
            mongoose.connection.close();  // Close connection
        }
    };

    // Call the function to create an admin
    createAdmin();

}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
