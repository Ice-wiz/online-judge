const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ] 
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    solvedProblems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem', // Reference to the Problem model
        default:[]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
