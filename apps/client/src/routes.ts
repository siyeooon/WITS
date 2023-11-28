import loadable from '@loadable/component';

export const home = loadable(() => import('./pages/Home'));
export const game = loadable(() => import('./pages/Game'));
export const totalRanking = loadable(() => import('./pages/Ranking'));