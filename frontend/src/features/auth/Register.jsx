import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, ArrowRight, UserCircle } from 'lucide-react';
import { register, clearError } from './authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'CUSTOMER',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/restaurants');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }

    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen bg-light-200 flex">
      {/* Left side - Hero Image/Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Food Image */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="text-5xl font-heading font-bold mb-6 drop-shadow-lg">
            Join Foodieasy Today!
          </h1>
          <p className="text-xl text-primary-100 mb-8 drop-shadow-md">
            Start ordering delicious food from your favorite restaurants
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold mb-3 text-lg">Why join us?</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-primary-200 mr-2">✓</span> Fast delivery in 30 minutes
              </li>
              <li className="flex items-center">
                <span className="text-primary-200 mr-2">✓</span> Wide selection of restaurants
              </li>
              <li className="flex items-center">
                <span className="text-primary-200 mr-2">✓</span> Track your order in real-time
              </li>
              <li className="flex items-center">
                <span className="text-primary-200 mr-2">✓</span> Exclusive deals and offers
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold text-dark-900 mb-2">
              Create Account
            </h2>
            <p className="text-dark-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-700">
                {typeof error === 'object' ? 
                  Object.entries(error).map(([key, val]) => (
                    <div key={key} className="mb-1">
                      <strong className="capitalize">{key}:</strong> {Array.isArray(val) ? val.join(', ') : val}
                    </div>
                  )) : 
                  error
                }
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                id="first_name"
                name="first_name"
                type="text"
                required
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                icon={<User className="w-5 h-5" />}
                iconPosition="left"
              />
              <Input
                label="Last Name"
                id="last_name"
                name="last_name"
                type="text"
                required
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                icon={<User className="w-5 h-5" />}
                iconPosition="left"
              />
            </div>

            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail className="w-5 h-5" />}
              iconPosition="left"
            />

            <Input
              label="Phone Number"
              id="phone_number"
              name="phone_number"
              type="tel"
              required
              placeholder="+1234567890"
              value={formData.phone_number}
              onChange={handleChange}
              icon={<Phone className="w-5 h-5" />}
              iconPosition="left"
            />

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-dark-700 mb-1.5">
                Account Type
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="role"
                  name="role"
                  className="w-full pl-10 pr-4 py-2.5 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-dark-800 bg-white transition-all duration-200"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="CUSTOMER">Customer - Order food</option>
                  <option value="RESTAURANT_OWNER">Restaurant Owner - Manage restaurant</option>
                  <option value="RIDER">Delivery Rider - Deliver orders</option>
                </select>
              </div>
            </div>

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              required
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock className="w-5 h-5" />}
              iconPosition="left"
            />

            <Input
              label="Confirm Password"
              id="password2"
              name="password2"
              type="password"
              required
              placeholder="Re-enter password"
              value={formData.password2}
              onChange={handleChange}
              icon={<Lock className="w-5 h-5" />}
              iconPosition="left"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* OAuth temporarily disabled
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-400"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-light-200 text-dark-600">Or sign up with</span>
            </div>
          </div>

          <NeonAuthButton mode="signup" />
          */}

          <p className="text-center text-xs text-dark-600">
            By creating an account, you agree to our{' '}
            <button type="button" className="text-primary-600 hover:text-primary-700">Terms of Service</button>
            {' '}and{' '}
            <button type="button" className="text-primary-600 hover:text-primary-700">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
