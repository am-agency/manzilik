import { useEffect, useState } from 'react';
import { useMainContext } from '../../../../../app/providers/main';
import { ServiceInquiryRejectionReason } from '../../../../professionals/request_professional_service/types';
import {
  completeServiceInquiry,
  cancelServiceInquiry,
  CompleteServiceInquiryInput,
  listServiceInquiryRejectionReason,
  respondServiceInquiry,
  RespondServiceInquiryInput,
  RespondServiceInquiryOutput,
  CancelServiceInquiryInput,
} from '../api';

export const useServiceRequestActions = () => {
  const [rejectionReasons, setRejectionReasons] = useState<ServiceInquiryRejectionReason[]>([]);
  const { requestApi } = useMainContext();

  const respondToServiceRequest = async (input: RespondServiceInquiryInput) => {
    return new Promise<RespondServiceInquiryOutput>((resolve, reject) => {
      requestApi(respondServiceInquiry, input, (result: RespondServiceInquiryOutput, error: string) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  };

  const completeServiceRequest = async (input: CompleteServiceInquiryInput) => {
    return new Promise<RespondServiceInquiryOutput>((resolve, reject) => {
      requestApi(completeServiceInquiry, input, (result: RespondServiceInquiryOutput, error: string) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  };

  const cancelServiceRequest = async (input: CancelServiceInquiryInput) => {
    return new Promise<RespondServiceInquiryOutput>((resolve, reject) => {
      requestApi(cancelServiceInquiry, input, (result: RespondServiceInquiryOutput, error: string) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  };

  const acceptServiceRequest = async (id: string) => {
    return respondToServiceRequest({ id, response: 'ACCEPT' });
  };

  const rejectServiceRequest = async (id: string, rejection_reasons?: string[], rejection_note?: string) => {
    return respondToServiceRequest({ id, response: 'REJECT', rejection_note, rejection_reasons });
  };
  const completedServiceRequest = async (id: string, completed_by: string) => {
    return completeServiceRequest({ id, completed_by });
  };

  const cancelledServiceRequest = async (id: string, canceled_by: string, note: string) => {
    return cancelServiceRequest({ id, canceled_by, note });
  };

  const loadRejectionReasons = () => {
    requestApi(
      listServiceInquiryRejectionReason,
      { offset: 0, limit: 12 },
      (result: ServiceInquiryRejectionReason[], error: string) => {
        if (!error) {
          setRejectionReasons(result);
        }
      }
    );
  };

  return {
    acceptServiceRequest,
    rejectServiceRequest,
    rejectionReasons,
    loadRejectionReasons,
    completedServiceRequest,
    cancelledServiceRequest,
  };
};
