import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Clock, 
  Filter, 
  Search,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('start_time');

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
      case 'capacity':
        return b.capacity - a.capacity;
      case 'start_time':
        return new Date(a.start_time) - new Date(b.start_time);
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
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all campus events</p>
      </motion.div>

      {/* Filters and Search */}
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
            <TrendingUp className="w-4 h-4 mr-2" />
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
            className="stat-card card-hover"
          >
            {/* Event Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                  {event.event_type}
                </span>
              </div>
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
                Capacity: {event.capacity} participants
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  event.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium capitalize">{event.status}</span>
              </div>
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm font-medium">4.2</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 btn-secondary text-sm py-2">
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button className="flex-1 btn-secondary text-sm py-2">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
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

export default EventList;
