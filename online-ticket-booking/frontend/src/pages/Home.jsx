import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiSearch, FiUser, FiLogOut, FiClock } from 'react-icons/fi';
import axios from 'axios';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '', date: '' });
  const [user, setUser] = useState(null);
  const [trains, setTrains] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      // Production relative URL path
      const response = await axios.get(
        `/api/trains/search?from=${searchQuery.from}&to=${searchQuery.to}`
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

  const handleBookTicket = async (train) => {
    if (!user) {
      alert("Please login first to book tickets!");
      navigate('/login');
      return;
    }

    try {
      // 1. Fetch Razorpay Order from serverless backend
      const res = await axios.post('/api/trains/book', {
        price: train.price
      });

      if (res.data.success) {
        const { order_id, amount, key_id } = res.data;

        // 2. Open Official Razorpay Checkout Modal
        const options = {
          key: key_id,
          amount: amount,
          currency: "INR",
          name: "BLW Ticket Booking",
          description: `Ticket Booking for ${train.trainName}`,
          order_id: order_id,
          handler: function (response) {
            alert(`🎉 Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nYour ticket is confirmed live!`);
            
            // Deduct seats visually on matrix dashboard
            setTrains(prevTrains =>
              prevTrains.map(t =>
                t._id === train._id ? { ...t, seatsAvailable: t.seatsAvailable - 1 } : t
              )
            );
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: "#1e3a8a",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (err) {
      alert("Error initializing payment gateway.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
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

      {/* HERO & SEARCH BAR */}
      <header className="bg-gradient-to-b from-indigo-900 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            {user ? `Welcome Back, ${user.name}!` : 'Book Your Train Tickets Online'}
          </h1>
          <p className="text-lg text-blue-200">Safe, reliable, and lightning-fast ticket booking for BLW operations.</p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 text-gray-800">
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

      {/* AVAILABLE TRAINS MATRIX */}
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
                    onClick={() => handleBookTicket(train)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}