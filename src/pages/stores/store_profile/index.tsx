import React, { useEffect, useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
import { Row, Button, Col, Rate, Tabs, message, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Brand, Review, ReviewInput } from '../../../API';
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
  EDIT_REVIEW,
  LINK_COPIED,
  PHOTOS,
  REVIEWS,
  SEND,
  SEND_BY_EMAIL,
  SEND_MESSAGE,
  WRITE_REVIEW,
  REVIEW,
  SHARE,
} from '../../../locales/strings';
import { scrollToSection } from '../../../utils';

import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { listLimit as limit } from '../../../app/settings';
import SendMessageForm from '../../../components/send_message_form';
import { replaceSpace } from '../../ideas/utils';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../app/providers/main/loading_constants';
import { listReviews } from '../../professionals/api';
import ReviewStore from '../components/review_store';
import { editStoreReview, getBrandFromApi, reviewBrand } from '../api';
import { RenderTabsPane } from '../components/render_tabs_pane';
import { getFloatRoundUp } from '../../professionals/utils';
import { BRANDS_ROUTE } from '../../../utils/routes';
import { StoreLogDetails } from '../components/store_log_details';

const { TabPane } = Tabs;
const { REACT_APP_BASE_URL } = process.env;

const StoreProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();

  const [store, setStore] = useState<Brand>();
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review>();
  const { xs } = useBreakpoint();
  const { showModal, setModalVisible } = useModal();
  const { t } = useTranslation();
  const { requestApi, userState } = useMainContext();
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const onFinish = (values: ReviewInput) => {
    requestApi(reviewBrand, { ...values, resourceId: id }, (res: Review, err: string) => {
      if (err) {
        return;
      }
      getBrandData();
      setModalVisible?.(false);
    });
  };
  const getstoreReviews = (refresh = false) => {
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

  const reviewProf = () => {
    editReviewProf();
    showModal(t(WRITE_REVIEW), <ReviewStore onFinish={onFinish} />, 'modal-wrapper review-store', t(SEND));
  };

  const onEditReview = (values: ReviewInput) => {
    requestApi(editStoreReview, { ...values, resourceId: id, id: myReview?.id }, (response: Review, err: string) => {
      if (err) {
        return;
      }
      getBrandData();
      setMyReview(response);
      setModalVisible?.(false);
    });
  };

  const onSendMessage = () => {
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm email={store?.email!} />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  const editReviewProf = () => {
    showModal(
      t(EDIT_REVIEW),
      <ReviewStore onFinish={onEditReview} review={myReview} />,
      'modal-wrapper review-store',
      t(SEND)
    );
  };

  const getBrandData = () => {
    requestApi(
      getBrandFromApi,
      { id },
      (response: Brand, error: string) => {
        if (error) {
          return;
        }
        setStore(response);
        if (response.id) {
          getstoreReviews(true);
        }
      },
      //TODO: will enable it after merging the pagination code
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };

  const onShareProfile = () => {
    message.destroy();
    navigator.clipboard.writeText(REACT_APP_BASE_URL + pathname);
    message.success(`${t(LINK_COPIED)}: ${REACT_APP_BASE_URL + pathname}`);
  };

  const onLoadMore = () => {
    getstoreReviews();
  };

  useEffect(() => {
    getBrandData();
  }, [i18n.language]);

  //@TODO: should refactor the component into seprated components
  return (
    <Row className="store-profile" justify="center">
      <Col span={24} className="store-profile-header">
        <Row justify="center" className="img-fit-content header-overlay" align="bottom">
          <Col xl={21} lg={21} md={21} sm={22} xs={22}>
            <Row gutter={12} align="middle">
              <Col xl={4} lg={4} md={8} sm={8} xs={8}>
                <Avatar shape="square" className="prof-avatar" size={xs ? 100 : 176} src={store?.logo} />
                <Separator vertical={10} />
              </Col>
              <Col xl={20} lg={20} md={16} sm={16} xs={16}>
                <Row
                  justify={xs ? 'center' : 'space-between'}
                  gutter={[
                    { xl: 0, lg: 0, md: 0, sm: 0, xs: 0 },
                    { xl: 12, lg: 12, md: 0, sm: 0, xs: 0 },
                  ]}
                  className="prof-data-container"
                >
                  <Col span={24}>
                    <Row justify={xs ? 'center' : 'space-between'} align="middle">
                      <Col xl={12} lg={12} md={20} sm={24} xs={24} className="prof-data">
                        <div>
                          <Row className="store-title">
                            <Col>
                              <div className="store-title__tag">{t(store?.type as unknown as string)}</div>
                            </Col>
                            <Col className="store-title__name">{store?.title}</Col>
                          </Row>
                        </div>
                        <span>
                          {(getFloatRoundUp(store?.rate!) || '0.0') + '\t\t\t'}
                          <Rate value={store?.rate!} disabled allowHalf />
                          <span className="total-wrapper">{store?.rates_count!}</span>
                          <span className="review-text">{t(REVIEW)}</span>
                        </span>
                        <div>{store?.address}</div>
                      </Col>

                      <Separator horizontal={7} />
                      <Col xl={10} lg={10} md={20} sm={24} xs={24} className="action-btns">
                        <Row justify="end" align="middle" className="action-buttons-large-screen follow-send-message">
                          <div className="store-profile-toolbar">
                            <Button icon={<MailOutlined />} className="send-btn" onClick={onSendMessage}>
                              {t(SEND_MESSAGE)}
                            </Button>
                          </div>
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
          <Col xl={5} lg={5} md={8} sm={24} xs={24}>
            <Separator vertical={10} />
            {store && <StoreLogDetails item={store} />}

            <Separator vertical={10} />

            <Row className="tags-list-container" align="middle">
              {/* @TODO: refactor into a parameterized component */}
              {store?.tags?.results?.map((tag, index) => {
                if (!tag || !tag.title!) {
                  return null;
                }
                const urlParams = new URLSearchParams();
                urlParams.set('c', replaceSpace(tag?.title));
                return (
                  <Link key={`store-tag-${index}`} to={`${BRANDS_ROUTE}/?${urlParams.toString()}`}>
                    <Tag className="store-tag">{tag.title}</Tag>
                  </Link>
                );
              })}
            </Row>
            <Separator vertical={12} />
            <GreyButton className="" text={t(SHARE)} icon={icons.social_medai.icon} onClick={onShareProfile} />
          </Col>
          <Col xl={18} lg={18} md={15} sm={24} xs={24} className="tabs-wrapper">
            <Tabs onTabClick={scrollToSection}>
              <TabPane tab={<span>{t(ABOUT_ME)}</span>} key={'about-me'} />
              <TabPane tab={<span>{t(PHOTOS)}</span>} key={'photos'} />
              <TabPane tab={<span>{t(REVIEWS)}</span>} key={'comments'} />
            </Tabs>
            {store && id && (
              <RenderTabsPane
                brand={store}
                id={id}
                reviewsList={reviewsList}
                onLoadMore={onLoadMore}
                total={total}
                reviewProf={reviewProf}
              />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default StoreProfile;
