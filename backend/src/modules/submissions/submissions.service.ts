import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClaimType } from '@prisma/client';

import { createTrackingCode } from '../../common/tracking-code';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClaimDto, CreateContactRequestDto } from './submission.dto';

export type SubmissionReceipt = { trackingCode: string; receivedAt: Date };

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async createContactRequest(payload: CreateContactRequestDto): Promise<SubmissionReceipt> {
    const created = await this.prisma.contactRequest.create({
      data: {
        trackingCode: createTrackingCode('CON'),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        approximateDate: payload.approximateDate,
        travelers: payload.travelers,
        interest: payload.interest,
        message: payload.message,
        privacyPolicyVersion: this.policyVersion,
        privacyAcceptedAt: new Date(),
      },
      select: { trackingCode: true, createdAt: true },
    });

    return { trackingCode: created.trackingCode, receivedAt: created.createdAt };
  }

  async createClaim(payload: CreateClaimDto): Promise<SubmissionReceipt> {
    const created = await this.prisma.claim.create({
      data: {
        trackingCode: createTrackingCode('REC'),
        type: payload.type === 'CLAIM' ? ClaimType.CLAIM : ClaimType.COMPLAINT,
        consumerName: payload.consumerName,
        isMinor: payload.isMinor,
        guardianName: payload.isMinor ? payload.guardianName : null,
        identityDocument: payload.identityDocument,
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        service: payload.service,
        claimedAmount: payload.claimedAmount,
        detail: payload.detail,
        request: payload.request,
        privacyPolicyVersion: this.policyVersion,
        privacyAcceptedAt: new Date(),
      },
      select: { trackingCode: true, createdAt: true },
    });

    return { trackingCode: created.trackingCode, receivedAt: created.createdAt };
  }

  private get policyVersion(): string {
    return this.config.getOrThrow<string>('PRIVACY_POLICY_VERSION');
  }
}
