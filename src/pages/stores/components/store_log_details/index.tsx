import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brand } from '../../../../API';
import { BRAND_PAGE } from '../../../../app/settings';
import { profileIcons } from '../../../../assets/icons/profile';
import Separator from '../../../../components/separator';
import { UserDetailsLog } from '../../../../components/user_details_log';
import { WEBSITE } from '../../../../locales/strings';

interface Props {
  item: Brand;
}
export const StoreLogDetails = ({ item }: Props) => {
  const { t } = useTranslation();

  return (
    <UserDetailsLog
      analyticsContactName={item.title!}
      renderContent={
        <div className="store-card-contact-section">
          {item?.phone && (
            <a href={`tel:${item.phone}`}>
              <div className="contact-info">
                <img src={profileIcons.goldPhone} />
                <div className="prof-mobile">{item.phone}</div>
              </div>
            </a>
          )}
          <Separator vertical={5} />
          {item?.website && (
            <a href={item?.website} target="_blank" rel="noreferrer">
              <div className="contact-info">
                <img src={profileIcons.goldWebsite} alt="website" />
                <span> {t(WEBSITE)}</span>
              </div>
            </a>
          )}
          {item?.email && (
            <>
              <Separator vertical={5} />
              <a href={`mailto:${item.email}`}>
                <div className="contact-info">
                  <img src={profileIcons.goldEmail} className="email-icon" />
                  <div className="prof-mobile"> {item.email}</div>
                </div>
              </a>
            </>
          )}
        </div>
      }
      user={{ screenName: BRAND_PAGE, contactName: item?.title! }}
    />
  );
};
