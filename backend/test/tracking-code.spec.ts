import { createTrackingCode } from '../src/common/tracking-code';

describe('createTrackingCode', () => {
  it('creates a non-sequential public code with its domain and year', () => {
    const code = createTrackingCode('REC', new Date('2026-08-10T00:00:00Z'));

    expect(code).toMatch(/^KQ-REC-2026-[A-F0-9]{12}$/);
  });

  it('does not repeat codes across submissions', () => {
    expect(createTrackingCode('CON')).not.toBe(createTrackingCode('CON'));
  });
});
