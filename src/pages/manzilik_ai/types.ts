import { AIDesignLabelList } from '../../API';

/* eslint-disable @typescript-eslint/no-explicit-any */
export enum PaymentMethod {
  VISA,
  MASTER,
  MADA,
}

export interface RequestPurchaseCreditInput {
  package_id: string;
  payment_method_id: string;
}

export interface PaymentPagination {
  limit: number;
  offset: number;
}
export interface AIPagination {
  limit: number;
  offset: number;
}

export interface RequestPurchaseCreditResponse {
  checkout_id: string;
}

export interface Package {
  id: string;
  name: string;
  credit_amount: number;
  price: number;
  discount: number;
}

export enum AIDesignStatus {
  PENDING,
  SUCCESS,
  REJECTED,
}

export enum PaymentStatus {
  PENDING,
  SUCCEEDED,
  FAILED,
  REJECTED,
  TIMEOUT,
  UNKNOWN,
}
export interface PackageList {
  count: number;
  next: string;
  previous: string;
  results: [Package];
}
export interface AIDesignObject {
  id: string;
  created_at: string;
  updated_at: string;
  sourceImageUrl: string;
  selectedImageIndex: number;
  processedImagesPath: [string];
  visibility: string;
  processingType: string;
  roomType: AIDesignRoomType;
  style: AIDesignStyle;
  status: AIDesignStatus;
  objects?: AIDesignLabelList;
}

export interface AIDesignObjectList {
  count: number;
  results: [AIDesignObject];
}

export interface AIOption {
  name: string;
  slug: string;
  image: string;
}
export interface AIOptions {
  name: string;
  slug: string;
  values: [AIOption];
}

export interface AIOptionInput {
  optionNameSlug: string;
  optionValueSlug: string;
}

export interface GenerateAIDesignInput {
  imageURL: string;
  styleSlug: string;
  roomTypeSlug: string;
  visibility: string;
  processingType: string;
  advancedOptions: [AIOptionInput];
  text: string;
}
export interface AIDesignStyle {
  id?: string;
  name: string;
  slug: string;
  image: string;
  template_prompt?: string;
}

export interface AIDesignRoomType {
  id?: string;
  name: string;
  slug: string;
  image: string;
}

export interface AIDesignStyleList {
  count: number;
  results: [AIDesignStyle];
}

export interface AIDesignRoomTypeList {
  count: number;
  results: [AIDesignRoomType];
}
export interface AIPresignedUrlInput {
  content_type: string;
  file_name: string;
}

export interface PresignedUrl {
  result: string;
}

export interface CancelAIDesignGenerationResponse {
  message: string;
}

export interface listPublishedDesignsResponse {
  data: {
    listPublishedAIDesigns: AIDesignObjectList;
  };
}

export interface listAiStylesResponse {
  data: {
    listAIStyles: AIDesignStyleList;
  };
}

export interface listAiRoomTypesResponse {
  data: {
    listAIRoomTypes: AIDesignRoomTypeList;
  };
}

export interface listMyDesignsResponse {
  data: {
    listMyAIDesigns: AIDesignObjectList;
  };
}

export interface ImageNotificationResponse {
  userId: string;
  recommendedImages: [string];
  error: string;
}

export interface RateAIDesignInput {
  imageId: string;
  rating: number;
  comments: string;
}

export interface SuccessAIResponse {
  message: string;
}

export interface PaymentStatusResponse {
  checkout_id: string;
  package_id: string;
  status: PaymentStatus;
}
