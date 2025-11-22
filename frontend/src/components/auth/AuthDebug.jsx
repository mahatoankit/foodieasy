import React from 'react';
import { useSelector } from 'react-redux';

const AuthDebug = () => {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white shadow-lg rounded-lg p-4 text-xs max-w-xs z-50 border-2 border-blue-500">
      <h3 className="font-bold mb-2 text-blue-600">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div>
          <strong>Authenticated:</strong>{' '}
          <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isAuthenticated ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div>
          <strong>User:</strong> {user?.email || 'None'}
        </div>
        <div>
          <strong>Role:</strong> {user?.role || 'None'}
        </div>
        <div>
          <strong>Redux Token:</strong>{' '}
          {token ? `${token.substring(0, 20)}...` : 'None'}
        </div>
        <div>
          <strong>LocalStorage Access:</strong>{' '}
          {accessToken ? `${accessToken.substring(0, 20)}...` : '❌ None'}
        </div>
        <div>
          <strong>LocalStorage Refresh:</strong>{' '}
          {refreshToken ? `${refreshToken.substring(0, 20)}...` : '❌ None'}
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
