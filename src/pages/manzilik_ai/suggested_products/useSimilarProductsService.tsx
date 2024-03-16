import { useContext, useMemo, useState } from 'react';
import { useMainContext } from '../../../app/providers/main';
import {
  creditPointsForAIProductView,
  listAIVendors,
  listSimilarAIProducts,
  startProcessSimilarAIProducts,
} from '../api';
import {
  AIPagination,
  AIProductViewCreditResult,
  AISimilarProductFeature,
  AISimilarProductStatusResponse,
  AIVendorsFilter,
  SimilarAIProduct,
  SimilarAIProductsFilter,
  Vendors,
} from '../../../API';
import { ObjectRecognitionContext, ObjectRecognitionProps } from './object_recognation_context';

enum RequestsStatus {
  NOT_LOADED,
  LOADING,
  LOADED,
  EMPTY,
}

export const useSimilarProductsService = () => {
  const { requestApi } = useMainContext();
  const [listSimilarProductsStatus, setListSimilarProductsStatus] = useState<RequestsStatus>(RequestsStatus.NOT_LOADED);
  const [productProcessStatus, setProductProcessStatus] = useState<RequestsStatus>(RequestsStatus.NOT_LOADED);
  const [similarProducts, setSimilarProducts] = useState<SimilarAIProduct[]>([]);
  const [similarProductsCount, setSimilarProductsCount] = useState<number>(0);
  const [productProcess, setProductProcess] = useState<AISimilarProductStatusResponse>();
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [premiumVendors, setPremiumVendors] = useState<Vendors[]>([]);
  const [isCreditDeductionLoading, setIsCreditDeductionLoading] = useState<boolean>(false);

  const loadSimilarProductList = (pagination: AIPagination, filters: SimilarAIProductsFilter, isLoadMore: boolean) => {
    setListSimilarProductsStatus(RequestsStatus.LOADING);
    requestApi(
      listSimilarAIProducts,
      {
        pagination,
        filters,
      },
      (
        results: {
          data: {
            listSimilarAIProducts: {
              count: number;
              results: SimilarAIProduct[];
            };
          };
        },
        error: string
      ) => {
        if (error) {
          return;
        }
        setListSimilarProductsStatus(RequestsStatus.LOADED);
        if (isLoadMore) {
          setSimilarProducts([...similarProducts, ...results.data.listSimilarAIProducts.results]);
        } else {
          setSimilarProducts(results.data.listSimilarAIProducts.results);
        }
        setSimilarProductsCount(results.data.listSimilarAIProducts.count);
        if (results.data.listSimilarAIProducts.count === 0) {
          setListSimilarProductsStatus(RequestsStatus.EMPTY);
        }
      }
    );
  };

  const loadMoreSimilarProductList = (
    filters: SimilarAIProductsFilter,
    pagination: AIPagination,
    isLoadMore: boolean
  ) => {
    loadSimilarProductList(pagination, filters, isLoadMore);
  };

  const loadVendorsList = (filters?: AIVendorsFilter) => {
    requestApi(
      listAIVendors,
      {
        filters: filters || {},
      },
      (
        results: {
          data: {
            listAIVendors: Vendors[];
          };
        },
        error: string
      ) => {
        if (error) {
          return;
        }
        setVendors(results.data.listAIVendors);
      }
    );
  };

  const startSimilarProductsProcess = (Id: string) => {
    setProductProcessStatus(RequestsStatus.LOADING);
    requestApi(startProcessSimilarAIProducts, { Id }, (results: AISimilarProductStatusResponse, error: string) => {
      if (error) {
        return;
      }
      setProductProcess(results);
      setProductProcessStatus(RequestsStatus.LOADED);
    });
  };

  const creditDeduction = (id: string, feature: AISimilarProductFeature): Promise<AIProductViewCreditResult> => {
    setIsCreditDeductionLoading(true);
    return new Promise((resolve, reject) => {
      requestApi(
        creditPointsForAIProductView,
        {
          object_id: id,
          feature,
        },
        (results: AIProductViewCreditResult, error: string) => {
          setIsCreditDeductionLoading(false);
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  };

  const isEmpty = useMemo(() => {
    return listSimilarProductsStatus === RequestsStatus.EMPTY;
  }, [listSimilarProductsStatus]);

  const isLoading = useMemo(() => {
    return listSimilarProductsStatus === RequestsStatus.LOADING;
  }, [listSimilarProductsStatus]);

  const isProductProcessLoading = useMemo(() => {
    return productProcessStatus === RequestsStatus.LOADING;
  }, [productProcessStatus]);

  return {
    loadSimilarProductList,
    startSimilarProductsProcess,
    similarProducts,
    vendors,
    premiumVendors,
    isEmpty,
    isLoading,
    productProcess,
    isProductProcessLoading,
    loadVendorsList,
    loadMoreSimilarProductList,
    similarProductsCount,
    creditDeduction,
    isCreditDeductionLoading,
  };
};
