import { useHistory } from 'react-router';
import { useMainContext } from '../../../../app/providers/main';
import { TNotificationPage, TNotificationPayload } from '../types';
import {
  IDEA_ROUTE,
  PROFESSIONAL_PUBLIC_ROUTE,
  PROFESSIONAL_REQUESTS_WORKS_ON,
  PROFESSIONAL_SERVICE_REQUESTS_LIST_ROUTE,
  REQUESTS_FOR_QUOTATIONS,
} from '../../../../utils/routes';
import { useContext, useMemo } from 'react';
import { getOrderDetailsUrl } from '../../../../pages/profile/edit_profile/my_orders';
import { DISCUSSION_ROUTE } from '../../../../utils/routes';
import { UserRole } from '../../../../app/types';
import { CompleteProfileContext } from '../../../../context/complete_profile_context';

export const useNotificationRedirects = (payload: TNotificationPayload) => {
  const history = useHistory();
  const { userState } = useMainContext();
  const { client, role } = userState;

  const profClientUrl = useMemo(() => {
    return role === 'PROFESSIONAL'
      ? `${PROFESSIONAL_PUBLIC_ROUTE.replace(':id', client?.id!)}`
      : `/client/${client?.id}`;
  }, [client]);

  const redirectToUrl = (url: string) => {
    let target = url;
    if (url[0] !== '/') {
      const parsed = new URL(url);
      target = parsed.pathname;
    }
    history.push(target);
  };
  const professionalFromLocalStorage = JSON.parse(localStorage.getItem('Professional')!);

  const isProfessional = userState.role === UserRole.Professional;
  const { isProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    isProfessionalCompleteProfile: boolean;
  };

  const redirect = async () => {
    switch (payload.page) {
      case TNotificationPage.IDEA:
        if (payload.id) {
          const url = IDEA_ROUTE.replace(':name?', 'default').replace(':projectId', payload.id).replace(':ideaId?', '');
          redirectToUrl(url);
        }
        break;
      case TNotificationPage.DISCUSSION:
        // In this case we'll rely on url as it has the missing params
        redirectToUrl(`${DISCUSSION_ROUTE}/details/${payload.id!}`);
        break;
      case TNotificationPage.PROFESSIONAL:
        redirectToUrl(`${PROFESSIONAL_PUBLIC_ROUTE.replace(':id', payload.id!)}`);
        break;
      case TNotificationPage.FOLLOWERS:
        redirectToUrl(`${profClientUrl}?isFollowers=true`);
        break;
      case TNotificationPage.ORDER:
        redirectToUrl(getOrderDetailsUrl({ id: payload.id! }));
        break;
      case TNotificationPage.PROFILE:
        redirectToUrl(profClientUrl);
        break;
      case TNotificationPage.CREDIT_PURCHASE:
        redirectToUrl('/manzilik-ai');
        break;
      case TNotificationPage.SERVICE_INQUIRY:
        if (professionalFromLocalStorage) {
          redirectToUrl(`${PROFESSIONAL_REQUESTS_WORKS_ON}/${payload.id}`);
          break;
        } else {
          redirectToUrl(`${PROFESSIONAL_SERVICE_REQUESTS_LIST_ROUTE}/${payload.id}`);
          break;
        }
      case TNotificationPage.COMPLETE_PROFILE:
        if (isProfessionalCompleteProfile) {
          redirectToUrl('/complete-profile');
          break;
        } else {
          redirectToUrl('/edit-profile');
          break;
        }
      case TNotificationPage.MANZILIK_AI:
        redirectToUrl(payload.url!);
        break;
      case TNotificationPage.QUOTATIONS_REQUESTS:
        redirectToUrl(REQUESTS_FOR_QUOTATIONS);
        break;
      default:
        console.debug(`Notification redirect was skipped: ${payload.page}`);
    }
  };

  return { redirect };
};
