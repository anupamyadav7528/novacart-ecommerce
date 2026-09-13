import { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate add kiya
import api from '../api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Error status dikhane ke liye
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Redirection ke liye hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend API ko data bhej rahe hain (Dhyan dein: Route /login hai, signup nahi)
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        // Token ko browser ki local storage mein save karein taaki user logged in rahe
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        alert('Login Successful!');
        navigate('/'); // Login hote hi user ko Dashboard/Home page par bhej do
      }
    } catch (err) {
      console.error("Login Error:", err);
      // Agar backend se koi message aaya toh wo dikhao, nahi toh default custom error
      setError(err.response?.data?.message || 'Invalid email or password. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-950 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Welcome Back</h2>
        
        {/* Agar koi error aati hai toh red box dikhega */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-300 shadow-md disabled:bg-blue-400"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">New here? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create an account</Link></p>
      </div>
    </div>
  );
}