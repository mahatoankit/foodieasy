import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  icon,
  title, 
  message, 
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4 text-gray-300">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-heading font-bold text-dark-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
