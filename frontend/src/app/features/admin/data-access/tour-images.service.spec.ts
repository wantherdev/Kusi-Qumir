import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminApiService } from './admin-api.service';
import { TOUR_IMAGE_LIMIT, TourImagesService } from './tour-images.service';

describe('tour image uploads', () => {
  const upload = vi.fn();
  const getPublicUrl = vi.fn();
  const from = vi.fn();
  const authorizedClient = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    upload.mockResolvedValue({ error: null });
    getPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.test/image.webp' } });
    from.mockReturnValue({ upload, getPublicUrl });
    authorizedClient.mockResolvedValue({ storage: { from } });
    TestBed.configureTestingModule({
      providers: [{ provide: AdminApiService, useValue: { authorizedClient } }],
    });
  });
  it('rejects unsupported, empty and oversized files before accessing storage', async () => {
    const service = TestBed.inject(TourImagesService);
    for (const file of [
      new File(['<svg/>'], 'photo.svg', { type: 'image/svg+xml' }),
      new File([], 'empty.jpg', { type: 'image/jpeg' }),
      new File([new Uint8Array(TOUR_IMAGE_LIMIT + 1)], 'large.png', { type: 'image/png' }),
    ])
      await expect(service.upload(file)).rejects.toThrow();
    expect(authorizedClient).not.toHaveBeenCalled();
  });
  it('requires administrator authorization before uploading', async () => {
    authorizedClient.mockRejectedValue(new Error('Sin permiso'));
    await expect(
      TestBed.inject(TourImagesService).upload(
        new File(['image'], 'photo.jpg', { type: 'image/jpeg' }),
      ),
    ).rejects.toThrow('permiso');
    expect(from).not.toHaveBeenCalled();
  });
  it('uses a unique name without overwriting existing images or exposing the filename', async () => {
    const file = new File(['image'], 'my-personal-filename.webp', { type: 'image/webp' });
    expect(await TestBed.inject(TourImagesService).upload(file)).toBe(
      'https://example.test/image.webp',
    );
    expect(from).toHaveBeenCalledWith('tour-images');
    expect(upload).toHaveBeenCalledWith(expect.stringMatching(/^[a-f0-9-]{36}\.webp$/), file, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });
  });
  it('reports a failed upload without returning an unusable URL', async () => {
    upload.mockResolvedValue({ error: { message: 'internal error' } });
    await expect(
      TestBed.inject(TourImagesService).upload(
        new File(['image'], 'photo.png', { type: 'image/png' }),
      ),
    ).rejects.toThrow('No se pudo subir');
    expect(getPublicUrl).not.toHaveBeenCalled();
  });
});
