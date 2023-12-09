import loadable from '@loadable/component';

export const home = loadable(() => import('./pages/Home'));
export const game = loadable(() => import('./pages/Game'));
export const ranking = loadable(() => import('./pages/Ranking'));