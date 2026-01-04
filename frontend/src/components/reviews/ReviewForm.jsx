import React, { useState } from 'react';
import InteractiveStarRating from './InteractiveStarRating';
import { createRestaurantReview, createMenuItemReview } from '../../services/reviewService';
import toast from 'react-hot-toast';

/**
 * ReviewForm Component
 * Form for creating/editing reviews
 * 
 * @param {string} type - Type of review: 'restaurant' or 'menu-item'
 * @param {number} targetId - ID of the restaurant or menu item
 * @param {function} onSuccess - Callback after successful submission
 * @param {function} onCancel - Callback when form is cancelled
 * @param {object} existingReview - Existing review data for editing
 */
const ReviewForm = ({ type, targetId, onSuccess, onCancel, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
      };

      if (type === 'restaurant') {
        reviewData.restaurant = targetId;
        await createRestaurantReview(reviewData);
      } else if (type === 'menu-item') {
        reviewData.menu_item = targetId;
        await createMenuItemReview(reviewData);
      }

      toast.success('Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setComment('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          'Failed to submit review. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <InteractiveStarRating
          value={rating}
          onChange={setRating}
          size={32}
        />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us about your experience..."
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/1000 characters
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
