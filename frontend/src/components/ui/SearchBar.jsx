import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  placeholder = 'Search...', 
  value, 
  onChange,
  className = '',
  ...props 
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-dark-800 placeholder-gray-400 transition-all duration-200"
        {...props}
      />
    </div>
  );
};

export default SearchBar;
