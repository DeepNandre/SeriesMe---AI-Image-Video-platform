/**
 * Payment system scaffolding for future premium features
 * 
 * This file provides the foundation for implementing Stripe
 * or other payment processing for premium subscriptions.
 */

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  plan: 'free' | 'premium' | 'enterprise';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface BillingInfo {
  email: string;
  name: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

/**
 * Payment service interface for future implementation
 * 
 * TODO: Integrate with Stripe or other payment processor
 */
export class PaymentService {
  private static instance: PaymentService;
  private initialized = false;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async init(config?: { publishableKey?: string }): Promise<void> {
    // TODO: Initialize Stripe or payment SDK
    this.initialized = !!config?.publishableKey;
  }

  async createCheckoutSession(priceId: string, userId: string): Promise<{ url: string }> {
    if (!this.initialized) {
      throw new Error('Payment service not initialized');
    }
    
    // TODO: Create checkout session via API
    return { url: '#' };
  }

  async createPortalSession(customerId: string): Promise<{ url: string }> {
    if (!this.initialized) {
      throw new Error('Payment service not initialized');
    }
    
    // TODO: Create customer portal session
    return { url: '#' };
  }

  async getSubscription(userId: string): Promise<Subscription | null> {
    // TODO: Fetch subscription from backend
    return null;
  }

  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    // TODO: Fetch payment methods from Stripe
    return [];
  }

  async updateBillingInfo(customerId: string, billingInfo: BillingInfo): Promise<void> {
    // TODO: Update customer billing information
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    // TODO: Cancel subscription
  }
}

// Convenience functions
export const payments = PaymentService.getInstance();

export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Browser-based video generation',
      'Basic Web Speech TTS',
      '720p WebM export',
      'Personal use only'
    ],
    limits: {
      videosPerMonth: 10,
      maxDuration: 30,
      storageGB: 1
    }
  },
  premium: {
    id: 'premium', 
    name: 'Premium',
    price: 9.99,
    priceId: 'price_premium_monthly',
    features: [
      'High-quality ElevenLabs TTS',
      '1080p HD video export',
      'Commercial use license',
      'Priority processing',
      'Advanced effects library'
    ],
    limits: {
      videosPerMonth: 100,
      maxDuration: 120,
      storageGB: 10
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise', 
    price: 29.99,
    priceId: 'price_enterprise_monthly',
    features: [
      'Everything in Premium',
      'Custom branding/watermarks',
      'API access',
      'Team collaboration',
      'Priority support'
    ],
    limits: {
      videosPerMonth: 1000,
      maxDuration: 300,
      storageGB: 100
    }
  }
} as const;

export type PricingPlan = keyof typeof PRICING_PLANS;