// Import required modules
const express = require('express');
const cors = require('cors');
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const Problem = require('./models/problem.model');
const Submission = require('./models/submission.model');


// Create an instance of express
const app = express();

// Middleware setup

const allowedOrigins = ['http://localhost:5173']; // Your frontend origin

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // Allow cookies and other credentials to be sent
}));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Define routes
app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    console.log("hii");
    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        const output = await executeCpp(filePath, inputPath);
        console.log(output);
        res.json({ output });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});


app.post("/submit", async (req, res) => {
    const { language = "cpp", code, problemId } = req.body;

    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }

    try {
        const problem = await Problem.findById(problemId).populate('testCases');

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const {testCases} = problem;
        const results = [];

        // Execute code with each test case
        for (const testCase of testCases) {
            const { input, expectedOutput } = testCase;

            try {
                const filePath = await generateFile(language, code);
                const inputPath = await generateInputFile(input);
                const output = await executeCpp(filePath, inputPath);
                
                // Compare output with expected output
                const verdict = (output === expectedOutput) ? 'Accepted' : 'Wrong Answer';
                results.push({ testCase, output, verdict });
            } catch (error) {
                console.error('Error executing code:', error);
                results.push({ testCase, verdict: 'Error', errorMessage: error.message });
            }
        }

        // Determine overall verdict based on test case results
        const overallVerdict = results.every(result => result.verdict === 'Accepted') ? 'Accepted' : 'Wrong Answer';

        // // Save submission details to the database
        // const submission = new Submission({
        //     user: req.user._id, // Assuming user details are available in req.user
        //     problem: problemId,
        //     verdict: overallVerdict,
        //     submittedAt: new Date()
        // });
        // await submission.save();

        return res.status(200).json({ success: true, verdict: overallVerdict, results: results });
    } catch (err) {
        console.error('Error handling submission:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


// Start the server
app.listen(3000, () => {
    console.log("Server is listening on port 3000!");
});