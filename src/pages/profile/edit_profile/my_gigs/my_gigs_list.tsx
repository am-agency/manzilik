/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Pagination, Row, Skeleton, Table, Typography } from 'antd';
import {
  ADD_NEW_SERVICE,
  ADD_SERVICE,
  BACK,
  BACK_HOME,
  BACK_TO_LOGIN,
  EDIT,
  EDIT_SERVICE,
  MANAGE_GIGS,
  NO_FAST_SERVICES,
  START_NOW_GIGS,
  THEN_CLICK_ADD_GIG,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import icons from '../../../../assets/icons';
import EmptyState from '../../../../components/empty_state_component';
import { useMainContext } from '../../../../app/providers/main';
import { ListProfessionalGigs } from './api';
import { useGigsTable } from './hooks/useGigsTable';
import { GigsListItem, PageViews } from './types';
import AddEditGig from './add_edit_gig';
import { useNotification } from '../../../../hooks/useNotification';
import { withFeature } from 'flagged';
import { GIG_SERVICES_FEATURE } from '../../../../app/settings';
import * as analytics from '../../../../analytics';
import GigsListCard from '../components/gigs_list_card';
import { useMediaQuery } from 'react-responsive';
import TutorialCard from '../../../../components/tutorial_card';
import { TutorialContext, TutorialInterface } from '../../../../context/tutorial_context';

interface MyListGigsProps {
  professionalId: string;
}

const MyListGigs = (props: MyListGigsProps) => {
  const { professionalId } = props;
  const { t, i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<GigsListItem[]>([]);
  const [currentView, setCurrentView] = useState(PageViews.LIST);
  const [selectedGig, setSelectedGig] = useState<GigsListItem>();
  const { openNotification, contextHolder } = useNotification();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [offset, setOffset] = useState(0);
  const isMobileView = useMediaQuery({ query: '(max-width: 1024px)' });
  const { currentStep, disableTutorial, stepIncremental, setPointerPosition } = useContext(
    TutorialContext
  ) as TutorialInterface;

  useEffect(() => {
    stepIncremental!(3);
    setPointerPosition!('top');
    analytics.PublishEvent(new analytics.AnalyticsInitiateAddGigTutorialEvent('gigs management tutorial'));
  }, []);
  const fetchServicesList = () => {
    setIsLoading(true);
    requestApi(
      ListProfessionalGigs,
      { resourceId: professionalId, limit: pagination.pageSize, offset },
      (
        response: {
          results: GigsListItem[];
          count: number;
        },
        error: unknown
      ) => {
        if (error) {
          return;
        }
        setData(response?.results);
        setPagination({
          ...pagination,
          total: response?.count,
        });
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    if (professionalId) {
      fetchServicesList();
    }
  }, [i18n.language, currentView, professionalId, pagination.current]);

  const handlePageChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    setOffset((newPagination.current - 1) * pagination.pageSize);
  };
  const handlePaginationChange = (page: any) => {
    setPagination({
      ...pagination,
      current: page,
    });
    setOffset((page - 1) * pagination.pageSize);
  };

  const { columns } = useGigsTable();
  const listOfSkeletons = Array.from({ length: 10 }).map((_, index) => (
    <Skeleton.Button
      key={index}
      active
      size="large"
      shape="square"
      style={{
        width: '100%',
        height: '100px',
        marginBottom: '20px',
      }}
    />
  ));

  const pageConditionalTitle =
    currentView === 'list' ? t(MANAGE_GIGS) : currentView === 'add' ? t(ADD_SERVICE) : t(EDIT_SERVICE);

  const handleAddNewService = () => {
    setCurrentView(PageViews.ADD);
    analytics.PublishEvent(new analytics.AnalyticsManageGigsEvent());
  };

  return (
    <section className="my-gigs-list">
      {contextHolder}
      <div className="my-gigs-list__header">
        <Row align="middle" justify="space-between">
          <Col>
            <Row align="middle">
              <Typography.Title level={4}>{pageConditionalTitle}</Typography.Title>
            </Row>
          </Col>
          <Col>
            {currentView === 'list' ? (
              <div className="btn-container">
                <Button type="primary" className="search-btn" onClick={handleAddNewService}>
                  <img src={icons.my_gigs.lightning} />
                  {t(ADD_NEW_SERVICE)}
                </Button>
                {currentStep && !disableTutorial ? (
                  <TutorialCard left="0%" top="150%" title={t(THEN_CLICK_ADD_GIG)} buttonText={t(ADD_NEW_SERVICE)} />
                ) : null}
              </div>
            ) : (
              <Row
                className="back-btn-container"
                onClick={() => {
                  setCurrentView(PageViews.LIST);
                }}
              >
                <Typography.Title className="back-title" level={4}>
                  {t(BACK)}
                </Typography.Title>
                {i18n.language === 'en' ? <img src={icons.rightArrow.icon} /> : <img src={icons.leftArrow.icon} />}
              </Row>
            )}
          </Col>
        </Row>
      </div>
      {isLoading && data.length === 0 ? (
        <>{listOfSkeletons}</>
      ) : (
        <div className="my-gigs-list__body">
          {currentView === 'list' ? (
            <div>
              {data.length > 0 ? (
                isMobileView ? (
                  <>
                    <div>
                      {data.map((item) => (
                        <GigsListCard
                          key={item.id}
                          gig={item}
                          onGigClick={() => {
                            setCurrentView(PageViews.EDIT);
                            setSelectedGig(item);
                          }}
                        />
                      ))}
                    </div>
                    <Pagination
                      className="pagination"
                      current={pagination.current}
                      pageSize={pagination.pageSize}
                      total={pagination.total}
                      onChange={handlePaginationChange}
                    />
                  </>
                ) : (
                  <Table
                    className="data-table select-row"
                    onRow={(row) => ({
                      // eslint-disable-next-line no-console
                      onClick: () => {
                        setCurrentView(PageViews.EDIT);
                        setSelectedGig(row);
                      },
                    })}
                    columns={columns}
                    dataSource={data}
                    loading={isLoading}
                    pagination={pagination}
                    onChange={handlePageChange}
                  />
                )
              ) : (
                <EmptyState
                  title={t(NO_FAST_SERVICES)}
                  description={t(START_NOW_GIGS)}
                  actionElement={
                    <div className="empty-state-action-btn">
                      <img src={icons.my_gigs.lightning} />
                      {t(ADD_NEW_SERVICE)}
                    </div>
                  }
                  actionFunction={() => {
                    setCurrentView(PageViews.ADD);
                  }}
                  image={icons.empty_state}
                />
              )}
            </div>
          ) : (
            <AddEditGig setCurrentView={setCurrentView} currentView={currentView} selectedGig={selectedGig} />
          )}
        </div>
      )}
    </section>
  );
};

export default withFeature(GIG_SERVICES_FEATURE)(MyListGigs);
