import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const EditRestaurantModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
    cuisine_type: '',
    description: '',
    delivery_time: '',
    is_open: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        phone_number: initialData.phone_number || '',
        cuisine_type: initialData.cuisine_type || '',
        description: initialData.description || '',
        delivery_time: initialData.delivery_time || '',
        is_open: initialData.is_open !== undefined ? initialData.is_open : true,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }

    if (!formData.cuisine_type.trim()) {
      newErrors.cuisine_type = 'Cuisine type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-300">
          <h2 className="text-2xl font-bold text-dark-900">Edit Restaurant Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-dark-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-900 mb-1">
                Restaurant Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Himalayan Momo House"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-900 mb-1">
                Address *
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Thamel, Kathmandu"
                disabled={loading}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-900 mb-1">
                Phone Number *
              </label>
              <Input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+977-98xxxxxxxx"
                disabled={loading}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-900 mb-1">
                Cuisine Type *
              </label>
              <select
                name="cuisine_type"
                value={formData.cuisine_type}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-light-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              >
                <option value="">Select cuisine type...</option>
                <option value="NEPALI">Nepali</option>
                <option value="ITALIAN">Italian</option>
                <option value="CHINESE">Chinese</option>
                <option value="INDIAN">Indian</option>
                <option value="JAPANESE">Japanese</option>
                <option value="KOREAN">Korean</option>
                <option value="THAI">Thai</option>
                <option value="WESTERN">Western</option>
                <option value="FAST_FOOD">Fast Food</option>
                <option value="SEAFOOD">Seafood</option>
                <option value="VEGETARIAN">Vegetarian</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.cuisine_type && (
                <p className="text-red-500 text-sm mt-1">{errors.cuisine_type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-900 mb-1">
                Delivery Time
              </label>
              <Input
                type="text"
                name="delivery_time"
                value={formData.delivery_time}
                onChange={handleChange}
                placeholder="e.g., 30-45 mins"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_open"
                name="is_open"
                checked={formData.is_open}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 text-primary-600 border-light-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="is_open" className="text-sm font-medium text-dark-900">
                Restaurant is currently open
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-900 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers about your restaurant..."
                rows={3}
                disabled={loading}
                className="w-full px-4 py-3 border border-light-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Updating...' : 'Update Restaurant'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantModal;
