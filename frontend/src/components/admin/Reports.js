import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star,
  Calendar,
  Award,
  Download,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const Reports = () => {
  const [reports, setReports] = useState({
    eventPopularity: [],
    topStudents: [],
    attendanceStats: [],
    feedbackStats: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState('');

  useEffect(() => {
    fetchReports();
  }, [selectedCollege]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Fetch event popularity
      const popularityResponse = await fetch(`http://localhost:5000/api/reports/event_popularity?college_id=${selectedCollege}`);
      const popularityData = await popularityResponse.json();
      
      // Fetch top students
      const studentsResponse = await fetch(`http://localhost:5000/api/reports/top_active_students?college_id=${selectedCollege}&limit=5`);
      const studentsData = await studentsResponse.json();
      
      setReports({
        eventPopularity: popularityData,
        topStudents: studentsData,
        attendanceStats: [], // Mock data for now
        feedbackStats: [] // Mock data for now
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const colleges = [
    { id: '', name: 'All Colleges' },
    { id: '1', name: 'University of Technology' },
    { id: '2', name: 'State College of Engineering' },
    { id: '3', name: 'Metropolitan University' },
    { id: '4', name: 'Institute of Science and Technology' },
    { id: '5', name: 'Central University' }
  ];

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', events: 20, registrations: 400, attendance: 320 },
    { month: 'Feb', events: 25, registrations: 500, attendance: 400 },
    { month: 'Mar', events: 30, registrations: 600, attendance: 480 },
    { month: 'Apr', events: 35, registrations: 700, attendance: 560 },
    { month: 'May', events: 28, registrations: 550, attendance: 440 },
    { month: 'Jun', events: 32, registrations: 650, attendance: 520 }
  ];

  const eventTypeData = [
    { name: 'Workshop', value: 35, color: '#3b82f6' },
    { name: 'Seminar', value: 25, color: '#8b5cf6' },
    { name: 'Cultural Event', value: 20, color: '#06b6d4' },
    { name: 'Sports Event', value: 20, color: '#10b981' }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into event performance and student engagement</p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="input-field"
          >
            {colleges.map(college => (
              <option key={college.id} value={college.id}>{college.name}</option>
            ))}
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { title: 'Total Events', value: '100', icon: Calendar, color: 'from-blue-500 to-blue-600', change: '+12%' },
          { title: 'Total Registrations', value: '5,000', icon: Users, color: 'from-green-500 to-green-600', change: '+15%' },
          { title: 'Avg Attendance', value: '85%', icon: TrendingUp, color: 'from-purple-500 to-purple-600', change: '+5%' },
          { title: 'Avg Rating', value: '4.2', icon: Star, color: 'from-yellow-500 to-yellow-600', change: '+0.3' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <p className="text-sm text-green-600 mt-1">{metric.change} from last month</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={3} name="Events" />
              <Line type="monotone" dataKey="registrations" stroke="#8b5cf6" strokeWidth={3} name="Registrations" />
              <Line type="monotone" dataKey="attendance" stroke="#06b6d4" strokeWidth={3} name="Attendance" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Event Types Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {eventTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events by Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Events</h3>
          <div className="space-y-4">
            {reports.eventPopularity.slice(0, 5).map((event, index) => (
              <motion.div
                key={event.event_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.event_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary-600">{event.registration_count}</p>
                  <p className="text-sm text-gray-600">registrations</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Active Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Active Students</h3>
          <div className="space-y-4">
            {reports.topStudents.map((student, index) => (
              <motion.div
                key={student.student_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">Active participant</p>
                  </div>
                </div>
                <div className="flex items-center text-primary-600">
                  <Award className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{student.attendance_count} events</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
