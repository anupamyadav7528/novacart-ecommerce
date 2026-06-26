import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiSearch, FiUser, FiLogOut, FiClock, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '', date: '' });
  const [user, setUser] = useState(null);
  const [trains, setTrains] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // PAYMENT STATES
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Logged out successfully!');
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/trains/search?from=${searchQuery.from}&to=${searchQuery.to}`
      );
      if (response.data.success) {
        setTrains(response.data.trains);
      }
    } catch (err) {
      console.error("Search Error:", err);
      alert("Error fetching trains from server.");
    } finally {
      setLoading(false);
    }
  };

  // 1. JAB USER BOOK NOW DABAYEGA
  const initiaitePayment = (train) => {
    if (!user) {
      alert("Please login first to book tickets!");
      navigate('/login');
      return;
    }
    setSelectedTrain(train);
    setShowPaymentModal(true);
    setPaymentSuccess(false);
    setPaymentProcessing(false);
  };

  // 2. JAB USER PAYMENT MODE SELECT KARIYEGA (SIMULATION CHALEGI)
  const handleSimulatedPayment = async (method) => {
    setPaymentProcessing(true);
    
    // 2 second ka fake loading network delay delay create karenge bilkul asli jaisa
    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/trains/book', {
          trainId: selectedTrain._id,
          seatsToBook: 1
        });

        if (response.data.success) {
          setPaymentProcessing(false);
          setPaymentSuccess(true);
          
          // Live state updates count on back grid screen
          setTrains(prevTrains =>
            prevTrains.map(t =>
              t._id === selectedTrain._id ? { ...t, seatsAvailable: response.data.remainingSeats } : t
            )
          );
        }
      } catch (err) {
        setPaymentProcessing(false);
        alert("Booking matrix failed.");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl">🚄</span>
            <span className="text-xl font-extrabold tracking-wider">BLW-TICKET</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-400 transition font-medium">Home</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 bg-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-700">
                  <FiUser className="text-yellow-400" />
                  <span className="font-semibold text-sm max-w-[120px] truncate">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition shadow-sm font-semibold text-sm">
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow-sm font-semibold">
                <FiUser />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative bg-gradient-to-b from-indigo-900 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            {user ? `Welcome Back, ${user.name}!` : 'Book Your Train Tickets Online'}
          </h1>
          <p className="text-lg text-blue-200">Safe, reliable, and lightning-fast ticket booking for BLW operations.</p>
        </div>

        {/* Search Input Box */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-800">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">From Station</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3.5 text-blue-600 text-lg" />
                <input 
                  type="text" 
                  placeholder="e.g. VARANASI" 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
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
              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg flex items-center justify-center space-x-2 text-lg">
                <FiSearch className="stroke-[3]" />
                <span>{loading ? 'Searching...' : 'Search Trains'}</span>
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* DYNAMIC MATRIX VIEW */}
      {searched && (
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Trains Matrix</h2>
          <div className="space-y-4">
            {trains.map((train) => (
              <div key={train._id} className="bg-white border rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md">{train.trainNumber}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{train.trainName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center"><FiClock className="mr-1 text-blue-600" /> {train.departureTime} ({train.fromStation})</span>
                    <span>➔</span>
                    <span>{train.arrivalTime} ({train.toStation})</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">Availability</p>
                    <p className="text-lg font-bold text-green-600">{train.seatsAvailable} Seats left</p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">₹{train.price}</p>
                  </div>
                  
                  <button 
                    onClick={() => initiaitePayment(train)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition duration-200 shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= RAZORPAY SIMULATED CHECKOUT MODAL POPUP ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            
            {/* Header */}
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white p-1 rounded font-bold text-xs">RPAY</span>
                <span className="font-semibold text-sm tracking-wide">Razorpay Checkout Sandbox</span>
              </div>
              {!paymentProcessing && !paymentSuccess && (
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* STATE 1: SELECTION MODE */}
              {!paymentProcessing && !paymentSuccess && (
                <div>
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Booking Summary</p>
                    <h4 className="font-extrabold text-lg text-gray-800 mt-1">{selectedTrain?.trainName}</h4>
                    <p className="text-sm text-gray-600 mt-1 font-medium">{selectedTrain?.fromStation} ➔ {selectedTrain?.toStation}</p>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Total Amount:</span>
                      <span className="text-2xl font-black text-slate-900">₹{selectedTrain?.price}</span>
                    </div>
                  </div>

                  <h5 className="text-sm font-bold text-gray-700 mb-3">Select Payment Method</h5>
                  <div className="space-y-3">
                    <button onClick={() => handleSimulatedPayment('UPI')} className="w-full border-2 border-gray-200 hover:border-blue-500 rounded-xl p-3 flex items-center justify-between transition group">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📱</span>
                        <span className="font-bold text-gray-700 group-hover:text-blue-600">BHIM UPI / Paytm / PhonePe</span>
                      </div>
                      <span className="text-gray-400 text-sm">➔</span>
                    </button>
                    <button onClick={() => handleSimulatedPayment('CARD')} className="w-full border-2 border-gray-200 hover:border-blue-500 rounded-xl p-3 flex items-center justify-between transition group">
                      <div className="flex items-center space-x-3">
                        <FiCreditCard className="text-xl text-gray-500 group-hover:text-blue-600" />
                        <span className="font-bold text-gray-700 group-hover:text-blue-600">Credit / Debit Card</span>
                      </div>
                      <span className="text-gray-400 text-sm">➔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 2: PROCESSING MODE */}
              {paymentProcessing && (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h4 className="text-lg font-bold text-gray-800">Processing Secure Transaction...</h4>
                  <p className="text-sm text-gray-500 mt-1">Please do not refresh or close this window.</p>
                </div>
              )}

              {/* STATE 3: SUCCESS CONFIRMATION */}
              {paymentSuccess && (
                <div className="py-6 text-center animate-scaleUp">
                  <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4 stroke-[1.5]" />
                  <h4 className="text-2xl font-extrabold text-gray-900">Payment Successful!</h4>
                  <p className="text-md font-semibold text-green-700 mt-1">🎉 Ticket Confirmed Successfully.</p>
                  <p className="text-xs text-gray-400 mt-4 bg-gray-50 py-2 rounded-lg font-mono">PNR Status updated on central matrix.</p>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition shadow"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INFO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        <p>© 2026 BLW Ticket Booking System. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}