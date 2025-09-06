import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { FLAGS } from '@/lib/flags';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component that conditionally requires authentication
 * 
 * Behavior:
 * - If AUTH_ENABLED=false: renders children normally (no auth required)
 * - If AUTH_ENABLED=true: requires user to be signed in, otherwise redirects to sign-in
 * 
 * Use this for cloud features that require user accounts.
 * DO NOT use for core flows like /create or local Library.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // If auth is not enabled, render normally without any restrictions
  if (!FLAGS.AUTH_ENABLED) {
    return <>{children}</>;
  }

  // If auth is enabled, require user to be signed in
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;