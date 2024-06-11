const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
    },
    expectedOutput: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false 
    },
    description: {
        type: String,
        default: '' 
    }
});

const TestCase = mongoose.model('TestCase', testCaseSchema);

module.exports = TestCase;
