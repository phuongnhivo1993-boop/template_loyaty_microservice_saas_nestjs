export interface SortParams {
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export function parseSort(sort?: string): { orderBy: string; orderDirection: 'asc' | 'desc' } {
  if (!sort) return { orderBy: 'createdAt', orderDirection: 'desc' };
  const [field, dir] = sort.split(':');
  return {
    orderBy: field || 'createdAt',
    orderDirection: (dir === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
  };
}
