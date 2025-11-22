import React from 'react';

const Card = ({ 
  children, 
  hover = false, 
  padding = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-lg transition-all duration-200';
  const hoverStyles = hover ? 'hover:shadow-lg cursor-pointer' : '';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const shadowStyles = 'shadow-sm';
  
  return (
    <div
      className={`${baseStyles} ${shadowStyles} ${hoverStyles} ${paddings[padding]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
