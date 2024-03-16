import { Professional, ServiceInquiry } from '../../API';

export enum QuotationStatus {
  WAITING_RESPONSE = 'WAITING_RESPONSE',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

export interface ListQuotationInput {
  limit: number;
  offset: number;
  service: string;
  city: string;
}
export interface SendRFQInput {
  services: [string];
  categories: [string];
  photos: [string];
  description: string;
  budget_limits: string;
  phone_number: string;
  whatsapp_number: string;
  city: string;
}

export interface Quotation {
  id: string;
  service_inquiry: ServiceInquiry;
  professional: Professional;
  number: string;
  created_at: string;
  status: QuotationStatus;
  budget_limits: string;
  execution_time: string;
  sendbird_channel_name: string;
  sendbird_channel_url: string;
}
export interface QuotationList {
  count: number;
  next: string;
  previous: string;
  results: [Quotation];
}
