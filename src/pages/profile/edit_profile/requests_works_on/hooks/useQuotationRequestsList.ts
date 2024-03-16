import { useContext, useMemo, useState } from 'react';
import { ListQuotationInput, Pagination, Quotation, ServiceInquiry } from '../../../../../API';
import { useClient } from '../../../../../app/hooks/use_client';
import { useMainContext } from '../../../../../app/providers/main';
import { listReceivedServiceInquiries, listSentServiceInquiries } from '../api';
import { SharedStateContext, SharedStateInterface } from '../../../../../context/shared_state_context';
import { listMyQuotations } from '../../../../requests_for_quotations/api';

enum QuotationRequestsStatus {
  NOT_LOADED,
  LOADING,
  LOADED,
  EMPTY,
}

export const useQuotationRequestsList = () => {
  const { requestApi } = useMainContext();
  const [quotationsStatus, setQuotationsStatus] = useState<QuotationRequestsStatus>(QuotationRequestsStatus.NOT_LOADED);
  const [quotationsList, setQuotationsList] = useState<Quotation[]>([]);
  const [quotationsListCount, setQuotationsListCount] = useState<number>(0);

  const loadQuotationRequestsList = (pagination: ListQuotationInput) => {
    setQuotationsStatus(QuotationRequestsStatus.LOADING);
    requestApi(
      listMyQuotations,
      {
        limit: pagination.limit,
        offset: pagination.offset,
      },
      (
        results: {
          results: Quotation[];
          count: number;
        },
        error: string
      ) => {
        if (error) {
          return;
        }
        setQuotationsList(results.results);
        setQuotationsListCount(results.count);

        if (pagination.offset === 0 && results.results.length === 0) {
          setQuotationsStatus(QuotationRequestsStatus.EMPTY);
        } else {
          setQuotationsStatus(QuotationRequestsStatus.LOADED);
        }
      }
    );
  };

  const isEmpty = useMemo(() => {
    return quotationsStatus === QuotationRequestsStatus.EMPTY;
  }, [quotationsStatus]);

  const isLoading = useMemo(() => {
    return quotationsStatus === QuotationRequestsStatus.LOADING;
  }, [quotationsStatus]);

  return { loadQuotationRequestsList, quotationsList, quotationsListCount, isEmpty, isLoading };
};
