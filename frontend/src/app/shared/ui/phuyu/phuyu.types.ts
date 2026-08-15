export type PhuyuPose = 'empty' | 'help' | 'support' | 'thanks' | 'welcome';

export type PhuyuSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface PhuyuAsset {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

export const PHUYU_ASSETS: Readonly<Record<PhuyuPose, PhuyuAsset>> = {
  empty: {
    src: '/assets/phuyu/static/phuyu-empty.webp',
    width: 326,
    height: 499,
  },
  help: {
    src: '/assets/phuyu/static/phuyu-help.webp',
    width: 316,
    height: 526,
  },
  support: {
    src: '/assets/phuyu/static/phuyu-support.webp',
    width: 324,
    height: 530,
  },
  thanks: {
    src: '/assets/phuyu/static/phuyu-thanks.webp',
    width: 299,
    height: 525,
  },
  welcome: {
    src: '/assets/phuyu/static/phuyu-welcome.webp',
    width: 393,
    height: 540,
  },
};
