import { ServiceInquiryStatus } from '../professionals/request_professional_service/types';

export enum GigsRequestSteps {
  SERVICES,
  CITY,
  SERVICE_TYPE,
  SERVICE_DETAILS,
  SERVICE_REQUEST,
}

export interface GigsRequestInput {
  professional_id: string;
  services: string[];
  categories: string[];
  photos: string[];
  description: string;
  budget_limits: string;
  phone_number: string;
  whatsapp_number: string;
}

export interface GigsRequestOutput {
  id: string;
  number: number;
  status: ServiceInquiryStatus;
}
