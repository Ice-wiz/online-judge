import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';

const ProblemDetails = () => {
    const { id } = useParams(); // Get the problem ID from the URL
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>Loading problem details...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

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
                    height="70vh"
                    language="javascript"
                    theme="vs-dark"
                    options={{
                        selectOnLineNumbers: true,
                        automaticLayout: true,
                    }}
                    defaultValue="// Write your code here..."
                />
            </div>
        </div>
    );
};

export default ProblemDetails;
