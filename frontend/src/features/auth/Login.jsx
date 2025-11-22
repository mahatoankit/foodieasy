import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { login, clearError } from './authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import NeonAuthButton from '../../components/auth/NeonAuthButton';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'CUSTOMER') {
        navigate('/restaurants');
      } else if (user.role === 'RESTAURANT_OWNER') {
        navigate('/dashboard');
      } else if (user.role === 'RIDER') {
        navigate('/rider');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      }
    }
  }, [isAuthenticated, user, navigate]);

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
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen bg-light-200 flex">
      {/* Left side - Hero Image/Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Food Image */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="relative z-10 text-white text-center">
          <h1 className="text-5xl font-heading font-bold mb-6 drop-shadow-lg">
            Welcome Back!
          </h1>
          <p className="text-xl text-primary-100 mb-8 drop-shadow-md">
            Discover delicious food from the best restaurants in your area
          </p>
          <div className="flex items-center justify-center space-x-8 text-primary-100">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">30min</div>
              <div className="text-sm">Avg Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold text-dark-900 mb-2">
              Sign in
            </h2>
            <p className="text-dark-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                {typeof error === 'string' ? error : error.detail || 'Login failed. Please check your credentials.'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              label="Password"
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock className="w-5 h-5" />}
              iconPosition="left"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-dark-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* OAuth temporarily disabled
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-400"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-light-200 text-dark-600">Or continue with</span>
            </div>
          </div>

          <NeonAuthButton mode="signin" />
          */}

          <p className="text-center text-xs text-dark-600">
            By signing in, you agree to our{' '}
            <button type="button" className="text-primary-600 hover:text-primary-700">Terms of Service</button>
            {' '}and{' '}
            <button type="button" className="text-primary-600 hover:text-primary-700">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
