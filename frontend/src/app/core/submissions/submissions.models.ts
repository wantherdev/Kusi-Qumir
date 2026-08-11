export type SubmissionReceipt = {
  trackingCode: string;
  receivedAt: string;
};

export type ContactRequest = {
  name: string;
  email: string;
  phone?: string;
  approximateDate?: string;
  travelers?: number;
  interest?: string;
  message?: string;
  privacyAccepted: true;
};

export type ClaimRequest = {
  type: 'CLAIM' | 'COMPLAINT';
  consumerName: string;
  isMinor: boolean;
  guardianName?: string;
  identityDocument: string;
  address: string;
  phone: string;
  email: string;
  service: string;
  claimedAmount?: number;
  detail: string;
  request: string;
  privacyAccepted: true;
};
