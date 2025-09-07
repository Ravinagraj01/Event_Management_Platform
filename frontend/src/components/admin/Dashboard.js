import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Star,
  BarChart3,
  UserCheck,
  Clock,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalStudents: 0,
    totalRegistrations: 0,
    avgRating: 0
  });

  const [recentEvents, setRecentEvents] = useState([]);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalEvents: 100,
      totalStudents: 2500,
      totalRegistrations: 5000,
      avgRating: 4.2
    });

    setRecentEvents([
      { id: 1, title: 'Tech Workshop', type: 'Workshop', registrations: 45, rating: 4.5 },
      { id: 2, title: 'Career Fair', type: 'Career Fair', registrations: 120, rating: 4.3 },
      { id: 3, title: 'Cultural Event', type: 'Cultural Event', registrations: 80, rating: 4.7 },
      { id: 4, title: 'Hackathon', type: 'Hackathon', registrations: 60, rating: 4.8 }
    ]);

    setTopStudents([
      { name: 'John Doe', college: 'University of Technology', events: 15 },
      { name: 'Jane Smith', college: 'State College', events: 12 },
      { name: 'Mike Johnson', college: 'Metropolitan University', events: 10 }
    ]);
  }, []);

  const chartData = [
    { name: 'Jan', events: 20, registrations: 400 },
    { name: 'Feb', events: 25, registrations: 500 },
    { name: 'Mar', events: 30, registrations: 600 },
    { name: 'Apr', events: 35, registrations: 700 },
    { name: 'May', events: 28, registrations: 550 },
    { name: 'Jun', events: 32, registrations: 650 }
  ];

  const eventTypeData = [
    { name: 'Workshop', value: 35, color: '#3b82f6' },
    { name: 'Seminar', value: 25, color: '#8b5cf6' },
    { name: 'Cultural Event', value: 20, color: '#06b6d4' },
    { name: 'Sports Event', value: 20, color: '#10b981' }
  ];

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Registrations',
      value: stats.totalRegistrations.toLocaleString(),
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      change: '+15%'
    },
    {
      title: 'Avg Rating',
      value: stats.avgRating,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      change: '+0.2'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your events.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events & Registrations Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events & Registrations Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="registrations" stroke="#8b5cf6" strokeWidth={3} />
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
        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{event.registrations} registrations</p>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm">{event.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Active Students</h3>
          <div className="space-y-4">
            {topStudents.map((student, index) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {student.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.college}</p>
                  </div>
                </div>
                <div className="flex items-center text-primary-600">
                  <Award className="w-4 h-4 mr-1" />
                  <span className="font-medium">{student.events} events</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
