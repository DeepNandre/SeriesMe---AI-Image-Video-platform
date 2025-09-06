import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import { FLAGS } from './lib/flags'
import './index.css'
import './styles/tokens.css'
import './styles/globals.css'

// Get Clerk publishable key (only required if AUTH_ENABLED=true)
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

// Validate Clerk configuration when auth is enabled
if (FLAGS.AUTH_ENABLED && !publishableKey) {
  console.warn('🔐 AUTH_ENABLED=true but VITE_CLERK_PUBLISHABLE_KEY is missing. Auth features disabled.');
}

const Root = () => {
  // Conditionally wrap with ClerkProvider only when auth is enabled AND key is available
  if (FLAGS.AUTH_ENABLED && publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    );
  }
  
  // Default: no auth provider, app works normally
  return <App />;
};

createRoot(document.getElementById("root")!).render(<Root />);
