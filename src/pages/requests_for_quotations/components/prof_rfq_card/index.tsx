import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextWithIcon from '../../../../components/text_with_icon';
import { profileIcons } from '../../../../assets/icons/profile';
import CustomTag from '../../../../components/custom_tag';
import ReadMoreText from '../../../../components/read_more_text';
import {
  APPLICANTS,
  APPLIED_FOR_JOB,
  APPLY,
  BE_FIRST_ONE,
  IMAGES,
  NOT_AVAILABLE,
  NOT_EXIST,
  NO_NAME,
  PHOTOS,
  PHOTOS_ATTACHED,
  PRICE_NOT_ADDED,
  PROFESSIONAL,
  READ_MORE,
  SAR,
  SERVICES,
  SERVICE_TYPE,
} from '../../../../locales/strings';
import { ServiceInquiry } from '../../../../API';
import ManzilikDrawer from '../../../../components/manzilik_drawer';
import QuotationsDrawer from '../quotations_drawer';
import { getLayoutDirection } from '../../../../app/layouts';
import { getTimeFormatBasedOnLanguage } from '../../../idea/utils';
import { RfqContext, RfqProps } from '../../requests_for_quotations_context';
import { useMediaQuery } from 'react-responsive';
import { Elapsed } from '../../../../components/headers/notifications/elapsed';
import AvatarCard from '../../../../components/avatar_card';
import icons from '../../../../assets/icons';
import StatusCard from '../../../../components/status_card';

interface ProfRfqCardProps {
  avatarUrl?: string;
  buttonText?: string;
  text?: string;
  onCardClick?: () => void;
  item?: ServiceInquiry | null;
}

const ProfRfqCard: React.FC<ProfRfqCardProps> = ({ avatarUrl, onCardClick, buttonText, text, item }) => {
  const { t, i18n } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isArabic = getLayoutDirection(i18n.language) === 'rtl';
  const { setSelectedRfq } = useContext(RfqContext) as RfqProps;
  const handleOpenDrawer = () => {
    setSelectedRfq(item!);
    setIsDrawerOpen(!isDrawerOpen);
  };
  const isMobileView = useMediaQuery({ query: '(max-width: 482px)' });

  return (
    <>
      <div className="prof_quotation_card" onClick={onCardClick}>
        <div className="card-header" onClick={handleOpenDrawer}>
          <div className="container">
            <AvatarCard
              imageUrl={item?.sender?.profile_image || profileIcons.avatar}
              name={
                item?.sender?.first_name !== null
                  ? `${item?.sender?.first_name} ${item?.sender?.last_name}`
                  : t(NO_NAME)
              }
              title={
                item?.quotations_count! > 0 ? (
                  <p className="avatar-title">
                    <img src={profileIcons.quotationsRed} />
                    <span>{t(APPLICANTS)}</span>
                    <span>{item?.quotations_count}</span>
                  </p>
                ) : (
                  <div className="no-applicants">
                    <img src={profileIcons.quotationsRed} />
                    <span>{t(BE_FIRST_ONE)}</span>
                    <span className="btn-apply">{t(APPLY)}</span>
                  </div>
                )
              }
            />

            <img src={icons.leftArrow.icon} />
          </div>
        </div>
        <div className="card-body">
          {item?.has_quotation! ? (
            <StatusCard status={t(APPLIED_FOR_JOB)} icon={icons.checkWithEmpty} bgColor="#56d49b7a" isCenter={false} />
          ) : null}

          <ReadMoreText text={item?.description!} actionText={t(READ_MORE)} />
        </div>
        <div className="horizontal-divider"></div>
        <div className="icons-row">
          <div className="first-icon">
            <TextWithIcon icon={profileIcons.blackCoins} text={`${item?.budget_limits} ${t(SAR)}`} />
          </div>
          <div className="second-icon">
            <TextWithIcon
              icon={profileIcons.images}
              text={
                <p>
                  {t(IMAGES)}
                  <span className="images-counter">
                    {item?.photos?.results?.length! === 0 ? t(NOT_EXIST) : item?.photos?.results?.length!}
                  </span>
                </p>
              }
            />
          </div>
        </div>
        <div className="horizontal-divider"></div>
        <div className="icons-row">
          <div className="first-icon">
            <TextWithIcon icon={profileIcons.time} text={<Elapsed dateString={item?.created_at!} />} />
          </div>
          <div className="second-icon">
            <TextWithIcon icon={profileIcons.pin3} text={item?.city!?.name!} />
          </div>
        </div>
        <div className="horizontal-divider"></div>
        <div className="card-footer">
          {item?.services?.results?.length! > 0 ? (
            <div className="card-services">
              <p>{t(SERVICE_TYPE)}</p>
              <div className="tags-container">
                {item?.services?.results?.map((service) => (
                  <CustomTag key={service?.id!}>{service?.title!}</CustomTag>
                ))}
              </div>
            </div>
          ) : null}
          {/* <TextWithIcon icon={profileIcons.time} text={<Elapsed dateString={item?.created_at!} />} />
          <TextWithIcon icon={profileIcons.tag3} text={`${item?.photos?.results?.length!} ${t(PHOTOS_ATTACHED)}`} />
          <TextWithIcon icon={profileIcons.pin3} text={item?.city!?.name!} /> */}
        </div>
      </div>

      <ManzilikDrawer
        size={isMobileView ? 365 : 482}
        open={isDrawerOpen}
        setDrawerOpen={setIsDrawerOpen}
        direction={isArabic ? 'right' : 'left'}
        className="drawer-wrapper"
      >
        <QuotationsDrawer closeDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      </ManzilikDrawer>
    </>
  );
};

export default ProfRfqCard;
