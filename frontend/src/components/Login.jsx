// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/v1/auth/login', {
        email,
        password
      },{withCredentials: true});
      // Handle success response

      console.log('Login successful:', response.data);
      if (response.status === 201) { // Check if the response status is 200
        console.log('login successful:', response.data);

        // Clear form fields
        setEmail('');
        setPassword('');

        // Redirect to the dashboard
        navigate('/dashboard');
    }
      // You might want to save tokens or user info here
    } catch (error) {
      // Handle error response
      console.error('Login failed:', error.response?.data || error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
