import React from 'react';
import { useStackApp, useUser } from '@stackframe/stack';
import Button from '../ui/Button';

const NeonAuthButton = ({ mode = 'signin', className = '' }) => {
  const app = useStackApp();
  const user = useUser();

  const handleNeonAuth = async () => {
    try {
      if (mode === 'signin') {
        await app.signInWithOAuth('google'); // Neon Stack supports OAuth providers
      } else {
        await app.signUpWithOAuth('google');
      }
    } catch (error) {
      console.error('Neon auth error:', error);
    }
  };

  if (user) {
    return null; // Already authenticated
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleNeonAuth}
      className={`w-full ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
      <span className="ml-2">
        Continue with Neon Auth
      </span>
    </Button>
  );
};

export default NeonAuthButton;
