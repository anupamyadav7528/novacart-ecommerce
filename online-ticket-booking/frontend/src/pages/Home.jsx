import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiSearch, FiUser } from 'react-icons/fi';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '', date: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching trains from ${searchQuery.from} to ${searchQuery.to} on ${searchQuery.date}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="text-2xl">🚄</span>
            <span className="text-xl font-extrabold tracking-wider">BLW-TICKET</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-400 transition font-medium">Home</Link>
            <Link to="/login" className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow-sm font-semibold">
              <FiUser />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION WITH SEARCH BAR */}
      <header className="relative bg-gradient-to-b from-indigo-900 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            Book Your Train Tickets Online
          </h1>
          <p className="text-lg text-blue-200">
            Safe, reliable, and lightning-fast ticket booking for BLW operations.
          </p>
        </div>

        {/* Search Ticket Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-800">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">From Station</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3.5 text-blue-600 text-lg" />
                <input 
                  type="text" 
                  placeholder="e.g. VARANASI" 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                  onChange={(e) => setSearchQuery({...searchQuery, from: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">To Station</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3.5 text-red-500 text-lg" />
                <input 
                  type="text" 
                  placeholder="e.g. NEW DELHI" 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                  onChange={(e) => setSearchQuery({...searchQuery, to: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Journey Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3.5 text-gray-500 text-lg" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-600"
                  required
                  onChange={(e) => setSearchQuery({...searchQuery, date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg flex items-center justify-center space-x-2 text-lg"
              >
                <FiSearch className="stroke-[3]" />
                <span>Search Trains</span>
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* INFO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose BLW Online Ticket Booking?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-xl font-bold">✓</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Zero Extra Charges</h3>
            <p className="text-gray-600">Enjoy transparent pricing with no hidden service fees during your ticket reservations.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-xl font-bold">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Instant Refunds</h3>
            <p className="text-gray-600">Cancel tickets anytime with our one-click process and get immediate cash-backs.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 text-xl font-bold">🛡️</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Secure Payments</h3>
            <p className="text-gray-600">Your transactions are fully secured with top-tier encrypted payment gateways.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        <p>© 2026 BLW Ticket Booking System. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}