import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { analyticsSetUserProperties } from '../../analytics';
import { Client, Professional } from '../../API';
import { getAuthenticatedProfessional, getClient } from '../../pages/profile/api';
import { useMainContext } from '../providers/main';
import { setClientActionCreator } from '../providers/main/actions';
import { PROFESSIONAL } from '../settings';
import { CompleteProfileContext } from '../../context/complete_profile_context';
import { PreviousHistoryContext } from '../../context/previous_history_context';
import { COMPLETE_PROFILE_ROUTE } from '../../utils/routes';
import { UserRole } from '../types';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';

export const useClient = () => {
  const { userState, requestApi, dispatchUser, setProfessional, professional, isAccountTypeSelected } =
    useMainContext();

  const history = useHistory();
  const { setPreviousHistoryLink } = useContext(PreviousHistoryContext) as {
    setPreviousHistoryLink?: (link: string) => void;
  };
  const { setIsProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    setIsProfessionalCompleteProfile?: (isCompleted: boolean) => void;
  };
  const { setProfessional: setProfObject, isProfessional } = useContext(SharedStateContext) as SharedStateInterface;
  const [hasDraftRfq, setHasDraftRfq] = useState(false);

  const initClient = () => {
    // the pagination is for the client addresses
    requestApi(getClient, {}, (client: Client, error: string) => {
      if (error) {
        return;
      }

      dispatchUser(setClientActionCreator(client));
      if (client.type == PROFESSIONAL) {
        requestApi(getAuthenticatedProfessional, {}, (professional: Professional) => {
          setProfessional(professional);
          setProfObject!(professional);
          localStorage.setItem('Professional', JSON.stringify(professional));
          if (!professional?.is_profile_completed!) {
            setPreviousHistoryLink!(COMPLETE_PROFILE_ROUTE);
          } else {
            setPreviousHistoryLink!('/');
          }
          setIsProfessionalCompleteProfile && setIsProfessionalCompleteProfile(professional?.is_profile_completed!);
          analyticsSetUserProperties({
            User_type: 'Professional',
            Registered_at: new Date(professional.created_at!),
            Last_login: new Date(),
            Followers_count: professional.client?.followers_count || 0,
            Portfolio_count: professional.projects_count || 0,
            Rating: professional.reviews_total || 0,
            Verified: professional.is_verified ? 'verified' : 'unverified',
          });
        });
      } else {
        analyticsSetUserProperties({
          User_type: 'Home Owner',
          Registered_at: new Date(client.created_at!),
          Last_login: new Date(),
          Comments_count: client.comments_count as number,
          Discussions_count: client.discussions_count as number,
        });
      }
    });
  };

  useEffect(() => {
    if (
      userState.client?.draft_service_inquiry &&
      userState.client?.draft_service_inquiry !== null &&
      !isProfessional
    ) {
      setHasDraftRfq(true);
    } else {
      setHasDraftRfq(false);
    }
  }, [userState.client]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('hasDraftRfq', hasDraftRfq);
  }, [hasDraftRfq]);

  useEffect(() => {
    userState.isUserConfirmed &&
      userState.isAuthenticated &&
      !userState.client &&
      userState.role !== UserRole.Guest &&
      initClient();
  }, [userState.isAuthenticated]);

  return {
    client: userState.client,
    isProfessional,
    professional,
    initClient,
    hasDraftRfq,
  };
};
