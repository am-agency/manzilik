import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BADGES,
  CONTACT_INFO,
  COVERED_CITIES,
  DESC_ABOUT_ME,
  SERVICES,
  SHOW_CONTACT_INFO,
  WEBSITE,
} from '../../../../locales/strings';
import CustomTag from '../../../../components/custom_tag';
import { Professional } from '../../../../API';
import { ProfessionalBadgesAndRewords } from '../professional_padges_and_rewords';
import Separator from '../../../../components/separator';
import { profileIcons } from '../../../../assets/icons/profile';
import { getPhoneNumberFormat } from '../../../../utils';

interface ProfessionalProps {
  professional: Professional;
}

const ProfessionalContactInfo = (props: ProfessionalProps) => {
  const { professional } = props;
  const { t } = useTranslation();
  const [isInfoVisible, setIsInfoVisible] = React.useState(true);
  const getWebsiteUrl = () => {
    const blog = professional?.client?.blog!;
    if (!blog?.includes('http')) {
      return blog?.replace(blog, `http://${blog}`);
    }
    return blog;
  };
  const handleInVisible = () => {
    setIsInfoVisible(!isInfoVisible);
  };
  return (
    <div className="prof-contact-info">
      <div className="prof-contact-info-header">
        <p>{t(CONTACT_INFO)}</p>
        {isInfoVisible ? <p onClick={handleInVisible}>{t(SHOW_CONTACT_INFO)}</p> : null}
      </div>
      {!isInfoVisible && (
        <div className="prof-card-contact-section">
          {professional?.client?.mobile && (
            <>
              <a href={`tel:${professional?.client?.mobile}`}>
                <div className="contact-info">
                  <img src={profileIcons.goldPhone} />
                  <div className="prof-mobile">
                    {getPhoneNumberFormat(professional?.client?.country_code!, professional?.client?.mobile!)}
                  </div>
                </div>
              </a>
            </>
          )}
          {professional?.client?.email! && (
            <>
              <Separator vertical={3} />
              <div className="contact-info">
                <img src={profileIcons.goldEmail} />
                <div className="prof-mobile">{professional?.client?.email}</div>
              </div>
            </>
          )}

          {professional?.client?.blog! && (
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

      <div className="prof-contact-info-desc">
        <p>{t(DESC_ABOUT_ME)}</p>
        <p className="description">{professional?.client?.about_me}</p>
      </div>
      <div className="horizontal-line"></div>
      <div className="prof-contact-info-services">
        <p>{t(SERVICES)}</p>
        <div className="services-wrapper">
          {professional?.services?.map((service) => {
            return <CustomTag key={service?.id}>{service?.title}</CustomTag>;
          })}
        </div>
      </div>
      <div className="prof-contact-info-sections">
        <p>{t(COVERED_CITIES)}</p>
        <div className="covered-cities-wrapper">
          {professional?.locations?.map((location) => {
            return <CustomTag key={location?.id}>{location?.name}</CustomTag>;
          })}
        </div>
      </div>
      <div className="prof-contact-info-bagdes">
        <p>{t(BADGES)}</p>
        <div>{professional && <ProfessionalBadgesAndRewords professional={professional} id={professional?.id} />}</div>
      </div>
    </div>
  );
};

export default ProfessionalContactInfo;
