const config = require('../config/config')
const Problem = require('../models/problem.model');
const TestCase = require('../models/testCase.model');

const getProblemById = async (req, res) => {
    const { id } = req.params; // Get the problem ID from the URL

    try {
        // Find the problem by ID
        const problem = await Problem.findById(id).populate('testCases').populate('sampleTestCases');

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // Send the problem details as a response
        res.status(200).json(problem);
    } catch (error) {
        console.error(`Error fetching problem by ID: ${id}`, error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find({}).populate('testCases');
        res.json(problems);
    } catch (error) {
        res.status(401).json({ message: "error fetching problems" });
    }
}


module.exports={
    getAllProblems,
    getProblemById
}