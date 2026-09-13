import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiSearch, FiUser, FiLogOut, FiClock } from 'react-icons/fi';
import api from '../api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '', date: '' });
  const [user, setUser] = useState(null);
  const [trains, setTrains] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      api.get('/trains/bookings')
        .then((response) => setBookings(response.data.bookings || []))
        .catch((err) => console.error('Booking history error:', err));
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
    setError('');
    try {
      const response = await api.get('/trains/search', { params: searchQuery });
      if (response.data.success) {
        setTrains(response.data.trains);
      }
    } catch (err) {
      console.error("Search Error:", err);
      setTrains([]);
      setError(err.response?.data?.message || 'Error fetching trains from server.');
    } finally {
      setLoading(false);
    }
  };

  // FULL PRODUCTION SAFE PAYMENT ROUTINE
  const handleBookTicket = async (train) => {
    if (!user) {
      alert("Please login first to book tickets!");
      navigate('/login');
      return;
    }

    try {
      setError('');
      const res = await api.post('/trains/book', train);

      if (res.data.success) {
        setConfirmation(res.data.booking);
        setBookings(prevBookings => [res.data.booking, ...prevBookings]);
        setTrains(prevTrains => prevTrains.map(t =>
          t._id === train._id ? { ...t, seatsAvailable: Math.max(0, t.seatsAvailable - 1) } : t
        ));
      }
    } catch (err) {
      console.error("Booking Gateway Error:", err);
      setError(err.response?.data?.message || 'Unable to confirm this booking.');
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
                <a href="#bookings" className="text-sm font-semibold hover:text-yellow-400">My bookings</a>
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

      {/* HERO & SEARCH CONTROL PANEL */}
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

      {/* SEARCH GRID DISPLAY MATRIX */}
      {searched && (
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Trains Matrix</h2>
          {error && <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">{error}</div>}
          {confirmation && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-900">
              <h3 className="text-xl font-bold">Booking confirmed</h3>
              <p className="mt-1">Order ID: <strong>{confirmation.orderId}</strong></p>
              <p>{confirmation.trainName} · {confirmation.journeyDate} · ₹{confirmation.amount}</p>
            </div>
          )}
          <div className="space-y-4">
            {!loading && trains.length === 0 && <p className="rounded-xl bg-white p-6 text-gray-600">No trains found for this route and date.</p>}
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
      {user && bookings.length > 0 && (
        <section id="bookings" className="max-w-5xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My bookings</h2>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <p className="font-bold text-gray-900">{booking.trainName} ({booking.trainNumber})</p>
                    <p className="text-sm text-gray-600">{booking.fromStation} → {booking.toStation} · {booking.journeyDate}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-green-700">Confirmed · ₹{booking.amount}</p>
                    <p className="text-xs text-gray-500">{booking.orderId}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}