import { useEffect, useMemo, useState } from 'react';
import { Category, Professional, RoomType, Service } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { getProfessional } from '../../api';
import { listCategories, submitServiceInquiry } from '../api';
import { ServiceInquiryInput, ServiceInquiryOutput } from '../types';
import { SendRFQInput } from '../../../requests_for_quotations/types';
import { sendRFQ } from '../../../requests_for_quotations/api';

export const useRequestProfessionalService = () => {
  const [professional, setProfessional] = useState<Professional>();
  const { requestApi } = useMainContext();
  const [categories, setCategories] = useState<Category[]>([]);

  const getProfessionalData = (id: string) => {
    return new Promise<Professional>((resolve, reject) => {
      requestApi(getProfessional, { id }, (response: Professional, error: string) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  };

  const getCategories = () => {
    return new Promise<Category[]>((resolve, reject) => {
      requestApi(listCategories, { offset: 0, limit: 200 }, (response: Category[], error: string) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  };

  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
    });
  }, []);

  const setProfessionalId = async (id: string | null) => {
    if (id) {
      const professional = await getProfessionalData(id);
      setProfessional(professional);
    }
  };

  const services = useMemo(() => {
    return professional?.services ? (professional.services as Service[]) : [];
  }, [professional?.services]);

  const requestProfessionalService = async (input: ServiceInquiryInput) => {
    return new Promise<ServiceInquiryOutput>((resolve, reject) => {
      requestApi(submitServiceInquiry, input, (response: ServiceInquiryOutput, error: string) => {
        if (error) {
          reject(error);
          return;
        } else {
          resolve(response);
        }
      });
    });
  };

  const requestForQuotation = async (input: SendRFQInput) => {
    return new Promise<ServiceInquiryOutput>((resolve, reject) => {
      requestApi(sendRFQ, input, (response: ServiceInquiryOutput, error: string) => {
        if (error) {
          reject(error);
          return;
        } else {
          resolve(response);
        }
      });
    });
  };

  return { services, professional, setProfessionalId, requestProfessionalService, requestForQuotation, categories };
};
