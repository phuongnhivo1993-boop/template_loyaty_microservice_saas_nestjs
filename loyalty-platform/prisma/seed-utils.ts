import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function randomPoints(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function cleanDatabase(): Promise<void> {
  const tables = [
    'websocket_event_logs',
    'audit_logs',
    'login_attempts',
    'settings',
    'usage_records',
    'webhook_event_logs',
    'order_items',
    'coupon_usages',
    'member_gift_cards',
    'cashback_transactions',
    'daily_checkins',
    'member_feedback',
    'point_transactions',
    'member_vouchers',
    'referrals',
    'invoices',
    'subscriptions',
    'orders',
    'store_staff',
    'partner_rewards',
    'products',
    'notification_logs',
    'gift_cards',
    'coupons',
    'product_categories',
    'partner_brands',
    'cashback_configs',
    'stores',
    'missions',
    'badges',
    'promotions',
    'rewards',
    'campaigns',
    'vouchers',
    'point_earning_rules',
    'notification_templates',
    'webhook_endpoints',
    'members',
    'tiers',
    'users',
    'tenants',
    'hosts',
  ];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
  }
}

export { prisma };
