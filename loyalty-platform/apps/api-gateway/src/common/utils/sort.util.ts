export interface SortParams {
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

const ALLOWED_SORT_FIELDS = new Set([
  'createdAt', 'updatedAt', 'name', 'email', 'status', 'role',
  'fullName', 'phone', 'totalPoints', 'availablePoints', 'tierId',
  'startDate', 'endDate', 'budget', 'pointsRequired', 'quantity',
  'code', 'type', 'value', 'maxUsage', 'usedCount', 'expiresAt',
  'priority', 'price', 'stock', 'sku', 'orderCode', 'total',
  'rating', 'minPoints', 'maxPoints', 'pointsMultiplier',
  'plan', 'amount', 'balance', 'date', 'streak', 'pointsAwarded',
]);

export function parseSort(sort?: string, allowedFields?: string[]): { orderBy: string; orderDirection: 'asc' | 'desc' } {
  if (!sort) return { orderBy: 'createdAt', orderDirection: 'desc' };
  const [field, dir] = sort.split(':');
  const whitelist = allowedFields ? new Set(allowedFields) : ALLOWED_SORT_FIELDS;
  const safeField = whitelist.has(field || '') ? field! : 'createdAt';
  return {
    orderBy: safeField,
    orderDirection: (dir === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
  };
}
