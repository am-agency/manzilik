import {
  BasketLineInput,
  CheckoutInput,
  CheckoutMutation,
  DeleteBankCardMutation,
  DeleteProductLineFromBasketMutation,
  EditBasketProductLineQuantityMutation,
  GetAuthenticatedClientBasketQuery,
  GetAuthenticatedClientQuery,
  GetPaymentCheckoutIdQuery,
  GetPaymentStatusQuery,
  ListBasketProductsGroupedByPartnerQuery,
  ListBasketProductsQuery,
  ListPaymentMethodsQuery,
  Pagination,
  PaymentCheckoutIdForOrderInfoInput,
  PaymentCheckoutIdInput,
  PaymentStatusInput,
  InputRefundOrderLine,
  RefundOrderLineMutation,
  PaymentCheckoutIdForOrderInfoOutput,
  RefundReasons,
} from '../../../API';
import * as customQueries from '../../../custom_graphql/queries';
import * as mutation from '../../../graphql/mutations';
import * as customMutation from '../../../custom_graphql/mutations';
import { requestAuthGraphqlOperation } from '../../../utils';

export const getClientBasket = async () => {
  const response = (await requestAuthGraphqlOperation(customQueries.getAuthenticatedClientBasket)) as {
    data: GetAuthenticatedClientBasketQuery;
  };
  return response.data.getAuthenticatedClientBasket;
};

export const listBasketProducts = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listBasketProductsGroupedByPartner, { input })) as {
    data: ListBasketProductsGroupedByPartnerQuery;
  };
  return response.data.listBasketProductsGroupedByPartner;
};

export const listBasketProductsCount = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listBasketProductsCount, { input })) as {
    data: ListBasketProductsQuery;
  };
  return response.data.listBasketProducts?.results;
};

export const changeQuantity = async (input: BasketLineInput) => {
  const response = (await requestAuthGraphqlOperation(customMutation.editBasketProductLineQuantity, { input })) as {
    data: EditBasketProductLineQuantityMutation;
  };
  return response.data.editBasketProductLineQuantity;
};

export const deleteProductLineFromBasket = async (input: BasketLineInput) => {
  const response = (await requestAuthGraphqlOperation(mutation.deleteProductLineFromBasket, { input })) as {
    data: DeleteProductLineFromBasketMutation;
  };
  return response.data.deleteProductLineFromBasket;
};

export const listPaymentMethods = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listPaymentMethods, {
    input,
  })) as { data: ListPaymentMethodsQuery };
  return response.data.listPaymentMethods;
};

export const getPaymentCheckoutId = async (input: PaymentCheckoutIdInput) => {
  const response = (await requestAuthGraphqlOperation(customQueries.getPaymentCheckoutId, {
    input,
  })) as { data: GetPaymentCheckoutIdQuery };
  return response.data.getPaymentCheckoutId;
};

export const generatePaymentCheckoutIdForOrderInfo = async (input: PaymentCheckoutIdForOrderInfoInput) => {
  const response = (await requestAuthGraphqlOperation(customMutation.generatePaymentCheckoutIdForOrderInfo, {
    input,
  })) as { data: { generatePaymentCheckoutIdForOrderInfo: PaymentCheckoutIdForOrderInfoOutput } };
  return response.data.generatePaymentCheckoutIdForOrderInfo;
};

export const getPaymentStatus = async (input: PaymentStatusInput) => {
  const response = (await requestAuthGraphqlOperation(customQueries.getPaymentStatus, {
    input,
  })) as { data: GetPaymentStatusQuery };
  return response.data.getPaymentStatus;
};

export const getClientCards = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.getClientCards, { input })) as {
    data: GetAuthenticatedClientQuery;
  };
  return response.data.getAuthenticatedClient?.bankcards;
};

export const checkout = async (input: CheckoutInput) => {
  const response = (await requestAuthGraphqlOperation(customMutation.checkout, { input })) as {
    data: CheckoutMutation;
  };
  return response.data.checkout;
};

export const deleteBankCard = async (id: string) => {
  const response = (await requestAuthGraphqlOperation(mutation.deleteBankCard, id)) as {
    data: DeleteBankCardMutation;
  };
  return response.data.deleteBankCard;
};

export const getListOfRefundReasons = async () => {
  const response = (await requestAuthGraphqlOperation(customQueries.getListRefundReasons)) as {
    data: { listRefundReasons: RefundReasons };
  };
  return response.data.listRefundReasons;
};

export const refundOrderLine = async (input: InputRefundOrderLine) => {
  const response = (await requestAuthGraphqlOperation(customMutation.refundOrderLine, { input })) as {
    data: RefundOrderLineMutation;
  };
  return response.data.refundOrderLine;
};
