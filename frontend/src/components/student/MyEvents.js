import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  Star,
  MessageSquare,
  MapPin,
  XCircle,
  LogIn
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registered');
  const { user } = useAuth();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      // Fetch from API
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        const allEvents = await response.json();
        // Mock student registrations for demo
        const mockRegistrations = [
          {
            id: '1',
            event_id: allEvents[0]?.id || '1',
            title: allEvents[0]?.title || 'Tech Workshop: React Fundamentals',
            description: allEvents[0]?.description || 'Learn the basics of React development with hands-on exercises',
            event_type: allEvents[0]?.event_type || 'Workshop',
            start_time: allEvents[0]?.start_time || '2024-02-15T10:00:00Z',
            end_time: allEvents[0]?.end_time || '2024-02-15T12:00:00Z',
            status: 'registered',
            registered_at: '2024-02-10T09:00:00Z',
            attended: false,
            feedback_given: false
          },
          {
            id: '2',
            event_id: allEvents[1]?.id || '2',
            title: allEvents[1]?.title || 'Career Fair 2024',
            description: allEvents[1]?.description || 'Connect with top companies and explore career opportunities',
            event_type: allEvents[1]?.event_type || 'Career Fair',
            start_time: allEvents[1]?.start_time || '2024-02-20T09:00:00Z',
            end_time: allEvents[1]?.end_time || '2024-02-20T17:00:00Z',
            status: 'attended',
            registered_at: '2024-02-05T10:00:00Z',
            attended: true,
            attended_at: '2024-02-20T09:15:00Z',
            feedback_given: true,
            rating: 5,
            comment: 'Great event! Met many interesting companies.'
          }
        ];
        setMyEvents(mockRegistrations);
      } else {
        // Fallback to mock data
        setMyEvents([
          {
            id: '1',
            event_id: '1',
            title: 'Tech Workshop: React Fundamentals',
            description: 'Learn the basics of React development with hands-on exercises',
            event_type: 'Workshop',
            start_time: '2024-02-15T10:00:00Z',
            end_time: '2024-02-15T12:00:00Z',
            status: 'registered',
            registered_at: '2024-02-10T09:00:00Z',
            attended: false,
            feedback_given: false
          },
          {
            id: '2',
            event_id: '2',
            title: 'Career Fair 2024',
            description: 'Connect with top companies and explore career opportunities',
            event_type: 'Career Fair',
            start_time: '2024-02-20T09:00:00Z',
            end_time: '2024-02-20T17:00:00Z',
            status: 'attended',
            registered_at: '2024-02-05T10:00:00Z',
            attended: true,
            attended_at: '2024-02-20T09:15:00Z',
            feedback_given: true,
            rating: 5,
            comment: 'Great event! Met many interesting companies.'
          },
          {
            id: '3',
            event_id: '3',
            title: 'Cultural Night',
            description: 'Celebrate diversity with performances and food from around the world',
            event_type: 'Cultural Event',
            start_time: '2024-02-25T18:00:00Z',
            end_time: '2024-02-25T22:00:00Z',
            status: 'registered',
            registered_at: '2024-02-12T14:00:00Z',
            attended: false,
            feedback_given: false
          }
        ]);
      }
    } catch (error) {
      toast.error('Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (eventId) => {
    try {
      const studentId = user?.id || '1'; // Use authenticated user ID
      
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId })
      });

      if (response.ok) {
        toast.success('Successfully checked in!');
        // Update local state
        setMyEvents(prev => prev.map(event => 
          event.event_id === eventId 
            ? { ...event, status: 'attended', attended: true, attended_at: new Date().toISOString() }
            : event
        ));
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to check in');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleFeedback = async (eventId, rating, comment) => {
    try {
      const studentId = user?.id || '1'; // Use authenticated user ID
      
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          student_id: studentId,
          rating: rating,
          comment: comment
        })
      });

      if (response.ok) {
        toast.success('Thank you for your feedback!');
        // Update local state
        setMyEvents(prev => prev.map(event => 
          event.event_id === eventId 
            ? { ...event, feedback_given: true, rating, comment }
            : event
        ));
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit feedback');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const filteredEvents = myEvents.filter(event => {
    switch (activeTab) {
      case 'registered':
        return event.status === 'registered';
      case 'attended':
        return event.status === 'attended';
      case 'upcoming':
        return new Date(event.start_time) > new Date();
      default:
        return true;
    }
  });

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

  const getStatusColor = (status) => {
    const colors = {
      'registered': 'bg-blue-100 text-blue-800',
      'attended': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <p className="text-gray-600 mt-2">Track your event registrations, attendance, and feedback</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="stat-card"
      >
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'registered', label: 'Registered', count: myEvents.filter(e => e.status === 'registered').length },
            { id: 'attended', label: 'Attended', count: myEvents.filter(e => e.status === 'attended').length },
            { id: 'upcoming', label: 'Upcoming', count: myEvents.filter(e => new Date(e.start_time) > new Date()).length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Events List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Event Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  {event.attended && event.feedback_given && (
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{event.rating}/5</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3">{event.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(event.start_time)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatDate(event.end_time)}
                  </div>
                </div>

                {event.attended && event.comment && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Your Feedback
                    </div>
                    <p className="text-sm text-gray-800">{event.comment}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-2">
                {event.status === 'registered' && !event.attended && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCheckIn(event.event_id)}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                        <LogIn className="w-4 h-4" />
                    Check In
                  </motion.button>
                )}

                {event.status === 'attended' && !event.feedback_given && (
                  <FeedbackModal
                    eventId={event.event_id}
                    eventTitle={event.title}
                    onSubmit={handleFeedback}
                  />
                )}

                {event.status === 'attended' && event.feedback_given && (
                  <div className="text-center text-sm text-gray-500">
                    <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-500" />
                    Feedback Submitted
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">You haven't registered for any events in this category yet.</p>
        </motion.div>
      )}
    </div>
  );
};

// Feedback Modal Component
const FeedbackModal = ({ eventId, eventTitle, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    onSubmit(eventId, rating, comment);
    setIsOpen(false);
    setRating(0);
    setComment('');
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="btn-secondary flex items-center justify-center gap-2"
      >
        <Star className="w-4 h-4" />
        Give Feedback
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate & Review</h3>
            <p className="text-sm text-gray-600 mb-4">{eventTitle}</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MyEvents;
