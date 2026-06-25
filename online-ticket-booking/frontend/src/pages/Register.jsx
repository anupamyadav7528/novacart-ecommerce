import { useState } from 'react';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      // Backend API call
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess('Registration Successful! Redirecting to login...');
      
      // 2 second baad login page par bhej dega
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-950 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create Account</h2>
        
        {/* Error & Success Messages */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-gray-400" />
              <input type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              <input type="email" placeholder="name@example.com" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-300 shadow-md">Sign Up</button>
        </form>
        <p className="text-center text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link></p>
      </div>
    </div>
  );
}