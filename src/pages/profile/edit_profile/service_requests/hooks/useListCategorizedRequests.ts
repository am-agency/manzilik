/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useState } from 'react';
import { Pagination, ServiceInquiry, ServiceInquiryFilter, ServiceInquirySection } from '../../../../../API';
import { useMainContext } from '../../../../../app/providers/main';
import { listCategorizedInquiries, listSentServiceInquiries } from '../api';
import { SharedStateContext, SharedStateInterface } from '../../../../../context/shared_state_context';
import { useSentServieRequestsList } from './useSentServieRequestsList';

enum ServiceRequestsStatus {
  NOT_LOADED,
  LOADING,
  LOADED,
  EMPTY,
}
interface SingleCategorizedInquiries {
  count: number;
  data: ServiceInquiry[];
}

interface CategorizedInquiries {
  completed_inquiries: SingleCategorizedInquiries;
  in_progress_inquiries: SingleCategorizedInquiries;
  new_inquiries: SingleCategorizedInquiries;
}

const defaultCategory = {
  count: 0,
  data: [],
};

export const useListCategorizedRequests = () => {
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { requestApi } = useMainContext();
  const [sentRequestsStatus, setSentRequestsStatus] = useState<ServiceRequestsStatus>(ServiceRequestsStatus.NOT_LOADED);

  const [completedInquires, setCompletedInquires] = useState<SingleCategorizedInquiries>(defaultCategory);
  const [inProgressInquires, setInProgressInquires] = useState<SingleCategorizedInquiries>(defaultCategory);
  const [newInquires, setNewInquires] = useState<SingleCategorizedInquiries>(defaultCategory);

  const [isLoadMoreNewInquires, setIsLoadMoreNewInquires] = useState(true);
  const [isLoadMoreInProgressInquires, setIsLoadMoreInProgressInquires] = useState(true);
  const [isLoadMoreCompletedInquires, setIsLoadMoreCompletedInquires] = useState(true);

  const listSentRequestsPromise = (pagination: Pagination, filters: ServiceInquiryFilter) => {
    return new Promise((resolve, reject) => {
      requestApi(listSentServiceInquiries, { pagination, filters }, (results: ServiceInquiry[], error: string) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  };

  const [completedInquiresPagination, setCompletedInquiresPagination] = useState({
    pagination: { offset: 0, limit: 3 },
    filters: {
      inquiry_section: ServiceInquirySection.COMPLETED,
    },
  });
  const [inProgressInquiresPagination, setInProgressInquiresPagination] = useState({
    pagination: { offset: 0, limit: 3 },
    filters: {
      inquiry_section: ServiceInquirySection.IN_PROGRESS,
    },
  });

  const [newInquiresPagination, setNewInquiresPagination] = useState({
    pagination: { offset: 0, limit: 3 },
    filters: {
      inquiry_section: ServiceInquirySection.NEW,
    },
  });

  const handleLoadMoreByCategory = (category: ServiceInquirySection) => {
    switch (category) {
      case ServiceInquirySection.COMPLETED:
        setCompletedInquiresPagination((prev) => ({
          ...prev,
          pagination: { ...prev.pagination, offset: prev.pagination.offset + 3 },
        }));
        break;
      case ServiceInquirySection.IN_PROGRESS:
        setInProgressInquiresPagination((prev) => ({
          ...prev,
          pagination: { ...prev.pagination, offset: prev.pagination.offset + 3 },
        }));
        break;
      case ServiceInquirySection.NEW:
        setNewInquiresPagination((prev) => ({
          ...prev,
          pagination: { ...prev.pagination, offset: prev.pagination.offset + 3 },
        }));
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    // Check if the current offset exceeds or equals the total count of completed inquiries
    if (completedInquiresPagination.pagination.offset > 2) {
      if (completedInquires.count !== 0 && completedInquiresPagination.pagination.offset >= completedInquires.count) {
        // If there are no more inquiries to load, disable or hide the "load more" button
        setIsLoadMoreCompletedInquires(false);
      } else {
        // If there are more inquiries to load, proceed with listing sent requests
        listSentRequestsPromise(completedInquiresPagination.pagination, completedInquiresPagination.filters).then(
          (res: any) => {
            setCompletedInquires((prev) => ({
              ...prev,
              data: [...prev.data, ...(res as ServiceInquiry[])],
            }));
            // Check if after loading, we've reached the end of the inquiries
            if (completedInquiresPagination.pagination.offset + res.length >= completedInquires.count) {
              setIsLoadMoreCompletedInquires(false);
            }
          }
        );
      }
    }
    // If the offset is not greater than 2, or in other words, it's one of the first pages,
    // we need to ensure the "load more" button is potentially visible if there are more items to load.
    // This logic might need adjustment based on how you initialize or update your pagination and counts.
    else {
      if (completedInquires.count > completedInquiresPagination.pagination.offset) {
        setIsLoadMoreCompletedInquires(true);
      } else {
        setIsLoadMoreCompletedInquires(false);
      }
    }
  }, [completedInquiresPagination, completedInquires.count]);

  useEffect(() => {
    // Check if the current offset exceeds or equals the total count of in-progress inquiries
    if (inProgressInquiresPagination.pagination.offset > 2) {
      if (
        inProgressInquires.count !== 0 &&
        inProgressInquiresPagination.pagination.offset >= inProgressInquires.count
      ) {
        // If there are no more inquiries to load, disable or hide the "load more" button
        setIsLoadMoreInProgressInquires(false);
      } else {
        // If there are more inquiries to load, proceed with listing sent requests
        listSentRequestsPromise(inProgressInquiresPagination.pagination, inProgressInquiresPagination.filters).then(
          (res: any) => {
            setInProgressInquires((prev) => ({
              ...prev,
              data: [...prev.data, ...(res as ServiceInquiry[])],
            }));
            // After updating, check if we've reached the end of the inquiries
            if (inProgressInquiresPagination.pagination.offset + res.length >= inProgressInquires.count) {
              setIsLoadMoreInProgressInquires(false);
            } else {
              // Ensure the "load more" button remains visible if there are more items to load
              setIsLoadMoreInProgressInquires(true);
            }
          }
        );
      }
    }
    // For the initial pages (offset <= 2), this else branch might not be necessary unless
    // you want to ensure the button's visibility based on other conditions.
    else {
      // Optionally, re-enable the "load more" button if starting conditions are reset
      // This depends on your specific requirements and initial state.
      if (inProgressInquires.count > inProgressInquiresPagination.pagination.offset) {
        setIsLoadMoreInProgressInquires(true);
      } else {
        setIsLoadMoreInProgressInquires(false);
      }
    }
  }, [inProgressInquiresPagination, inProgressInquires.count]);
  useEffect(() => {
    if (newInquiresPagination.pagination.offset > 2) {
      if (newInquires.count !== 0 && newInquiresPagination.pagination.offset >= newInquires.count) {
        // Disable "load more" if no more inquiries are available
        setIsLoadMoreNewInquires(false);
      } else {
        // Fetch and append new inquiries if more are available
        listSentRequestsPromise(newInquiresPagination.pagination, newInquiresPagination.filters).then((res: any) => {
          setNewInquires((prev) => ({
            ...prev,
            data: [...prev.data, ...(res as ServiceInquiry[])],
          }));
          // After updating, check if we've reached the end of the inquiries
          if (newInquiresPagination.pagination.offset + res.length >= newInquires.count) {
            setIsLoadMoreNewInquires(false);
          } else {
            // Ensure the "load more" button remains visible if there are more items to load
            setIsLoadMoreNewInquires(true);
          }
        });
      }
    }
    // The 'else' block is redundant if there's no code within it
  }, [newInquiresPagination.pagination.offset, newInquiresPagination.filters.inquiry_section, newInquires.count]);

  const loadCategorizedList = () => {
    setSentRequestsStatus(ServiceRequestsStatus.LOADING);
    requestApi(listCategorizedInquiries, {}, (results: CategorizedInquiries, error: string) => {
      if (error) {
        return;
      }
      setSentRequestsStatus(ServiceRequestsStatus.LOADED);
      const listCategorizedServiceInquiries = results;
      setCompletedInquires(listCategorizedServiceInquiries.completed_inquiries);
      setInProgressInquires(listCategorizedServiceInquiries.in_progress_inquiries);
      setNewInquires(listCategorizedServiceInquiries.new_inquiries);

      if (
        listCategorizedServiceInquiries.completed_inquiries.count === 0 &&
        listCategorizedServiceInquiries.in_progress_inquiries.count === 0 &&
        listCategorizedServiceInquiries.new_inquiries.count === 0
      ) {
        setSentRequestsStatus(ServiceRequestsStatus.EMPTY);
      }
    });
  };

  const isEmpty = useMemo(() => {
    return sentRequestsStatus === ServiceRequestsStatus.EMPTY;
  }, [sentRequestsStatus]);

  const isLoading = useMemo(() => {
    return sentRequestsStatus === ServiceRequestsStatus.LOADING;
  }, [sentRequestsStatus]);

  return {
    loadCategorizedList,
    completedInquires,
    inProgressInquires,
    newInquires,
    isEmpty,
    isLoading,
    handleLoadMoreByCategory,
    isLoadMoreCompletedInquires,
    isLoadMoreInProgressInquires,
    isLoadMoreNewInquires,
  };
};
