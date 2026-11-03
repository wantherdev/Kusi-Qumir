import { Injectable, inject } from '@angular/core';
import { AdminApiService } from './admin-api.service';

export const TOUR_IMAGE_LIMIT = 5 * 1024 * 1024;
const imageExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function validateTourImage(file: File): void {
  if (!imageExtensions[file.type]) throw new Error('Selecciona una imagen JPG, PNG o WebP.');
  if (!file.size || file.size > TOUR_IMAGE_LIMIT)
    throw new Error('La imagen debe tener contenido y pesar como máximo 5 MB.');
}

@Injectable({ providedIn: 'root' })
export class TourImagesService {
  private readonly admin = inject(AdminApiService);

  async upload(file: File): Promise<string> {
    validateTourImage(file);
    const client = await this.admin.authorizedClient();
    const bucket = client.storage.from('tour-images');
    const path = `${crypto.randomUUID()}.${imageExtensions[file.type]}`;
    const { error } = await bucket.upload(path, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });
    if (error)
      throw new Error(
        'No se pudo subir la imagen. Revisa tu conexión y tus permisos y vuelve a guardar. Tus datos se conservan.',
      );
    return bucket.getPublicUrl(path).data.publicUrl;
  }
}
