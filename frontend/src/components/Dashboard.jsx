import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    useEffect(() => {
        // Fetch problems from the backend
        const fetchProblems = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/problems/all', {
                    withCredentials: true // Include cookies in the request if needed
                });
                setProblems(response.data); // Assuming the response data is an array of problems
                setLoading(false);
            } catch (err) {
                setError(err.response?.data || err.message);
                setLoading(false);
            }
        };

        fetchProblems();
    }, []); // Empty dependency array to run only once on component mount

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/v1/auth/logout', {}, {
                withCredentials: true // Include cookies in the request
            });

            if (response.status === 201) {
                console.log('Logout successful:', response.data);
                alert("You have been logged out, redirecting to the login page.");
                localStorage.removeItem('token'); // Assuming you store tokens here
                navigate('/');
            }
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
        }
    };

    const handleDifficultyClick = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    // Filter problems based on difficulty
    const filteredProblems = problems.filter((problem) => {
        if (selectedDifficulty === 'All') return true;
        return problem.difficulty === selectedDifficulty.toLowerCase();
    });

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Sidebar */}
            <div className="w-1/4 bg-white p-6 border-r">
                <h2 className="text-2xl font-semibold mb-4">Navigation</h2>
                <ul className="space-y-2">
                    <li
                        className={`text-blue-600 cursor-pointer hover:underline ${selectedDifficulty === 'All' ? 'font-bold' : ''}`}
                        onClick={() => handleDifficultyClick('All')}
                    >
                        All Problems
                    </li>
                    <li
                        className={`text-blue-600 cursor-pointer hover:underline ${selectedDifficulty === 'Easy' ? 'font-bold' : ''}`}
                        onClick={() => handleDifficultyClick('Easy')}
                    >
                        Easy
                    </li>
                    <li
                        className={`text-blue-600 cursor-pointer hover:underline ${selectedDifficulty === 'Medium' ? 'font-bold' : ''}`}
                        onClick={() => handleDifficultyClick('Medium')}
                    >
                        Medium
                    </li>
                    <li
                        className={`text-blue-600 cursor-pointer hover:underline ${selectedDifficulty === 'Hard' ? 'font-bold' : ''}`}
                        onClick={() => handleDifficultyClick('Hard')}
                    >
                        Hard
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>

                {/* Problems List */}
                {loading ? (
                    <p>Loading problems...</p>
                ) : error ? (
                    <p className="text-red-500">Error fetching problems: {error}</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredProblems.map((problem) => (
                            <Link to={`/problems/${problem._id}`} key={problem._id}>
                                <div className="p-4 bg-white rounded-lg shadow hover:bg-gray-50">
                                    <h2 className="text-xl font-semibold">{problem.title}</h2>
                                    <p className="mt-2 text-gray-700">{problem.description}</p>
                                    <p className="mt-1 text-sm text-gray-500">Difficulty: {problem.difficulty}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
