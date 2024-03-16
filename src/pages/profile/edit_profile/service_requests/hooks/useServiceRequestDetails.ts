import { useState } from 'react';
import { useMainContext } from '../../../../../app/providers/main';
import {
  ServiceInquiryDetails,
  ServiceInquiryStatus,
} from '../../../../professionals/request_professional_service/types';
import { getServiceInquiry } from '../api';
import { ServiceInquiry } from '../../../../../API';

export const useServiceRequestDetails = () => {
  const { requestApi } = useMainContext();
  const [serviceRequestDetails, setServiceRequestDetails] = useState<ServiceInquiry>();
  const [isServiceRequestDetailsLoading, setIsServiceRequestDetailsLoading] = useState<boolean>(false);

  const loadServiceRequestDetails = (id: string) => {
    setIsServiceRequestDetailsLoading(true);
    return new Promise((resolve, reject) => {
      requestApi(getServiceInquiry, id, (result: ServiceInquiry, error: string) => {
        if (error) {
          reject(error);
          return;
        }
        setIsServiceRequestDetailsLoading(false);
        resolve(result);
        setServiceRequestDetails(result);
      });
    });
  };

  const setRequestStatus = (status: ServiceInquiryStatus) => {
    setServiceRequestDetails((pre) => (pre ? { ...pre, status } : pre));
  };

  return { loadServiceRequestDetails, serviceRequestDetails, setRequestStatus, isServiceRequestDetailsLoading };
};
