import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import axios from 'axios';
import { setCredentials } from '../auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name) {
      toast.error('First name and last name are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/users/profile/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update user in Redux store
      dispatch(setCredentials({ user: response.data, token }));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/change-password/`,
        {
          old_password: passwordData.current_password,
          new_password: passwordData.new_password
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.detail || error.response?.data?.old_password?.[0] || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800';
      case 'RESTAURANT_OWNER':
        return 'bg-purple-100 text-purple-800';
      case 'RIDER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'CUSTOMER':
        return 'Customer';
      case 'RESTAURANT_OWNER':
        return 'Restaurant Owner';
      case 'RIDER':
        return 'Delivery Rider';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and personal information</p>
        </div>

        <div className="space-y-6">
          {/* Profile Header Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getRoleBadgeColor(user?.role)}`}>
                    {getRoleLabel(user?.role)}
                  </span>
                </div>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  icon={<Edit2 size={18} />}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </Card>

          {/* Profile Information Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977-9812345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter your delivery address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        first_name: user?.first_name || '',
                        last_name: user?.last_name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        address: user?.address || ''
                      });
                    }}
                    icon={<X size={18} />}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<Save size={18} />}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 py-3 border-b">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-base font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 py-3 border-b">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-base font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 py-3 border-b">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-base font-medium text-gray-900">
                      {user?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 py-3">
                  <MapPin className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-base font-medium text-gray-900">
                      {user?.address || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Change Password Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              {!isChangingPassword && (
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPassword(true)}
                  icon={<Lock size={18} />}
                >
                  Change Password
                </Button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
                      });
                    }}
                    icon={<X size={18} />}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<Lock size={18} />}
                    disabled={loading}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center space-x-3 py-3">
                <Lock className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Password</p>
                  <p className="text-base font-medium text-gray-900">••••••••</p>
                </div>
              </div>
            )}
          </Card>

          {/* Account Info Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Account Type</span>
                <span className="text-sm font-medium text-gray-900">{getRoleLabel(user?.role)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">User ID</span>
                <span className="text-sm font-medium text-gray-900">#{user?.id}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
