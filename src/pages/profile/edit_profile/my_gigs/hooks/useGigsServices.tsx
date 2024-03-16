import { useEffect, useMemo, useState } from 'react';
import { submitGigService, updateGigService } from '../api';
import { GigItemOutput, GigItemInput } from '../types';
import { getProfessional } from '../../../../professionals/api';
import { Professional, Service } from '../../../../../API';
import { useMainContext } from '../../../../../app/providers/main';

export const useGigsServices = () => {
  const [professional, setProfessional] = useState<Professional>();
  const { requestApi } = useMainContext();

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

  const setProfessionalId = async (id: string | null) => {
    if (id) {
      const professional = await getProfessionalData(id);
      setProfessional(professional);
    }
  };

  const services = useMemo(() => {
    return professional?.services ? (professional.services as Service[]) : [];
  }, [professional?.services]);

  const requestAddGigService = async (input: GigItemInput) => {
    return new Promise<GigItemOutput>((resolve, reject) => {
      requestApi(submitGigService, input, (response: GigItemOutput, error: string) => {
        if (error) {
          reject(error);
          return;
        } else {
          resolve(response);
        }
      });
    });
  };

  const requestEditGigService = async (input: GigItemInput) => {
    return new Promise<GigItemOutput>((resolve, reject) => {
      requestApi(updateGigService, input, (response: GigItemOutput, error: string) => {
        if (error) {
          reject(error);
          return;
        } else {
          resolve(response);
        }
      });
    });
  };

  return { services, professional, setProfessionalId, requestAddGigService, requestEditGigService };
};
