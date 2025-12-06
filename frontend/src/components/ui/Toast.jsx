import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-white',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-white',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-500',
      textColor: 'text-white',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.textColor} rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
