import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, User, Clock, Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function Queries() {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');
    
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    const isSessionValid = loginTime && (Date.now() - parseInt(loginTime)) < SESSION_DURATION;
    
    if (isAuth && isSessionValid) {
      setIsAuthenticated(true);
      fetchQueries();
    } else {
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('adminLoginTime');
      setIsAuthenticated(false);
      navigate('/admin');
    }
  };

  const fetchQueries = async () => {
    try {
      setLoading(true);
      
      // Fetch submissions from Web3Forms API
      const response = await fetch('https://api.web3forms.com/submissions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_WEB3FORMS_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Get read status from localStorage
        const readStatus = JSON.parse(localStorage.getItem('queriesReadStatus') || '{}');
        
        // Map data and add read status
        const queriesWithStatus = (data.submissions || []).map(submission => ({
          id: submission.id || Date.now() + Math.random(),
          name: submission.name || 'N/A',
          email: submission.email || 'N/A',
          phone: submission.phone || 'N/A',
          message: submission.message || 'N/A',
          timestamp: submission.created_at || new Date().toISOString(),
          isRead: readStatus[submission.id] || false
        }));

        setQueries(queriesWithStatus);
      } else {
        throw new Error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      
      // Fallback: Try to get from localStorage (if you want to store locally)
      const localQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
      setQueries(localQueries);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (queryId) => {
    const readStatus = JSON.parse(localStorage.getItem('queriesReadStatus') || '{}');
    readStatus[queryId] = true;
    localStorage.setItem('queriesReadStatus', JSON.stringify(readStatus));
    
    setQueries(queries.map(q => 
      q.id === queryId ? { ...q, isRead: true } : q
    ));
  };

  const markAsUnread = (queryId) => {
    const readStatus = JSON.parse(localStorage.getItem('queriesReadStatus') || '{}');
    readStatus[queryId] = false;
    localStorage.setItem('queriesReadStatus', JSON.stringify(readStatus));
    
    setQueries(queries.map(q => 
      q.id === queryId ? { ...q, isRead: false } : q
    ));
  };

  const deleteQuery = (queryId) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;
    
    setQueries(queries.filter(q => q.id !== queryId));
    
    // Also remove from localStorage
    const readStatus = JSON.parse(localStorage.getItem('queriesReadStatus') || '{}');
    delete readStatus[queryId];
    localStorage.setItem('queriesReadStatus', JSON.stringify(readStatus));
  };

  const filteredQueries = queries.filter(q => {
    const matchesSearch = 
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.phone.includes(searchTerm) ||
      q.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'read' && q.isRead) ||
      (filterStatus === 'unread' && !q.isRead);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: queries.length,
    unread: queries.filter(q => !q.isRead).length,
    read: queries.filter(q => q.isRead).length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Please login to access this page</p>
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading queries...</p>
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
            <button
              onClick={() => navigate('/admin')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 flex items-center gap-2"
            >
              ← Back to Admin
            </button>

            <div className="flex-1 text-center mx-6">
              <h1 className="text-3xl font-bold">Contact Form Queries</h1>
              <p className="text-purple-100 mt-1">Manage customer inquiries</p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Total Queries" 
            value={stats.total} 
            icon="📧" 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Unread" 
            value={stats.unread} 
            icon="🔔" 
            color="bg-orange-500" 
          />
          <StatCard 
            title="Read" 
            value={stats.read} 
            icon="✅" 
            color="bg-green-500" 
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <FilterButton 
                active={filterStatus === 'all'} 
                onClick={() => setFilterStatus('all')} 
                label="All" 
              />
              <FilterButton 
                active={filterStatus === 'unread'} 
                onClick={() => setFilterStatus('unread')} 
                label="Unread" 
              />
              <FilterButton 
                active={filterStatus === 'read'} 
                onClick={() => setFilterStatus('read')} 
                label="Read" 
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
              <button
                onClick={fetchQueries}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Queries List */}
        <div className="space-y-4">
          {filteredQueries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Mail className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-500">No queries found</p>
              <p className="text-sm text-slate-400 mt-2">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Contact form submissions will appear here'}
              </p>
            </div>
          ) : (
            filteredQueries.map((query) => (
              <QueryCard
                key={query.id}
                query={query}
                onMarkAsRead={() => markAsRead(query.id)}
                onMarkAsUnread={() => markAsUnread(query.id)}
                onDelete={() => deleteQuery(query.id)}
              />
            ))
          )}
        </div>

        {/* Results count */}
        {filteredQueries.length > 0 && (
          <div className="mt-4 text-sm text-slate-600 text-center">
            Showing {filteredQueries.length} of {queries.length} queries
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">💡 Note:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>All queries are sent to your email (induscarrental@gmail.com)</li>
            <li>Mark queries as read/unread to track your responses</li>
            <li>Use the search to quickly find specific queries</li>
            <li>Click on a query card to see the full message</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function QueryCard({ query, onMarkAsRead, onMarkAsUnread, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border transition-all ${
        query.isRead ? 'border-slate-200' : 'border-orange-300 bg-orange-50/30'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              {!query.isRead && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                  🔔 New
                </span>
              )}
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock className="h-4 w-4" />
                {formatDate(query.timestamp)}
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="font-semibold text-slate-800">{query.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a 
                    href={`mailto:${query.email}`}
                    className="font-medium text-purple-600 hover:text-purple-800 text-sm break-all"
                  >
                    {query.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <a 
                    href={`tel:${query.phone}`}
                    className="font-medium text-purple-600 hover:text-purple-800"
                  >
                    {query.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Message Preview/Full */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-1">Message</p>
              <div className={`text-slate-700 ${expanded ? '' : 'line-clamp-2'}`}>
                {query.message}
              </div>
              {query.message.length > 100 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-1"
                >
                  {expanded ? '↑ Show less' : '↓ Read more'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t">
          {query.isRead ? (
            <button
              onClick={onMarkAsUnread}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
            >
              <Mail className="h-4 w-4" />
              Mark as Unread
            </button>
          ) : (
            <button
              onClick={onMarkAsRead}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition"
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Read
            </button>
          )}
          
          <a
            href={`mailto:${query.email}?subject=Re: Your inquiry&body=Hi ${query.name},%0D%0A%0D%0AThank you for contacting Indus Car Rental.%0D%0A%0D%0A`}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition"
          >
            <Mail className="h-4 w-4" />
            Reply via Email
          </a>
          
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition ml-auto"
          >
            🗑️ Delete
          </button>
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