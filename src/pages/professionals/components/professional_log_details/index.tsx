import { Button, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Professional, ProfessionalType } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { PROFESSIONAL_PAGE } from '../../../../app/settings';
import { profileIcons } from '../../../../assets/icons/profile';
import Separator from '../../../../components/separator';
import { UserDetailsLog } from '../../../../components/user_details_log';
import { SEND_MESSAGE, WEBSITE } from '../../../../locales/strings';
import { getPhoneNumberFormat, getUserName } from '../../../../utils';
import { RequestProfessionalServiceButton } from '../../request_professional_service/request_professional_service_button';

interface Props {
  item: Professional;
  isProfessionalList: boolean;
  onSendMessage?: () => void;
}

export const ProfessionalLogDetails = ({ item, isProfessionalList, onSendMessage }: Props) => {
  const { t } = useTranslation();
  const { userState } = useMainContext();

  const getWebsiteUrl = () => {
    const blog = item?.client?.blog!;
    if (!blog?.includes('http')) {
      return blog?.replace(blog, `http://${blog}`);
    }
    return blog;
  };

  return (
    <UserDetailsLog
      analyticsContactName={
        item.professional_type === ProfessionalType.COMPANY
          ? item.company_name!
          : `${item.client?.first_name} ${item.client?.last_name}`
      }
      renderContent={
        <>
          {(item?.client?.blog || item?.client?.mobile) && (
            <div className="prof-card-contact-section">
              {item?.client?.mobile && (
                <>
                  <a href={`tel:${item?.client?.mobile}`}>
                    <div className="contact-info">
                      <img src={profileIcons.goldPhone} />
                      <div className="prof-mobile">
                        {getPhoneNumberFormat(item?.client?.country_code!, item?.client?.mobile!)}
                      </div>
                    </div>
                  </a>
                </>
              )}
              {!isProfessionalList && (
                <>
                  <Separator vertical={3} />
                  <div className="contact-info">
                    <img src={profileIcons.goldEmail} />
                    <div className="prof-mobile">{item.client?.email}</div>
                  </div>
                </>
              )}
              {item?.client?.blog! && (
                <a href={getWebsiteUrl()} target="_blank" rel="noreferrer">
                  <Separator vertical={3} />
                  <div className="contact-info">
                    <img src={profileIcons.goldWebsite} alt="website" />
                    <span> {t(WEBSITE)}</span>
                  </div>
                </a>
              )}
            </div>
          )}
          <RequestProfessionalServiceButton professionalId={item.id} variant="secondary" />
        </>
      }
      user={{ screenName: PROFESSIONAL_PAGE, contactName: getUserName(item?.client) }}
    />
  );
};
