/**
 * Analytics scaffolding for future implementation
 * 
 * This file provides a foundation for adding analytics tracking
 * when the product scales to production usage.
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

export interface UserProperties {
  userId: string;
  plan?: 'free' | 'premium';
  createdAt: Date;
  lastActiveAt: Date;
}

/**
 * Analytics service interface for future implementation
 * 
 * TODO: Integrate with analytics provider (PostHog, Mixpanel, etc.)
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized = false;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async init(config?: { apiKey?: string; debug?: boolean }): Promise<void> {
    // TODO: Initialize analytics SDK
    this.initialized = !!config?.apiKey;
  }

  track(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.log('[Analytics] Event would be tracked:', event);
      return;
    }
    // TODO: Send event to analytics provider
  }

  identify(userId: string, properties?: UserProperties): void {
    if (!this.initialized) {
      console.log('[Analytics] User would be identified:', userId, properties);
      return;
    }
    // TODO: Identify user in analytics provider
  }

  page(name: string, properties?: Record<string, any>): void {
    if (!this.initialized) {
      console.log('[Analytics] Page view would be tracked:', name, properties);
      return;
    }
    // TODO: Track page view
  }
}

// Convenience functions for common events
export const analytics = AnalyticsService.getInstance();

export const trackVideoGeneration = (method: 'browser' | 'server', duration: number) => {
  analytics.track({
    name: 'video_generated',
    properties: {
      method,
      duration_ms: duration,
      timestamp: new Date()
    }
  });
};

export const trackError = (error: string, context?: string) => {
  analytics.track({
    name: 'error_occurred',
    properties: {
      error_message: error,
      context,
      timestamp: new Date()
    }
  });
};

export const trackFeatureUsage = (feature: string, enabled: boolean) => {
  analytics.track({
    name: 'feature_toggled',
    properties: {
      feature_name: feature,
      enabled,
      timestamp: new Date()
    }
  });
};