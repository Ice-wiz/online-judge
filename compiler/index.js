// Import required modules
const cookieParser = require("cookie-parser")
const express = require('express');
const cors = require('cors');
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const axios = require('axios'); // To interact with the backend service
const config = require('./config/config');
const auth = require('./middlewares/auth');

// Create an instance of express
const app = express();
app.use(cookieParser())
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

// Endpoint to run code with custom input
app.post("/run", async (req, res) => {
    console.log("Run code request received");
    const { language = 'cpp', code, input } = req.body;
    if (!code) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        const output = await executeCpp(filePath, inputPath);
        console.log("Code execution output:", output);
        res.json({ output });
    } catch (error) {
        console.error("Error executing code:", error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to submit code and validate against problem test cases
app.post("/submit", auth, async (req, res) => {
    console.log("yesssss")
    const { language = "cpp", code, problemId } = req.body;
    const id = problemId

    if (!code) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }
    console.log("jere")
    try {
        console.log("in try")
        const response = await axios.get(`http://localhost:8000/v1/problems/${id}`, {
            withCredentials: true // Include cookies in the request
        });
        const problem = response.data;
        console.log(problem);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const { testCases } = problem;
        const results = [];

        // Execute code with each test case
        for (const testCase of testCases) {
            const { input, expectedOutput } = testCase;

            try {
                const filePath = await generateFile(language, code);
                const inputPath = await generateInputFile(input);
                const output = await executeCpp(filePath, inputPath);
                
                // Compare output with expected output
                const verdict = (output.trim() === expectedOutput.trim()) ? 'Accepted' : 'Wrong Answer';
                results.push({ testCase, output, verdict });
            } catch (error) {
                console.error('Error executing code:', error);
                results.push({ testCase, verdict: 'Error', errorMessage: error.message });
            }
        }

        // Determine overall verdict based on test case results
        const overallVerdict = results.every(result => result.verdict === 'Accepted') ? 'Accepted' : 'Wrong Answer';

        // Save submission details to the backend
        // await axios.post('http://localhost:8000/v1/submissions', {
        //     problem: problemId,
        //     verdict: overallVerdict,
        //     submittedAt: new Date(),
        //     results: results // Include detailed test case results
        // });

        // return res.status(200).json({ success: true, verdict: overallVerdict, results });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Compiler service is listening on port ${PORT}`);
});
