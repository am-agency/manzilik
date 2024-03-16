import React, { Button, Col, List, Rate, Row, Tag, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link, useHistory } from 'react-router-dom';
import { Professional, ProfessionalType } from '../../../../API';
import { getLayoutDirection } from '../../../../app/layouts';
import { useModal } from '../../../../app/providers/modal';
import icons from '../../../../assets/icons';
import Separator from '../../../../components/separator';
import { AR } from '../../../../locales/constants';
import { PROVIDE_SERVICES_PACKAGE, READ_MORE } from '../../../../locales/strings';
import { checkEmptySimpleString, getClientProfileLink, getUserName, modifyImageUrl } from '../../../../utils';
import { useProfessional } from '../../hooks/useProfessional';
import ProfContactInfo from './prof_contact_info';
import { useEffect, useMemo } from 'react';
import { defaultCompanyLogoSrc } from '../../complete_profile/steps/step_one';
import { useMainContext } from '../../../../app/providers/main';
import CustomLabel from '../../../../components/custom_label';
import { useFeatures } from 'flagged';
import { GIG_SERVICE_CLIENT } from '../../../../app/settings';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface Props {
  item: Professional;
}

export const ProfessionalItem = ({ item }: Props) => {
  const { getProfessionalUserName } = useProfessional();
  const { t, i18n } = useTranslation();
  const { showModal } = useModal();
  const clientName = checkEmptySimpleString(getUserName(item?.client!));
  const history = useHistory();
  const { generalSettings } = useMainContext();
  const showReview = generalSettings?.showProfessionalReviews;

  const professionalPath = getClientProfileLink(item?.client!);
  const ellipsis = item.client?.about_me?.length! > 200;
  const isArabic = i18n.language == AR;
  const langDirection = getLayoutDirection(i18n.language);
  const { xs } = useBreakpoint();
  const features = useFeatures();

  const onExpand = () => {
    history.push(professionalPath);
  };

  /**
   * Retrieves the profile photo based on the presence of company logo or client's profile image.
   */
  const profilePhoto = useMemo(() => {
    if (item.company_logo) {
      return modifyImageUrl(item.company_logo, 33, 33);
    } else if (item.client?.profile_image) {
      return modifyImageUrl(item.client?.profile_image, 33, 33);
    }

    return defaultCompanyLogoSrc;
  }, [item.company_logo, item.client?.profile_image]);

  return (
    <>
      <Separator vertical={13} />

      <div className="professional-item">
        <List.Item
          key={item.client?.id}
          extra={
            <Carousel
              className="carousal-container"
              showThumbs={false}
              showStatus={false}
              autoPlay={false}
              infiniteLoop={true}
              showIndicators={item?.photos?.results?.length! > 2}
              renderArrowPrev={(onClickHandler, hasPrev) => {
                return (
                  hasPrev && (
                    <Button className={`prev-btn carousal-btns ${langDirection}`} onClick={onClickHandler}>
                      <img src={icons.leftArrow.icon} />
                    </Button>
                  )
                );
              }}
              renderArrowNext={(onClickHandler, hasNext) => {
                return (
                  hasNext && (
                    <Button className={`next-btn carousal-btns ${langDirection}`} onClick={onClickHandler}>
                      <img src={icons.rightArrow.icon} />
                    </Button>
                  )
                );
              }}
            >
              {item.photos?.results?.map((elm) => {
                return (
                  <div key={elm?.id} className="carousal-img-wrapper">
                    <img
                      className={`img-fit-content rounded-left-border ${langDirection}`}
                      alt={clientName!}
                      src={modifyImageUrl(elm?.photo!, 377, 242)}
                    />
                  </div>
                );
              })}
            </Carousel>
          }
        >
          <Row justify="space-between">
            <Col xl={15} lg={14} md={24} sm={24} xs={24}>
              <List.Item.Meta
                avatar={<Avatar className="pro-thumb" src={profilePhoto} />}
                title={
                  <>
                    <Link className="prof-name" to={`professional/${item?.id}`}>
                      {getProfessionalUserName(item)}
                      {item.is_verified && <img className="prof-badge" src={icons.verified} alt="verified" />}
                    </Link>
                    <div className="rating-wrapper">
                      {item?.is_gig_professional && item?.gigs_count && features[GIG_SERVICE_CLIENT] && (
                        <CustomLabel text={t(PROVIDE_SERVICES_PACKAGE)} backgroundColor="#56d49b" />
                      )}
                      {showReview && (
                        <div className="rating">
                          <span className="rating-number">{item?.reviews_count}</span>
                          &nbsp;&nbsp;&nbsp;
                          <Rate
                            value={Number(item?.reviews_total)}
                            disabled
                            allowHalf
                            style={{
                              fontSize: 13,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* <ClientBadgesAndRewords client={item} isSmallBadge /> */}
                  </>
                }
              />
              {item.services?.length! > 0 && (
                <>
                  <Separator vertical={8} />
                  <div className="professional__card-tags">
                    <Typography.Paragraph
                      ellipsis={{
                        rows: xs ? 2 : 1,
                      }}
                      className="services-typography"
                    >
                      {item.services?.slice(0, 5)?.map((service) => {
                        return (
                          <span key={service?.id} className="professional__card-tag service-tag">
                            <Tag>
                              <span>{service?.title}</span>
                            </Tag>
                          </span>
                        );
                      })}
                      {
                        // show +5 if services length > 5
                        item.services?.length! > 5 && (
                          <span className="professional__card-tag service-tag">
                            <Tag>
                              <span>{`+${item.services?.length! - 5}`}</span>
                            </Tag>
                          </span>
                        )
                      }
                    </Typography.Paragraph>
                    <Separator vertical={5} />
                  </div>
                </>
              )}
              {item.client && item.client?.about_me && (
                <Typography.Paragraph
                  className="about-prof"
                  ellipsis={
                    ellipsis
                      ? {
                          rows: 2,
                          expandable: true,
                          onExpand: onExpand,
                          symbol: t(READ_MORE),
                        }
                      : false
                  }
                >
                  {item.client?.about_me}
                </Typography.Paragraph>
              )}
            </Col>
            <Col xl={7} lg={10} md={24} sm={24} xs={24}>
              <ProfContactInfo item={item} />
              {/* {item && <ProfessionalLogDetails item={item} isProfessionalList onSendMessage={onSendMessage} />} */}
            </Col>
          </Row>
        </List.Item>
      </div>
    </>
  );
};
