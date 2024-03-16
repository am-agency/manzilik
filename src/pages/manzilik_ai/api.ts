import { requestAuthGraphqlOperation, requestGraphqlOperation } from '../../utils';
import * as customQueries from '../../custom_graphql/queries';
import * as customMutations from '../../custom_graphql/mutations';
import {
  AIDesignObject,
  AIDesignObjectList,
  AIDesignRoomTypeList,
  AIDesignStyleList,
  AIOptions,
  AIPagination,
  AIPresignedUrlInput,
  CancelAIDesignGenerationResponse,
  GenerateAIDesignInput,
  PackageList,
  PaymentPagination,
  RequestPurchaseCreditInput,
  RequestPurchaseCreditResponse,
} from './types';
import {
  AIProductViewCreditResult,
  AISimilarProductFeature,
  AISimilarProductStatusResponse,
  AIVendorsFilter,
  PresignedUrl,
  SimilarAIProductList,
  SimilarAIProductsFilter,
  Vendors,
} from '../../API';

// Queries

export const getListPackages = async (input: PaymentPagination) => {
  const response = (await requestGraphqlOperation(customQueries.getListPackages, {
    input,
  })) as PackageList;
  return response;
};

export const getListPublishedAIDesignsAuth = async (input: { input: AIPagination; styleSlug: string }) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listPublishedDesigns, {
    input: input.input,
    styleSlug: input.styleSlug,
  })) as AIDesignObjectList;
  return response;
};

export const getListPublishedAIDesigns = async (input: { input: AIPagination; styleSlug: string }) => {
  const response = (await requestGraphqlOperation(customQueries.listPublishedDesigns, {
    input: input.input,
    styleSlug: input.styleSlug,
  })) as AIDesignObjectList;
  return response;
};

export const getListMyAIDesigns = async (input: AIPagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listMyAIDesigns, {
    input,
  })) as AIDesignStyleList;
  return response;
};

export const getAIStyles = async (input: AIPagination) => {
  const response = (await requestGraphqlOperation(customQueries.listAiStyles, {
    input,
  })) as AIDesignObjectList;
  return response;
};

export const getAIRoomTypes = async (input: AIPagination) => {
  const response = (await requestGraphqlOperation(customQueries.listAiRoomTypes, {
    input,
  })) as AIDesignRoomTypeList;
  return response;
};

export const getAIDesign = async (input: { id: string }) => {
  const response = (await requestGraphqlOperation(customQueries.getAIDesignDetails, {
    id: input.id,
  })) as AIDesignObject;
  return response;
};

export const getPresignedUrlForImageAIDesign = async (input: AIPresignedUrlInput) => {
  const response = (await requestGraphqlOperation(customQueries.getPresignedUrlForImageAIDesign, {
    input,
  })) as PresignedUrl;
  return response;
};

export const getAIOptions = async () => {
  const response = (await requestGraphqlOperation(customQueries.getAIOptions)) as AIOptions;
  return response;
};

export const listSimilarAIProducts = async (input: { pagination: AIPagination; filters: SimilarAIProductsFilter }) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listSimilarAIProducts, {
    filters: input.filters,
    input: input.pagination,
  })) as {
    data: SimilarAIProductList;
  };
  return response;
};

export const listAIVendors = async (input: { filters?: AIVendorsFilter }) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listAIVendors, {
    filters: input.filters,
  })) as {
    data: Vendors;
  };
  return response;
};

// Mutations
export const generateAIDesign = async (input: GenerateAIDesignInput) => {
  const response = (await requestAuthGraphqlOperation(customMutations.generateAIDesign, {
    input,
  })) as AIDesignObject;
  return response;
};

export const requestPurchaseCredit = async (input: RequestPurchaseCreditInput) => {
  const response = (await requestAuthGraphqlOperation(customMutations.generatePaymentCheckoutIdForManzilikAi, {
    input,
  })) as RequestPurchaseCreditResponse;
  return response;
};

export const cancelAIDesignGeneration = async (id: string) => {
  const response = (await requestAuthGraphqlOperation(customMutations.cancelAIDesignGeneration, {
    id,
  })) as CancelAIDesignGenerationResponse;
  return response;
};

export const selectAIDesignImage = async (input: { id: string; index: number }) => {
  const response = (await requestAuthGraphqlOperation(customMutations.selectAIDesignImage, {
    id: input.id,
    index: input.index,
  })) as AIDesignObject;
  return response;
};

export const rateAIDesign = async (input: { imageId: string; rating: number; comments: string }) => {
  const response = (await requestAuthGraphqlOperation(customMutations.rateAIDesign, {
    input,
  })) as AIDesignObject;
  return response;
};

export const deleteAiDesign = async (input: { imageId: string }) => {
  const response = (await requestAuthGraphqlOperation(customMutations.deleteAIDesign, {
    input,
  })) as {
    message: string;
  };
  return response;
};

export const startProcessSimilarAIProducts = async (Id: string) => {
  const response = (await requestAuthGraphqlOperation(
    customMutations.startProcessSimilarAIProducts,
    Id
  )) as AISimilarProductStatusResponse;
  return response;
};

export const creditPointsForAIProductView = async (input: { object_id: string; feature: AISimilarProductFeature }) => {
  const response = (await requestAuthGraphqlOperation(customMutations.creditPointsForAIProductView, {
    object_id: input.object_id,
    feature: input.feature,
  })) as AIProductViewCreditResult;
  return response;
};
