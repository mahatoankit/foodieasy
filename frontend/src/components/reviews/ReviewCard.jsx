import React from 'react';
import StarRating from './StarRating';
import { FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

/**
 * ReviewCard Component
 * Displays a single review with user info, rating, and comment
 * 
 * @param {object} review - Review data
 * @param {boolean} showRestaurantName - Show restaurant name (for menu item reviews)
 * @param {boolean} showMenuItemName - Show menu item name (for menu item reviews)
 */
const ReviewCard = ({ review, showRestaurantName = false, showMenuItemName = false }) => {
  const getTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-gray-400" size={40} />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">
                {review.user_name || review.user_email}
              </h4>
              {review.is_verified_purchase && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <FaCheckCircle size={12} />
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{getTimeAgo(review.created_at)}</p>
          </div>
        </div>

        {/* Rating */}
        <StarRating rating={review.rating} size={16} showNumber />
      </div>

      {/* Restaurant/Menu Item Name */}
      {showRestaurantName && review.restaurant_name && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Restaurant:</span> {review.restaurant_name}
        </p>
      )}
      {showMenuItemName && review.menu_item_name && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Item:</span> {review.menu_item_name}
        </p>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
};

export default ReviewCard;
