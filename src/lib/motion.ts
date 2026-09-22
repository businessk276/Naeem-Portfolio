export const sectionEase = [0.16, 1, 0.3, 1] as const;

export const sectionViewport = {
  once: false,
  amount: 0.18,
  margin: '0px 0px -12% 0px',
} as const;

type EnterDirection = 'left' | 'right' | 'up' | 'down' | 'scale';

const offsets: Record<EnterDirection, { x: number; y: number; scale: number }> = {
  left: { x: -72, y: 0, scale: 1 },
  right: { x: 72, y: 0, scale: 1 },
  up: { x: 0, y: 80, scale: 1 },
  down: { x: 0, y: -48, scale: 1 },
  scale: { x: 0, y: 28, scale: 0.94 },
};

export function enterFrom(direction: EnterDirection, reduced: boolean | null, delay = 0) {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: sectionViewport,
      transition: { duration: 0.3, delay: 0 },
    };
  }

  const from = offsets[direction];
  return {
    initial: { opacity: 0, x: from.x, y: from.y, scale: from.scale },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: sectionViewport,
    transition: { duration: 1.15, delay, ease: sectionEase },
  };
}
