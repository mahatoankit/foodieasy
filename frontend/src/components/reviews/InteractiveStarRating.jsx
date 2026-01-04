import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

/**
 * InteractiveStarRating Component
 * Allows users to select a rating by clicking on stars
 * 
 * @param {number} value - Current rating value (0-5)
 * @param {function} onChange - Callback function when rating changes
 * @param {number} size - Size of stars in pixels (default: 30)
 * @param {boolean} disabled - Whether the rating is disabled
 */
const InteractiveStarRating = ({ value = 0, onChange, size = 30, disabled = false }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (!disabled && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className={`transition-colors ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <FaStar
            size={size}
            className={
              star <= (hoverValue || value)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  );
};

export default InteractiveStarRating;
