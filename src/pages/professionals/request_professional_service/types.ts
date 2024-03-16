import { Category, ProfessionalType, RoomType } from '../../../API';

export enum ServiceInquiryStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WAITING_RESPONSE = 'WAITING_RESPONSE',
  DELETED = 'DELETED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OPENED = 'OPENED',
  CONTRACTED = 'CONTRACTED',
}

export enum ServiceInquiryResponse {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

export interface GigInput {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface ServiceInquiryInput {
  professional_id: string;
  services: string[];
  categories: string[];
  photos: string[];
  description: string;
  budget_limits: string;
  phone_number: string;
  whatsapp_number: string;
  city: string;
  gig_input: GigInput;
}

export interface ServiceInquiryOutput {
  id: string;
  number: number;
  status: ServiceInquiryStatus;
}

export interface ListRoomTypesOutput {
  results: RoomType[];
}

export interface ListCategoriesOutput {
  results: Category[];
}

export interface ServiceInquiryListItem {
  id: string;
  number: string;
  status: ServiceInquiryStatus;
  budget_limits: string;
  services: {
    results: {
      title: string;
    }[];
  };
  sender: {
    first_name: string;
    last_name: string;
  };
  phone_number: string;
  created_at: string;
  gig_service_id: string;
  gig_service_title: string;
  gig_service_description: string;
  gig_service_price: number;
  sendbird_channel_name: string;
  sendbird_channel_url: string;
  service_type: string;
}

export interface ServiceInquiryProfessionalResponse {
  id: string;
  response: ServiceInquiryResponse;
  rejection_reasons: string;
  rejection_note: string;
}

export interface ServiceInquiryDetails extends ServiceInquiryListItem {
  id: string;
  budget_limits: string;
  description: string;
  whatsapp_number: string;
  gig_service_id: string;
  gig_service_title: string;
  gig_service_description: string;
  gig_service_price: number;
  city: {
    name: string;
    id: string;
  };
  categories: {
    results: {
      title: string;
    }[];
  };
  professional: {
    company_name: string;
    professional_type: ProfessionalType;
  };
  photos: {
    results: {
      photo: string;
    }[];
  };
}

export interface ServiceInquiryRejectionReason {
  id: string;
  title: string;
  is_note_required: boolean;
}
