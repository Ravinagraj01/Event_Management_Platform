import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Search,
  Filter,
  Star,
  BookOpen,
  ChevronRight,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

const EventBrowser = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('start_time');
  const [favorites, setFavorites] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        toast.error('Failed to fetch events');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      // Check if user is logged in and is a student
      if (!user || user.type !== 'student') {
        toast.error('Please log in as a student to register for events');
        return;
      }

      const studentId = user.id;
      
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId })
      });

      if (response.ok) {
        toast.success('Successfully registered for the event!');
      } else {
        const error = await response.json();
        if (response.status === 409) {
          toast.error('You are already registered for this event');
        } else if (response.status === 404 && error.error === 'Student not found') {
          toast.error('Student account not found. Please contact support.');
        } else {
          toast.error(error.error || 'Failed to register');
        }
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const toggleFavorite = (eventId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(eventId);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || event.event_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'start_time':
        return new Date(a.start_time) - new Date(b.start_time);
      case 'capacity':
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });

  const eventTypes = [...new Set(events.map(event => event.event_type))];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Workshop': 'bg-blue-100 text-blue-800',
      'Seminar': 'bg-green-100 text-green-800',
      'Conference': 'bg-purple-100 text-purple-800',
      'Cultural Event': 'bg-pink-100 text-pink-800',
      'Sports Event': 'bg-orange-100 text-orange-800',
      'Tech Talk': 'bg-indigo-100 text-indigo-800',
      'Career Fair': 'bg-yellow-100 text-yellow-800',
      'Hackathon': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
        <p className="text-gray-600 mt-2">Find and join exciting campus events happening around you</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="stat-card"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filter by Type */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="">All Event Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="start_time">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="capacity">Sort by Capacity</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="w-4 h-4 mr-2" />
            {sortedEvents.length} events found
          </div>
        </div>
      </motion.div>

      {/* Events Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="stat-card card-hover group"
          >
            {/* Event Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                  {event.event_type}
                </span>
              </div>
              <button
                onClick={() => toggleFavorite(event.id)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 ${
                    favorites.has(event.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`} 
                />
              </button>
            </div>

            {/* Event Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {event.description || 'No description provided'}
            </p>

            {/* Event Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(event.start_time)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {formatDate(event.end_time)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {event.capacity} participants max
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm font-medium">4.2</span>
                <span className="ml-1 text-sm text-gray-500">(24 reviews)</span>
              </div>
              <div className="text-sm text-gray-500">
                {event.status === 'active' ? 'Open' : 'Closed'}
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRegister(event.id)}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              Register Now
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {sortedEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </div>
  );
};

export default EventBrowser;
