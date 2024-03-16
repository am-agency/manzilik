import React, { useContext, useEffect, useMemo, useState } from 'react';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { Row, Button, Col, Rate, Tabs, message, Tag, Divider, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { DirectoryGigService, GigService, Professional, Review, ReviewInput } from '../../../API';
import i18n from '../../../app/i18n';
import { useMainContext } from '../../../app/providers/main';
import { useModal } from '../../../app/providers/modal';
import icons from '../../../assets/icons';
import Avatar from '../../../components/avatar';
import GreyButton from '../../../components/grey_button';
import { ModalTitle } from '../../../components/modal_title';
import Separator from '../../../components/separator';
import {
  ABOUT_ME,
  FOLLOW,
  LINK_COPIED,
  PHOTOS,
  PROJECTS,
  REVIEWS,
  SEND,
  SEND_BY_EMAIL,
  SHARE,
  UN_FOLLOW,
  SERVICES,
  VIDEOS,
  NO_NAME,
  FOLLOWING,
  FOLLOWERS,
  WRITE_REVIEW,
  EDIT_REVIEW,
  GIGS,
  PROVIDE_SERVICES_PACKAGE,
} from '../../../locales/strings';
import { getUserName, modifyImageUrl, scrollToSection } from '../../../utils';
import { getProfessional, listReviews } from '../api';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { getFloatRoundUp } from '../utils';
import {
  DONE,
  FOLLOWERS as followersValue,
  FOLLOWING as followingValue,
  GIG_SERVICE_CLIENT,
  MODAL_FOLLOW,
  PROFESSIONAL,
} from '../../../app/settings';
import { followUser, unFollowUser } from '../../../app/providers/api';
import SendMessageForm from '../../../components/send_message_form';
import { PROFESSIONALS_ROUTE, REQUEST_PROFESSIONAL_SERVICE_ROUTE } from '../../../utils/routes';
import { replaceSpace } from '../../ideas/utils';
import { ProfessionalBadgesAndRewords } from '../components/professional_padges_and_rewords';
import { RenderTabsPane } from '../components/render_tabs_pane';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../app/providers/main/loading_constants';
import { ProfessionalLogDetails } from '../components/professional_log_details';
import SendRequestButton from '../../../components/send_request_button';
import { CustomSwitch } from '../../../components/custom_switch';
import Followers_list from '../../public_profile/components/followers_list';
import Following_list from '../../public_profile/components/following_list';
import { getLayoutDirection } from '../../../app/layouts';
import { listLimit as limit } from '../../../app/settings';
import ReviewStore from '../../stores/components/review_store';
import { editStoreReview, reviewBrand } from '../../stores/api';
import * as analytics from '../../../analytics';
import { ListProfessionalGigs } from '../../profile/edit_profile/my_gigs/api';
import CustomLabel from '../../../components/custom_label';
import { useFeatures } from 'flagged';
import { defaultCompanyLogoSrc } from '../complete_profile/steps/step_one';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import ProfessionalContactInfo from '../components/professional_contact_info';

const { TabPane } = Tabs;
const { REACT_APP_BASE_URL } = process.env;

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { pathname, search } = useLocation();
  const location = useLocation();
  const isFollowers = search.includes('isFollowers');
  const [professional, setProfessional] = useState<Professional>();
  const { xs } = useBreakpoint();
  const { showModal } = useModal();
  const { t } = useTranslation();
  const { requestApi, userState, generalSettings } = useMainContext();
  const [isFollowed, setIsFollowed] = useState<boolean>(professional?.client?.is_followed!);
  const { showModal: showGuestModal } = useModal();
  const [type, setType] = useState<string>(followersValue);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isForceRefresh, setIsForceRefresh] = useState<boolean>(false);
  const [myReview, setMyReview] = useState<Review>();
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const showReview = generalSettings?.showProfessionalReviews;
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<GigService[]>([]);
  const [activeKey, setActiveKey] = React.useState<string>('gigs');
  const features = useFeatures();
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;

  const handleTabsChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  useEffect(() => {
    if (professional?.is_gig_professional && professional?.gigs_count && features[GIG_SERVICE_CLIENT]) {
      setActiveKey('gigs');
    } else {
      setActiveKey('about-me');
    }
  }, [professional?.is_gig_professional]);

  const fetchServicesList = () => {
    setIsLoading(true);
    requestApi(
      ListProfessionalGigs,
      {
        resourceId: id,
        limit: 50,
        offset: 0,
      },
      (
        response: {
          count: number;
          results: GigService[];
        },
        error: unknown
      ) => {
        if (error) {
          return;
        }
        setData(response.results);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchServicesList();
  }, [i18n.language]);

  useEffect(() => {
    if (isFollowers) {
      setType(followersValue);
      setModalVisible(true);
    }
  }, [location]);

  const getsProfReviews = (refresh = false) => {
    const currentOffset = refresh ? 0 : offset;
    requestApi(
      listReviews,
      { resourceId: id, offset: currentOffset, limit },
      (response: { results: Review[]; count: number }, error: string) => {
        const { results, count } = response;
        if (error) {
          return;
        }
        if (refresh && results.length !== 0) {
          setReviewsList(results);
        } else {
          setReviewsList((prevReviews) => [...prevReviews, ...results]);
        }
        setOffset(currentOffset + limit);
        setTotal(count);
      }
    );
  };
  const onLoadMore = () => {
    getsProfReviews();
  };
  const getProfessionalData = () => {
    requestApi(
      getProfessional,
      { id, isAuthenticated: userState.isAuthenticated },
      (response: Professional, error: string) => {
        if (error) {
          return;
        }
        if (response.id) {
          getsProfReviews(true);
        }
        setProfessional(response);
        setIsFollowed(response?.client?.is_followed!);
      },
      //TODO: will enable it after merging the pagination code
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };
  const reviewProf = () => {
    editReviewProf();
    showModal(t(WRITE_REVIEW), <ReviewStore onFinish={onFinish} />, 'modal-wrapper review-store', t(SEND));
  };

  const editReviewProf = () => {
    showModal(
      t(EDIT_REVIEW),
      <ReviewStore onFinish={onEditReview} review={myReview} />,
      'modal-wrapper review-store',
      t(SEND)
    );
  };
  const onEditReview = (values: ReviewInput) => {
    requestApi(editStoreReview, { ...values, resourceId: id, id: myReview?.id }, (response: Review, err: string) => {
      if (err) {
        return;
      }
      getProfessionalData();
      setMyReview(response);
      setModalVisible?.(false);
    });
  };

  const onFinish = (values: ReviewInput) => {
    requestApi(reviewBrand, { ...values, resourceId: id }, (res: Review, err: string) => {
      if (err) {
        return;
      }
      getProfessionalData();
      setModalVisible?.(false);
      analytics.PublishEvent(new analytics.AnalyticsRateProfessionalEvent(values.rating, professional?.id!));
    });
  };
  const onSendMessage = () => {
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm email={professional?.client?.email!} sendToProfessional />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  const onShareProfile = () => {
    message.destroy();
    navigator.clipboard.writeText(REACT_APP_BASE_URL + pathname);
    message.success(`${t(LINK_COPIED)}: ${REACT_APP_BASE_URL + pathname}`);
  };

  const onFollow = () => {
    if (!userState.isAuthenticated) {
      showModal(<ModalTitle />, <div />, '', '');
    } else {
      requestApi(
        followUser,
        { followee: professional?.client?.id },
        (response: { status: string; message: string }, error: string) => {
          if (error) {
            return;
          }
          const { message } = response;
          if (message === DONE) {
            setIsFollowed(true);
            analytics.PublishEvent(new analytics.AnalyticsFollowProfessionalEvent());
          }
        }
      );
    }
  };

  const onUnFollow = () => {
    if (!userState.isAuthenticated) {
      showModal(<ModalTitle />, <div />, '', '');
    } else {
      requestApi(
        unFollowUser,
        { followee: professional?.client?.id },
        (response: { status: string; message: string }, error: string) => {
          if (error) {
            return;
          }
          const { message } = response;
          if (message === DONE) {
            setIsFollowed(false);
          }
        }
      );
    }
  };

  useEffect(() => {
    getProfessionalData();
  }, [i18n.language]);

  const name = useMemo(() => {
    /**
     * Returns the name to display based on the user's professional status and username.
     */
    const isProfessional = professional?.client?.type === PROFESSIONAL;
    const username = getUserName(professional?.client);

    if (isProfessional) {
      if (professional && professional.company_name) {
        return professional.company_name;
      } else if (username) {
        return username;
      }
    } else if (username) {
      return username;
    }

    return t(NO_NAME);
  }, [professional]);

  const onFollowUser = (id?: string, type?: string) => {
    requestApi(
      followUser,
      { followee: type !== MODAL_FOLLOW ? professional?.client?.id : id },
      (response: { status: string; message: string }, error: string) => {
        if (error) {
          return;
        }
        if (type !== MODAL_FOLLOW) {
          const { message } = response;
          if (message === DONE) {
            setIsForceRefresh(!isForceRefresh);
          }
        }
      }
    );
  };

  const onUnFollowUser = (id?: string, type?: string) => {
    requestApi(
      unFollowUser,
      { followee: type !== MODAL_FOLLOW ? professional?.client?.id : id },
      (response: { status: string; message: string }, error: string) => {
        if (error) {
          return;
        }
        if (type !== MODAL_FOLLOW) {
          const { message } = response;
          if (message === DONE) {
            setIsForceRefresh(!isForceRefresh);
          }
        }
      }
    );
  };

  const modalProps = {
    onFollowUser: onFollowUser,
    onUnFollowUser: onUnFollowUser,
    userId: userState?.client?.id!,
    paginationProps: { resourceId: id, isAuthenticated: true },
    useWindow: false,
    isForceModalFetch: isForceRefresh,
  };

  const showFollowModal = (type: string) => {
    if (!userState.isAuthenticated) {
      showGuestModal(<ModalTitle />, <div />, '', '');
    } else {
      setType(type);
      setModalVisible(true);
    }
  };

  const renderModalContent = () => {
    if (type === followersValue) {
      return <Followers_list {...modalProps} />;
    } else {
      return <Following_list {...modalProps} />;
    }
  };

  const handleSwitch = (type: string) => {
    if (type) {
      setType(followingValue);
    } else {
      setType(followersValue);
    }
  };
  const onCancel = () => {
    setModalVisible(false);
  };

  const profilePhoto = useMemo(() => {
    if (professional?.company_logo!) {
      return modifyImageUrl(professional.company_logo, 108, 108);
    } else if (professional?.client?.profile_image) {
      return modifyImageUrl(professional?.client?.profile_image, 108, 108);
    }

    return defaultCompanyLogoSrc;
  }, [professional?.company_logo, professional?.client?.profile_image]);

  //@TODO: should refactor the component into seprated components
  return (
    <Row className="professional-profile" justify="center">
      <Col span={24} className="professional-profile-header">
        <Row justify="center" className="img-fit-content header-overlay" align="bottom">
          <Col xl={21} lg={21} md={21} sm={22} xs={22}>
            <Row justify="center">
              <Col xl={22} lg={20} md={19} sm={16} xs={24}>
                <Row
                  justify={xs ? 'center' : 'space-between'}
                  gutter={[
                    { xl: 0, lg: 0, md: 0, sm: 0, xs: 0 },
                    { xl: 32, lg: 32, md: 0, sm: 0, xs: 0 },
                  ]}
                  className="prof-data-container"
                >
                  <Col span={24}>
                    <Row justify={xs ? 'center' : 'space-between'} align="middle">
                      <Col xl={12} lg={12} md={24} sm={24} xs={24} className="prof-data">
                        <div className="avatar-wrapper">
                          <div className="avatar">
                            <Avatar shape="square" className="prof-avatar" size={xs ? 100 : 108} src={profilePhoto} />
                          </div>
                          <div className="info">
                            <div className="prof-name">
                              <strong>{name}</strong>
                              {professional?.is_verified && (
                                <img className="prof-badge" src={icons.verified} alt="verified" />
                              )}
                            </div>

                            <div className="rating-wrapper">
                              {professional?.is_gig_professional &&
                                professional?.gigs_count &&
                                features[GIG_SERVICE_CLIENT] && (
                                  <CustomLabel text={t(PROVIDE_SERVICES_PACKAGE)} backgroundColor="#56d49b" />
                                )}
                              {showReview && (
                                <span className="prof-profile-rating">
                                  {(getFloatRoundUp(professional?.reviews_total!) || '0.0') + '\t\t\t'}
                                  <div className="prof-profile-rating-stars">
                                    <Rate value={professional?.reviews_total!} disabled allowHalf />
                                  </div>
                                </span>
                              )}
                            </div>

                            <div className="prof-profile-address">{professional?.address}</div>
                          </div>
                        </div>
                      </Col>
                      <Col xl={12} lg={12} md={24} sm={24} xs={24} className="action-btns">
                        <Separator horizontal={7} />
                        <Row
                          justify="end"
                          align="middle"
                          wrap={false}
                          className="action-buttons-large-screen follow-send-message"
                        >
                          <>
                            <div className="follow-details">
                              <div onClick={() => showFollowModal(followersValue)}>
                                <div>
                                  <p className="follow-text">{t(FOLLOWERS)}</p>
                                  <p className="follow-count">{professional?.client?.followers_count}</p>
                                </div>
                              </div>
                              <div onClick={() => showFollowModal(followingValue)}>
                                <div>
                                  <p className="follow-text">{t(FOLLOWING)}</p>
                                  <p className="follow-count"> {professional?.client?.followees_count}</p>
                                </div>
                              </div>
                            </div>
                            {isFollowed ? (
                              <Button onClick={onUnFollow} icon={<UserDeleteOutlined />} className="follow-btn">
                                {t(UN_FOLLOW)}
                              </Button>
                            ) : (
                              <Button onClick={onFollow} icon={<UserAddOutlined />} className="follow-btn">
                                {t(FOLLOW)}
                              </Button>
                            )}
                            <Separator horizontal={7} />
                            {!isProfessional ? (
                              <SendRequestButton
                                item={professional}
                                isDisabled={userState.client?.id == professional?.client?.id}
                                backgroundImage="linear-gradient(to left, #81775C, #BCB39A"
                              />
                            ) : null}
                          </>
                          <Modal
                            width={'375px'}
                            title={
                              <>
                                <CustomSwitch
                                  onChange={handleSwitch}
                                  type={type}
                                  defaultValue={followingValue}
                                  firstLabel={`${t(FOLLOWERS)} ${professional?.client?.followers_count}`}
                                  secondLabel={`${t(FOLLOWING)} ${professional?.client?.followees_count}`}
                                />
                                <Divider type="horizontal" style={{ marginTop: '10px ', marginBottom: '0px' }} />
                              </>
                            }
                            visible={modalVisible}
                            onCancel={onCancel}
                            className={`follow-modal ${getLayoutDirection(i18n.language)}`}
                            footer={false}
                          >
                            {renderModalContent()}
                          </Modal>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={21}>
        <Row gutter={32}>
          <Col xl={7} lg={10} md={24} sm={24} xs={24}>
            <Separator vertical={10} />
            <ProfessionalContactInfo professional={professional!} />
            <Separator vertical={12} />
            <GreyButton text={t(SHARE)} icon={icons.social_medai.icon} onClick={onShareProfile} />
          </Col>
          <Col xl={16} lg={13} md={24} sm={24} xs={24} className="tabs-wrapper">
            <Tabs activeKey={activeKey} onTabClick={scrollToSection} onChange={handleTabsChange}>
              {professional?.is_gig_professional && professional?.gigs_count && features[GIG_SERVICE_CLIENT] && (
                <TabPane tab={<span>{t(GIGS)}</span>} key={'gigs'} />
              )}

              <TabPane tab={<span>{t(ABOUT_ME)}</span>} key={'about-me'} />
              <TabPane tab={<span>{t(PROJECTS)}</span>} key={'projects'} />
              <TabPane tab={<span>{t(PHOTOS)}</span>} key={'photos'} />
              <TabPane tab={<span>{t(VIDEOS)}</span>} key={'videos'} />
              <TabPane tab={<span>{t(REVIEWS)}</span>} key={'comments'} />
            </Tabs>

            {professional && id && (
              <RenderTabsPane
                professional={professional}
                id={id}
                updateUser={getProfessionalData}
                reviewsList={reviewsList}
                onLoadMore={onLoadMore}
                total={total}
                reviewProf={reviewProf}
                listOfGigServices={data}
              />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ProfessionalProfile;
