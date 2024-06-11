import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';

const ProblemDetails = () => {
    const { id } = useParams(); // Get the problem ID from the URL
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('// Write your code here...');
    const [input, setInput] = useState(''); // State to hold user input
    const [output, setOutput] = useState('');
    const [verdicts, setVerdicts] = useState([]); // To store the verdicts of test cases
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false); // To track the submission state

    useEffect(() => {
        // Fetch the problem details from the backend
        const fetchProblemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/v1/problems/${id}`, {
                    withCredentials: true // Include cookies in the request if needed
                });
                setProblem(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data || err.message);
                setLoading(false);
            }
        };

        fetchProblemDetails();
    }, [id]); // Run this effect whenever the ID changes

    const handleRunCode = async () => {
        setRunning(true);
        setOutput(''); // Clear previous output

        try {
            // Properly format the data as URL-encoded
            const params = new URLSearchParams();
            params.append('code', code);
            params.append('input', input); // Include the user input

            // Send the POST request with URL-encoded data
            const response = await axios.post('http://localhost:3000/run', params.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            // Ensure the response data is a string for safe rendering
            const result = response.data.output;
            if (typeof result === 'string' || Array.isArray(result)) {
                setOutput(result);
            } else if (typeof result === 'object') {
                // Convert object to a readable string format
                setOutput(JSON.stringify(result, null, 2));
            }
        } catch (err) {
            console.error('Error running code:', err);
            // Ensure the error message is rendered safely
            setOutput(err.response?.data?.error || err.message || 'An unknown error occurred');
        } finally {
            setRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        setSubmitting(true);
        setVerdicts([]); // Clear previous verdicts

        try {
            const response = await axios.post('http://localhost:3000/submit', {
                code,
                problemId: id
            });

            // Process the response and set the verdicts
            if (response.data.success) {
                setVerdicts(response.data.verdicts);
            } else {
                setOutput(response.data.error || 'Submission failed');
            }
        } catch (err) {
            console.error('Error submitting code:', err);
            setOutput(err.response?.data?.error || err.message || 'An unknown error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p>Loading problem details...</p>;
    if (error) return <p className="text-red-500">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Side: Problem Details */}
            <div className="w-1/2 p-6 bg-white overflow-y-auto border-r">
                {problem && (
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
                        <p className="text-lg mb-4">{problem.description}</p>
                        <p className="text-sm text-gray-500 mb-4">Difficulty: {problem.difficulty}</p>
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Test Cases</h2>
                            <ul className="list-disc ml-5">
                                {problem.testCases.map((testCase, index) => (
                                    <li key={index} className="mb-2">
                                        <span className="font-semibold">Input:</span> {JSON.stringify(testCase.input)}
                                        <br />
                                        <span className="font-semibold">Expected Output:</span> {JSON.stringify(testCase.expectedOutput)}
                                        <br />
                                        <span className="text-sm text-gray-500">{testCase.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Code Editor */}
            <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4">Code Editor</h2>
                <MonacoEditor
                    height="50vh"
                    language="cpp"
                    theme="vs-dark"
                    options={{
                        selectOnLineNumbers: true,
                        automaticLayout: true,
                    }}
                    value={code}
                    onChange={(value) => setCode(value)}
                />
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Custom Input</h2>
                    <textarea
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter custom input..."
                    />
                </div>
                <div className="mt-4 flex space-x-4">
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md ${running && 'opacity-50 cursor-not-allowed'}`}
                        onClick={handleRunCode}
                        disabled={running}
                    >
                        {running ? 'Running...' : 'Run Code'}
                    </button>
                    <button
                        className={`bg-green-500 text-white px-4 py-2 rounded-md ${submitting && 'opacity-50 cursor-not-allowed'}`}
                        onClick={handleSubmitCode}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Code'}
                    </button>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Output</h2>
                    <pre>{typeof output === 'string' ? output : JSON.stringify(output, null, 2)}</pre>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Verdicts</h2>
                    {verdicts.length > 0 ? (
                        <ul className="list-disc ml-5">
                            {verdicts.map((verdict, index) => (
                                <li key={index} className="mb-2">
                                    <span className={`font-semibold ${verdict.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                                        {verdict.status.toUpperCase()}
                                    </span>
                                    <br />
                                    <span className="font-semibold">Input:</span> {JSON.stringify(verdict.input)}
                                    <br />
                                    <span className="font-semibold">Your Output:</span> {JSON.stringify(verdict.output)}
                                    <br />
                                    <span className="font-semibold">Expected Output:</span> {JSON.stringify(verdict.expectedOutput)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No verdicts available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemDetails;
