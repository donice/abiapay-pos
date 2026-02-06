
export const protectedRoutes: string[] = [
  '/',
  '/dashboard',
  '/tickets',
  '/tickets/transport',
  '/tickets/transport/add',
  '/tickets/transport/summary',
  '/tickets/market',
];

export const unprotectedRoutes: string[] = [
  '/signin',
  '/signin/agent',
  '/signin/mda',
  '/signout',
  '/forgot-password'
];
