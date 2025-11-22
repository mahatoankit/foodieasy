import React from 'react';
import { StackProvider, StackTheme } from "@stackframe/stack";

const stackAppUrl = `https://app.stack-auth.com/api/v1/projects/${process.env.VITE_STACK_PROJECT_ID}`;

function StackAuthProvider({ children }) {
  return (
    <StackProvider
      projectId={process.env.VITE_STACK_PROJECT_ID}
      publishableClientKey={process.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY}
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
