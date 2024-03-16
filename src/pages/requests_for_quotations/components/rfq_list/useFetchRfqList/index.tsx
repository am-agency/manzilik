/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { listRfq } from '../../../api';
import { ServiceInquiry } from '../../../../../API';

interface FetchRfqListParams {
  offset: number;
  selectedServicesFilter: string[] | null;
  selectedCitiesFilter: string[] | null;
}

interface FetchRfqListReturn {
  fetchRfqList: (params: FetchRfqListParams) => Promise<ServiceInquiry[] | null>;
}

export const useFetchRfqList = (requestApi: any): FetchRfqListReturn => {
  const fetchRfqList = useCallback(
    async ({
      offset,
      selectedServicesFilter,
      selectedCitiesFilter,
    }: FetchRfqListParams): Promise<ServiceInquiry[] | null> => {
      try {
        const pagination = { limit: 10, offset };
        const response = await requestApi(listRfq, {
          ...pagination,
          services: selectedServicesFilter && selectedServicesFilter.length > 0 ? selectedServicesFilter.join(',') : '',
          cities: selectedCitiesFilter && selectedCitiesFilter.length > 0 ? selectedCitiesFilter.join(',') : '',
        });

        if (response && response.data && response.data.ListRFQ && response.data.ListRFQ.results) {
          return response.data.ListRFQ.results as ServiceInquiry[];
        } else {
          throw new Error('No data received');
        }
      } catch (error) {
        console.error('Error fetching RFQ list:', error);
        return null; // You might want to handle this differently based on your error handling strategy
      }
    },
    [requestApi]
  );

  return { fetchRfqList };
};
