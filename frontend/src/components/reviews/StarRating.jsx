import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

/**
 * StarRating Component
 * Displays star ratings with support for half stars
 * 
 * @param {number} rating - Rating value (0-5)
 * @param {number} size - Size of stars in pixels (default: 20)
 * @param {boolean} showNumber - Show numeric rating next to stars
 * @param {string} color - Color of filled stars (default: yellow-400)
 */
const StarRating = ({ rating = 0, size = 20, showNumber = false, color = 'text-yellow-400' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className={color} size={size} />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <FaStarHalfAlt key="half" className={color} size={size} />
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-gray-300" size={size} />
        ))}
      </div>
      
      {/* Numeric rating */}
      {showNumber && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
