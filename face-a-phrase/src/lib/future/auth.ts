/**
 * Authentication scaffolding for future user accounts
 * 
 * ✅ IMPLEMENTATION NOTE: Clerk authentication has been integrated!
 * See main.tsx, App.tsx, NavBar.tsx, and ProtectedRoute.tsx for working implementation.
 * 
 * This file provides extended interfaces and services for when you need
 * more advanced user management beyond Clerk's built-in features.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastActiveAt: Date;
  plan: 'free' | 'premium' | 'enterprise';
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: Date;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Extended authentication service for advanced features
 * 
 * ✅ BASIC AUTH: Use Clerk hooks directly (@clerk/clerk-react)
 * - useUser() for user data
 * - useAuth() for auth state  
 * - SignIn/SignUp components for auth UI
 * 
 * 🚀 FUTURE: This service adds subscription/plan management on top of Clerk
 */
export class AuthService {
  private static instance: AuthService;
  private initialized = false;
  private currentUser: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async init(config?: { domain?: string; clientId?: string }): Promise<void> {
    // TODO: Initialize auth provider SDK
    this.initialized = !!config?.domain;
  }

  async signIn(email: string, password: string): Promise<User> {
    if (!this.initialized) {
      throw new Error('Auth service not initialized');
    }
    
    // TODO: Implement authentication
    throw new Error('Not implemented');
  }

  async signUp(email: string, password: string, name: string): Promise<User> {
    if (!this.initialized) {
      throw new Error('Auth service not initialized');
    }
    
    // TODO: Implement user registration
    throw new Error('Not implemented');
  }

  async signInWithGoogle(): Promise<User> {
    if (!this.initialized) {
      throw new Error('Auth service not initialized');
    }
    
    // TODO: Implement Google OAuth
    throw new Error('Not implemented');
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners(null);
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Get current authenticated user
    return this.currentUser;
  }

  async updateProfile(updates: Partial<Pick<User, 'name' | 'avatar'>>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }
    
    // TODO: Update user profile
    throw new Error('Not implemented');
  }

  async requestPasswordReset(email: string): Promise<void> {
    // TODO: Send password reset email
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: Reset password with token
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(user: User | null): void {
    this.listeners.forEach(listener => listener(user));
  }
}

// Extended authentication hook for advanced features
export const useAuthExtended = () => {
  // ✅ FOR BASIC AUTH: Use @clerk/clerk-react hooks instead:
  // import { useUser, useAuth } from '@clerk/clerk-react';
  // const { user } = useUser();
  // const { signOut } = useAuth();
  
  // 🚀 FUTURE: This would add subscription/plan management
  return {
    user: null as User | null,
    loading: false,
    error: null as string | null,
    signIn: async (email: string, password: string) => {},
    signUp: async (email: string, password: string, name: string) => {},
    signOut: async () => {},
    signInWithGoogle: async () => {}
  };
};

// Convenience functions
export const auth = AuthService.getInstance();

export const requireAuth = (user: User | null): User => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // TODO: Implement role-based permissions
  const permissions = {
    free: ['create_video', 'download_video'],
    premium: ['create_video', 'download_video', 'hd_export', 'commercial_use'],
    enterprise: ['create_video', 'download_video', 'hd_export', 'commercial_use', 'api_access', 'team_features']
  };
  
  return permissions[user.plan]?.includes(permission) ?? false;
};