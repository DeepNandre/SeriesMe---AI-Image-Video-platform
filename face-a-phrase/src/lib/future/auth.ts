/**
 * Authentication scaffolding for future user accounts
 * 
 * This file provides the foundation for implementing user authentication
 * when the product needs user accounts and data persistence.
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
 * Authentication service interface for future implementation
 * 
 * TODO: Integrate with Auth0, Supabase, or Firebase Auth
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

// React hook for authentication state
export const useAuth = () => {
  // TODO: Implement React hook using AuthService
  // This would integrate with React context/state management
  
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