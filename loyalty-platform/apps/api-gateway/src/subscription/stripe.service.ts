import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe.Stripe;

  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      this.logger.warn('STRIPE_SECRET_KEY env var not set — Stripe operations will fail');
    }
    this.stripe = new Stripe(stripeKey || '', {
      apiVersion: '2026-05-27.dahlia',
    });
  }

  async createCheckoutSession(tenantId: string, plan: string, successUrl: string, cancelUrl: string) {
    try {
      const priceId = this.getPriceId(plan);
      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { tenantId, plan },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      this.logger.log(`Checkout session created: ${session.id} | tenant=${tenantId} plan=${plan}`);
      return session;
    } catch (error) {
      this.logger.error(`Failed to create checkout session: ${(error as Error).message}`, error);
      throw error;
    }
  }

  async handleWebhook(signature: string, payload: Buffer | string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      const msg = 'STRIPE_WEBHOOK_SECRET env var not set';
      this.logger.error(msg);
      throw new Error(msg);
    }
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      this.logger.log(`Webhook received: ${event.type} | id=${event.id}`);
      return event;
    } catch (error) {
      this.logger.error(`Webhook signature verification failed: ${(error as Error).message}`, error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      this.logger.log(`Stripe subscription cancelled: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to cancel Stripe subscription: ${(error as Error).message}`, error);
      throw error;
    }
  }

  async getSubscriptionStatus(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      this.logger.log(`Stripe subscription retrieved: ${subscriptionId} status=${subscription.status}`);
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to retrieve Stripe subscription: ${(error as Error).message}`, error);
      throw error;
    }
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      this.logger.log(`Portal session created: ${session.id} | customer=${customerId}`);
      return session;
    } catch (error) {
      this.logger.error(`Failed to create portal session: ${(error as Error).message}`, error);
      throw error;
    }
  }

  private getPriceId(plan: string): string {
    const priceMap: Record<string, string | undefined> = {
      FREE: process.env.STRIPE_PRICE_FREE,
      STARTER: process.env.STRIPE_PRICE_STARTER,
      PROFESSIONAL: process.env.STRIPE_PRICE_PROFESSIONAL,
      ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE,
    };
    const priceId = priceMap[plan];
    if (!priceId) {
      const msg = `No Stripe price ID configured for plan: ${plan}. Set STRIPE_PRICE_${plan} env var.`;
      this.logger.error(msg);
      throw new Error(msg);
    }
    return priceId;
  }
}
