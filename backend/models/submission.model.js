const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },
    problem: {
        type: mongoose.Schema.ObjectId,
        ref:'Problem',
        required: true
    },
    verdict: {
        type: String,
        enum : ['accepted','wrong answer','error']
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
