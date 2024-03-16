import { useContext, useMemo, useState } from 'react';
import { Pagination, ServiceInquiry, ServiceInquiryFilter } from '../../../../../API';
import { useClient } from '../../../../../app/hooks/use_client';
import { useMainContext } from '../../../../../app/providers/main';
import { listSentServiceInquiries } from '../api';
import { SharedStateContext, SharedStateInterface } from '../../../../../context/shared_state_context';

enum ServiceRequestsStatus {
  NOT_LOADED,
  LOADING,
  LOADED,
  EMPTY,
}

export const useSentServieRequestsList = () => {
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { requestApi } = useMainContext();
  const [sentRequestsStatus, setSentRequestsStatus] = useState<ServiceRequestsStatus>(ServiceRequestsStatus.NOT_LOADED);
  const [sentRequests, setSentRequests] = useState<ServiceInquiry[]>([]);

  const loadSentRequestsList = (pagination: Pagination, filters: ServiceInquiryFilter) => {
    setSentRequestsStatus(ServiceRequestsStatus.LOADING);
    // pagination.resourceId = client?.id;
    requestApi(listSentServiceInquiries, { pagination, filters }, (results: ServiceInquiry[], error: string) => {
      if (error) {
        return;
      }
      setSentRequests(results);
      if (pagination.offset === 0 && results.length === 0) {
        setSentRequestsStatus(ServiceRequestsStatus.EMPTY);
      } else {
        setSentRequestsStatus(ServiceRequestsStatus.LOADED);
      }
    });
  };

  const isEmpty = useMemo(() => {
    return sentRequestsStatus === ServiceRequestsStatus.EMPTY;
  }, [sentRequestsStatus]);

  const isLoading = useMemo(() => {
    return sentRequestsStatus === ServiceRequestsStatus.LOADING;
  }, [sentRequestsStatus]);

  return { loadSentRequestsList, sentRequests, isEmpty, isLoading };
};
