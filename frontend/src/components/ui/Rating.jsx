import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 'md',
  showNumber = true,
  className = '',
}) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;
          
          return (
            <div key={index} className="relative">
              <Star className={`${sizes[size]} text-gray-300`} fill="currentColor" />
              <div 
                className="absolute top-0 left-0 overflow-hidden" 
                style={{ width: `${fillPercentage}%` }}
              >
                <Star className={`${sizes[size]} text-yellow-400`} fill="currentColor" />
              </div>
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className={`${textSizes[size]} font-medium text-dark-700 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
