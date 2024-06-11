const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    testCases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestCase' // Reference to TestCase collection
    }],
    sampleTestCases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestCase' // Reference to TestCase collection
    }],
    executionTimeLimit: {
        type: Number, // Time limit in milliseconds
        default: 1000 // Default to 1 second
    },
    memoryLimit: {
        type: Number, // Memory limit in megabytes
        default: 128 // Default to 128MB
    }
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
