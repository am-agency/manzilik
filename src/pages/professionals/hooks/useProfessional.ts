import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client, Professional } from '../../../API';
import { NO_NAME } from '../../../locales/strings';
import { getUserName } from '../../../utils';
import { User } from '../../../app/types';

export enum ClientType {
  PROFESSIONAL = 'PROFESSIONAL',
  HOMEOWNER = 'HOMEOWNER',
}

export const useProfessional = () => {
  const [professional, setProfessional] = useState<Professional>();
  const { t } = useTranslation();

  const isProfessional = (client?: Client) => {
    return client?.type == ClientType.PROFESSIONAL;
  };

  const getProfessionalUserName = (professional?: Professional) => {
    if (professional?.company_name) {
      return professional.company_name;
    } else if (professional?.client) {
      return getUserName(professional.client);
    } else {
      return t(NO_NAME);
    }
  };
  const professionalUserName = useMemo(() => {
    return getProfessionalUserName(professional);
  }, [professional, t]);

  return { professional, isProfessional, professionalUserName, getProfessionalUserName, setProfessional };
};
