import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateClaimDto, CreateContactRequestDto } from '../src/modules/submissions/submission.dto';

describe('submission DTOs', () => {
  it('rejects a contact request without explicit privacy acceptance', async () => {
    const payload = plainToInstance(CreateContactRequestDto, {
      name: 'Persona de prueba',
      email: 'persona@example.com',
      privacyAccepted: false,
    });

    const errors = await validate(payload);

    expect(errors.some((error) => error.property === 'privacyAccepted')).toBe(true);
  });

  it('requires a guardian when the consumer is a minor', async () => {
    const payload = plainToInstance(CreateClaimDto, {
      type: 'CLAIM',
      consumerName: 'Persona de prueba',
      isMinor: true,
      identityDocument: 'DOC12345',
      address: 'Dirección de prueba',
      phone: '999999999',
      email: 'persona@example.com',
      service: 'Servicio de prueba',
      detail: 'Descripción suficientemente extensa.',
      request: 'Pedido concreto',
      privacyAccepted: true,
    });

    const errors = await validate(payload);

    expect(errors.some((error) => error.property === 'guardianName')).toBe(true);
  });

  it('trims personal data before it reaches persistence', () => {
    const payload = plainToInstance(CreateContactRequestDto, {
      name: '  Persona de prueba  ',
      email: 'persona@example.com',
      privacyAccepted: true,
    });

    expect(payload.name).toBe('Persona de prueba');
  });
});
