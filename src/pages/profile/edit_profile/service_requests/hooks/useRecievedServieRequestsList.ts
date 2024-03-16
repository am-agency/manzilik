import { useContext, useMemo, useState } from 'react';
import { Pagination, ServiceInquiry } from '../../../../../API';
import { useClient } from '../../../../../app/hooks/use_client';
import { useMainContext } from '../../../../../app/providers/main';
import { listReceivedServiceInquiries } from '../api';
import { SharedStateContext, SharedStateInterface } from '../../../../../context/shared_state_context';

enum ServiceRequestsStatus {
  NOT_LOADED,
  LOADING,
  LOADED,
  EMPTY,
}

export const useRecievedServieRequestsList = () => {
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { requestApi } = useMainContext();
  const [recievedRequestsStatus, setRecievedRequestsStatus] = useState<ServiceRequestsStatus>(
    ServiceRequestsStatus.NOT_LOADED
  );
  const [recievedRequests, setRecievedRequests] = useState<ServiceInquiry[]>([]);

  const loadRecievedRequestsList = (pagination: Pagination) => {
    setRecievedRequestsStatus(ServiceRequestsStatus.LOADING);
    pagination.resourceId = client?.id;
    requestApi(listReceivedServiceInquiries, pagination, (results: ServiceInquiry[], error: string) => {
      if (error) {
        return;
      }
      setRecievedRequests(results);
      if (pagination.offset === 0 && results.length === 0) {
        setRecievedRequestsStatus(ServiceRequestsStatus.EMPTY);
      } else {
        setRecievedRequestsStatus(ServiceRequestsStatus.LOADED);
      }
    });
  };

  const isEmpty = useMemo(() => {
    return recievedRequestsStatus === ServiceRequestsStatus.EMPTY;
  }, [recievedRequestsStatus]);

  const isLoading = useMemo(() => {
    return recievedRequestsStatus === ServiceRequestsStatus.LOADING;
  }, [recievedRequestsStatus]);

  return { loadRecievedRequestsList, recievedRequests, isEmpty, isLoading };
};
