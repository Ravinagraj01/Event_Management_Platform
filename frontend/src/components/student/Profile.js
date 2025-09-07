import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Award,
  TrendingUp,
  Star,
  Edit,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    college: 'University of Technology',
    joinDate: '2023-09-01',
    totalEvents: 15,
    attendedEvents: 12,
    avgRating: 4.2,
    totalFeedback: 8
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    setEditData(profile);
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profile);
  };

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const stats = [
    {
      title: 'Events Registered',
      value: profile.totalEvents,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      change: '+3 this month'
    },
    {
      title: 'Events Attended',
      value: profile.attendedEvents,
      icon: Award,
      color: 'from-green-500 to-green-600',
      change: '85% attendance rate'
    },
    {
      title: 'Average Rating',
      value: profile.avgRating,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      change: 'Based on 8 reviews'
    },
    {
      title: 'Feedback Given',
      value: profile.totalFeedback,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      change: 'Helpful contributor'
    }
  ];

  const recentActivity = [
    { action: 'Registered for Tech Workshop', date: '2024-02-10', type: 'registration' },
    { action: 'Attended Career Fair 2024', date: '2024-02-08', type: 'attendance' },
    { action: 'Gave feedback for Cultural Night', date: '2024-02-05', type: 'feedback' },
    { action: 'Registered for Hackathon', date: '2024-02-03', type: 'registration' },
    { action: 'Attended Seminar on AI', date: '2024-02-01', type: 'attendance' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'attendance':
        return <Award className="w-4 h-4 text-green-500" />;
      case 'feedback':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information and view your activity</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="stat-card"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Profile Info */}
          <div className="flex items-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
              {profile.name.charAt(0)}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    className="input-field text-xl font-semibold"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="college"
                    value={editData.college}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </p>
                  <p className="text-gray-600 flex items-center mt-1">
                    <User className="w-4 h-4 mr-2" />
                    {profile.college}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Member since {new Date(profile.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-4 lg:mt-0">
            {isEditing ? (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEdit}
                className="btn-secondary flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="stat-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="flex items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 mr-3">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
