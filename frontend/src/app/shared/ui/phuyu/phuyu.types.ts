export type PhuyuPose = 'empty' | 'help' | 'support' | 'thanks' | 'welcome';

export type PhuyuSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface PhuyuAsset {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

// Approved by the owner on 2026-10-24, from the City Tour brochure.
// Semantic slots share this illustration until further poses are approved.
const APPROVED_PHUYU: PhuyuAsset = {
  src: '/assets/phuyu/static/phuyu-official.webp',
  width: 512,
  height: 768,
};

export const PHUYU_ASSETS: Readonly<Record<PhuyuPose, PhuyuAsset>> = {
  empty: APPROVED_PHUYU,
  help: APPROVED_PHUYU,
  support: APPROVED_PHUYU,
  thanks: APPROVED_PHUYU,
  welcome: APPROVED_PHUYU,
};
