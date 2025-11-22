import React from 'react';
import { StackProvider, StackTheme } from "@stackframe/stack";

function StackAuthProvider({ children }) {
  // Check if Stack Auth is properly configured
  const projectId = process.env.REACT_APP_STACK_PROJECT_ID;
  const publishableKey = process.env.REACT_APP_STACK_PUBLISHABLE_CLIENT_KEY;

  // If not configured, just render children without Stack Auth
  if (!projectId || !publishableKey) {
    console.warn('Stack Auth not configured. OAuth will not be available.');
    return <>{children}</>;
  }

  return (
    <StackProvider
      projectId={projectId}
      publishableClientKey={publishableKey}
      urls={{
        signIn: '/login',
        afterSignIn: '/restaurants',
        signUp: '/register',
        afterSignUp: '/restaurants',
      }}
    >
      <StackTheme>
        {children}
      </StackTheme>
    </StackProvider>
  );
}

export default StackAuthProvider;
