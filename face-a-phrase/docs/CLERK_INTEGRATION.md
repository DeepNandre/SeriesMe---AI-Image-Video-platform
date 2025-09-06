# 🔐 Clerk Authentication Integration

## Overview
SeriesMe includes optional Clerk authentication that preserves the zero-cost browser mode while enabling premium cloud features for authenticated users.

## 🚀 Quick Setup

### 1. Enable Authentication
```bash
# In .env.local
VITE_AUTH_ENABLED=true
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

### 2. Get Clerk Keys
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application  
3. Copy your publishable key from the dashboard
4. Add allowed origins: `http://localhost:5173`, your Netlify domain

### 3. Test Authentication
```bash
npm run dev
# Visit http://localhost:5173
# Click "Sign in" in navigation (only appears when AUTH_ENABLED=true)
```

## 🏗️ Architecture

### Feature Flag System
Authentication is **completely optional** via feature flags:

```typescript
// src/lib/flags.ts
export const FLAGS = {
  AUTH_ENABLED: import.meta.env.VITE_AUTH_ENABLED === 'true', // default false
} as const;
```

### Safe Defaults
- **AUTH_ENABLED=false** (default): App works normally, no Clerk dependency
- **AUTH_ENABLED=true**: Optional authentication features appear
- **Missing keys**: Graceful degradation with console warnings

### Conditional Provider Mounting
```typescript
// src/main.tsx
const Root = () => {
  if (FLAGS.AUTH_ENABLED && publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        <App />
      </ClerkProvider>
    );
  }
  return <App />; // No auth provider
};
```

## 🎨 UI Integration

### Navigation
- **No auth**: Shows "Make a clip" button
- **Auth enabled**: Shows Sign in/User button conditionally

```typescript
// NavBar.tsx
{FLAGS.AUTH_ENABLED ? (
  <>
    <SignedOut><SignInButton /></SignedOut>
    <SignedIn><UserButton /></SignedIn>
  </>
) : (
  <a href="/create">Make a clip</a>
)}
```

### Protected Routes
```typescript
// ProtectedRoute.tsx
export const ProtectedRoute = ({ children }) => {
  if (!FLAGS.AUTH_ENABLED) return <>{children}</>;
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><Navigate to="/sign-in" /></SignedOut>
    </>
  );
};
```

## 📁 File Structure

```
src/
├── main.tsx              # Conditional ClerkProvider mounting
├── App.tsx               # Auth routes (/sign-in, /sign-up)
├── lib/flags.ts          # AUTH_ENABLED feature flag
├── components/
│   ├── NavBar.tsx        # Conditional auth UI
│   └── ProtectedRoute.tsx # Route protection wrapper
├── pages/
│   └── CloudLibrary.tsx  # Example protected page
└── lib/future/
    └── auth.ts           # Extended auth scaffolding
```

## 🔐 Usage Examples

### Basic Authentication Check
```typescript
import { useUser } from '@clerk/clerk-react';

const MyComponent = () => {
  const { user } = useUser();
  
  return user ? (
    <p>Hello {user.firstName}!</p>
  ) : (
    <p>Please sign in</p>
  );
};
```

### Protected Cloud Feature
```typescript
// pages/CloudLibrary.tsx - requires authentication
<ProtectedRoute>
  <CloudLibrary />
</ProtectedRoute>
```

### Conditional Feature Display
```typescript
import { SignedIn, SignedOut } from '@clerk/clerk-react';

<SignedIn>
  <button>Sync to Cloud</button>
</SignedIn>
<SignedOut>
  <button>Create Local Video</button>
</SignedOut>
```

## ⚙️ Configuration

### Environment Variables
```bash
# Feature flags
VITE_AUTH_ENABLED=false              # Enable auth features
VITE_USE_BROWSER_RENDERER=true       # Keep zero-cost default

# Clerk keys (only needed when AUTH_ENABLED=true)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...         # For Netlify Functions
```

### Clerk Dashboard Settings
**Allowed Origins:**
- `http://localhost:5173` (development)
- `https://your-site.netlify.app` (production)
- `https://deploy-preview-*.netlify.app` (preview deploys)

**Redirect URLs:**
- `http://localhost:5173/sign-in`
- `https://your-site.netlify.app/sign-in`

## 🚀 Netlify Functions (Future)

When you need server-side authentication:

```typescript
// netlify/functions/protected-endpoint.ts
import { getAuth } from '@clerk/backend';

export const handler = async (event) => {
  const { userId } = getAuth(event);
  if (!userId) {
    return { statusCode: 401, body: 'Unauthorized' };
  }
  // Protected logic here
};
```

## 🧪 Testing

### Without Auth (Default)
```bash
# Default behavior - no auth UI
npm run dev
# ✅ All features work normally
# ✅ No Clerk components appear
# ✅ No auth-related errors
```

### With Auth Enabled
```bash
# Enable auth features
echo "VITE_AUTH_ENABLED=true" >> .env.local
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_..." >> .env.local
npm run dev
# ✅ Sign in/Sign up routes work
# ✅ Protected routes redirect when signed out
# ✅ User button appears when signed in
```

## 🎯 Benefits

### ✅ Zero Breaking Changes
- Existing users: no impact whatsoever
- Default behavior: completely unchanged
- Optional enhancement: only when explicitly enabled

### ✅ Progressive Enhancement
- Start free: browser-only video generation
- Add auth: unlock cloud sync and premium features  
- Scale up: team collaboration and advanced features

### ✅ Privacy First
- No authentication required for core functionality
- User data only collected when explicitly opted-in
- Clear boundaries between local and cloud features

## 🔄 Migration Path

1. **Phase 1**: Deploy with `AUTH_ENABLED=false` (no user impact)
2. **Phase 2**: Enable auth for new users wanting cloud features
3. **Phase 3**: Offer existing users opt-in cloud sync migration
4. **Phase 4**: Add premium subscription features for authenticated users

---

*This integration maintains SeriesMe's zero-cost, privacy-first approach while providing a foundation for premium features and user accounts when needed.*