import React, { useState, useEffect } from 'react';
import { getBookingsFromSheet, updateBookingStatus, deleteBookingFromSheet } from '../lib/googleSheets';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');
    
    // Session expires after 24 hours
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isSessionValid = loginTime && (Date.now() - parseInt(loginTime)) < SESSION_DURATION;
    
    if (isAuth && isSessionValid) {
      setIsAuthenticated(true);
      fetchBookings();
    } else {
      // Clear invalid session
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('adminLoginTime');
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setLoading(true);
    fetchBookings();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('adminLoginTime');
      setIsAuthenticated(false);
      setBookings([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookingsFromSheet();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to fetch bookings from Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      alert('Status updated successfully!');
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await deleteBookingFromSheet(bookingId);
      alert('Booking deleted successfully!');
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  const openGoogleSheet = () => {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    window.open(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`, '_blank');
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.bookingStatus?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      (b.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (b.customerEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (b.bookingId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (b.customerPhone || '').includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus?.toLowerCase() === 'confirmed').length,
    completed: bookings.filter(b => b.bookingStatus?.toLowerCase() === 'completed').length,
    cancelled: bookings.filter(b => b.bookingStatus?.toLowerCase() === 'cancelled').length,
    revenue: bookings.reduce((sum, b) => sum + (Number(b.totalFare) || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading bookings from Google Sheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-purple-600 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between">
            {/* Left - Title */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold">Admin Panel - Indus Car Rental</h1>
                <p className="text-purple-100 mt-1">Data synced with Google Sheets</p>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex items-center gap-3">
                <button
                onClick={() => navigate('/queries')}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 flex items-center gap-2 transition"
                >
                💬 Queries
                </button>
                <button
                onClick={openGoogleSheet}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 flex items-center gap-2 transition"
                >
                📊 Google Sheet
                </button>
                <button
                onClick={() => navigate('/')}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 flex items-center gap-2 transition"
                >
                🏠 Home
                </button>
                <button
                onClick={handleLogout}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                🚪 Logout
                </button>
            </div>
            </div>
        </div>
        </div>

      {/* Stats Cards */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <StatCard title="Total Bookings" value={stats.total} icon="📊" color="bg-blue-500" />
          <StatCard title="Confirmed" value={stats.confirmed} icon="✅" color="bg-green-500" />
          <StatCard title="Completed" value={stats.completed} icon="🎉" color="bg-emerald-500" />
          <StatCard title="Cancelled" value={stats.cancelled} icon="❌" color="bg-red-500" />
          <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} icon="💰" color="bg-purple-500" />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
              <FilterButton active={filter === 'confirmed'} onClick={() => setFilter('confirmed')} label="Confirmed" />
              <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')} label="Completed" />
              <FilterButton active={filter === 'cancelled'} onClick={() => setFilter('cancelled')} label="Cancelled" />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by name, email, phone, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 md:w-80 border rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
              />
              <button
                onClick={fetchBookings}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
                title="Refresh data"
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
            <p className="text-xl">📋 No bookings found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
            <button
                onClick={openGoogleSheet}
                className="mt-4 text-purple-600 hover:underline"
            >
                View in Google Sheets →
            </button>
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 border-b">
                <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Booking ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date/Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Route</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Pickup Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Drop Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Pickup Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Car</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Fare</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {filteredBookings.map((booking, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-800">
                        {booking.bookingId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                        <div className="text-xs">{booking.timestamp}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-slate-800">{booking.customerName}</div>
                        <div className="text-slate-500 text-xs">{booking.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                        {booking.customerPhone}
                    </td>
                    <td className="px-4 py-3 text-sm">
                        <div className="text-slate-800">{booking.fromCity || '-'}</div>
                        <div className="text-slate-500 text-xs">→ {booking.toCity || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs">
                        <div className="truncate" title={booking.pickupLocation}>
                        {booking.pickupLocation || '-'}
                        </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-xs">
                        <div className="truncate" title={booking.dropLocation}>
                        {booking.dropLocation || '-'}
                        </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                        <div>{booking.pickupDate}</div>
                        <div className="text-xs text-slate-500">{booking.pickupTime}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                        {booking.carName}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-700">
                        ₹{Number(booking.totalFare || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                        <select
                        value={booking.bookingStatus}
                        onChange={(e) => updateStatus(booking.bookingId, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                            booking.bookingStatus?.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.bookingStatus?.toLowerCase() === 'completed' ? 'bg-blue-100 text-blue-700' :
                            booking.bookingStatus?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                        }`}
                        >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pending">Pending</option>
                        </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                        <button
                        onClick={() => {
                            const details = `
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        BOOKING DETAILS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        📋 Booking ID: ${booking.bookingId}
        📅 Date: ${booking.timestamp}

        👤 CUSTOMER INFORMATION
        Name: ${booking.customerName}
        Email: ${booking.customerEmail}
        Phone: ${booking.customerPhone}

        🚗 TRIP DETAILS
        Type: ${booking.tripType}
        From City: ${booking.fromCity || '-'}
        To City: ${booking.toCity || '-'}
        Pickup Location: ${booking.pickupLocation || '-'}
        Drop Location: ${booking.dropLocation || '-'}
        Pickup Date: ${booking.pickupDate}
        Pickup Time: ${booking.pickupTime}
        Car: ${booking.carName}

        💰 PRICING BREAKDOWN
        Base Fare: ₹${booking.baseFare}
        Driver Allowance: ₹${booking.driverAllowance}
        Taxes (GST): ₹${booking.taxes}
        Services: ${booking.selectedServices}
        Services Total: ₹${booking.servicesTotal}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        TOTAL FARE: ₹${booking.totalFare}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        💳 PAYMENT DETAILS
        Payment Option: ${booking.paymentOption}
        Paid Now: ₹${booking.amountPaidNow}
        Pay Later: ₹${booking.amountPaidLater}

        📄 GST DETAILS
        Has GST: ${booking.hasGST}
        Company: ${booking.gstCompanyName}
        GST Number: ${booking.gstNumber}

        📊 STATUS
        Booking: ${booking.bookingStatus}
        Payment: ${booking.paymentStatus}
                            `.trim();
                            alert(details);
                        }}
                        className="text-purple-600 hover:text-purple-800 font-medium mr-3"
                        >
                        👁️
                        </button>
                        <button
                        onClick={() => deleteBooking(booking.bookingId)}
                        className="text-red-600 hover:text-red-800 font-medium"
                        >
                        🗑️
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-slate-600 text-center">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>All data is stored in your Google Sheet - you can edit it directly there</li>
            <li>Click "Open Google Sheet" to view and export data as Excel</li>
            <li>You can share the sheet with your team for collaborative access</li>
            <li>Use Google Sheets' built-in features for charts, pivot tables, and more</li>
            <li>Your session will expire after 24 hours for security</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition ${
        active
          ? 'bg-purple-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}