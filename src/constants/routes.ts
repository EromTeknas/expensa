// constants/routes.ts
const ROUTES = {
  LOGIN: 'LOGIN',
  HOME: 'HOME',
  SETTINGS: 'SETTINGS',
  SYNC: 'SYNC',
  TABS: 'TABS',
} as const;

export type RouteName = keyof typeof ROUTES;
export default ROUTES;
