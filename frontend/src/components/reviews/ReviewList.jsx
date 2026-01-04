import React, { useState, useEffect, useCallback } from 'react';
import ReviewCard from './ReviewCard';
import { getRestaurantReviews, getMenuItemReviews } from '../../services/reviewService';
import toast from 'react-hot-toast';

/**
 * ReviewList Component
 * Displays a list of reviews with filtering and sorting options
 * 
 * @param {string} type - Type of reviews: 'restaurant' or 'menu-item'
 * @param {number} targetId - ID of the restaurant or menu item
 * @param {boolean} refresh - Trigger to refresh the list
 */
const ReviewList = ({ type, targetId, refresh = false }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      
      // Add filter parameters
      if (type === 'restaurant') {
        params.restaurant_id = targetId;
      } else if (type === 'menu-item') {
        params.menu_item_id = targetId;
      }

      // Add rating filter
      if (filter !== 'all') {
        params.rating = filter;
      }

      // Add sorting
      if (sortBy === 'newest') {
        params.ordering = '-created_at';
      } else if (sortBy === 'oldest') {
        params.ordering = 'created_at';
      } else if (sortBy === 'highest') {
        params.ordering = '-rating';
      } else if (sortBy === 'lowest') {
        params.ordering = 'rating';
      }

      let data;
      if (type === 'restaurant') {
        data = await getRestaurantReviews(params);
      } else if (type === 'menu-item') {
        data = await getMenuItemReviews(params);
      }

      setReviews(data.results || data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [type, targetId, filter, sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refresh]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Sorting */}
      {reviews.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
          {/* Filter by rating */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Sort by */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showMenuItemName={type === 'menu-item'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
