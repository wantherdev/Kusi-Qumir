import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { CreateClaimDto, CreateContactRequestDto } from './submission.dto';
import { SubmissionReceipt, SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Post('contact-requests')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  createContactRequest(@Body() payload: CreateContactRequestDto): Promise<SubmissionReceipt> {
    return this.submissions.createContactRequest(payload);
  }

  @Post('claims')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  createClaim(@Body() payload: CreateClaimDto): Promise<SubmissionReceipt> {
    return this.submissions.createClaim(payload);
  }
}
