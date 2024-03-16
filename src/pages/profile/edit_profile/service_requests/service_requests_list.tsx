import { Button, Col, Input, Radio, RadioChangeEvent, Row, Select, Space, Table, Typography } from 'antd';
import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pagination,
  ServiceInquiry,
  ServiceInquiryFilter,
  ServiceInquirySection,
  ServiceInquiryStatus,
} from '../../../../API';
import {
  ADD_PROJECTS_AND_SERVICES_TO_IMPROVE_YOUR_CHANCE,
  ALL,
  BACK,
  COMPLETED_CANCELED_REQUESTS,
  DISAPPEAR,
  FIND_REQUEST_BY_NUMBER,
  INPROGRESS_REQUESTS,
  MORE,
  NEW_REQUESTS,
  RECIEVED_REQUESTS,
  REQUEST_STATUS,
  SEARCH,
  SENT_REQUESTS,
  SERVICE_REQUESTS,
  SHOW_CLOSED_COMPLETED_REQUESTS,
  THERE_ARE_NO_DATA,
} from '../../../../locales/strings';
import { useSentServieRequestsList } from './hooks/useSentServieRequestsList';
import EmptyIcon from '../../../../assets/images/Empty.svg';
import Separator from '../../../../components/separator';
import { useRecievedServieRequestsList } from './hooks/useRecievedServieRequestsList';
import { useHistory, useParams } from 'react-router-dom';
import { PROFESSIONAL_SERVICE_REQUESTS_LIST_ROUTE } from '../../../../utils/routes';
import { ServiceRequestDetails } from './service_request_details';
import { useServiceRequestTable } from './hooks/useServiceRequestTable';
import i18n from '../../../../app/i18n';
import icons from '../../../../assets/icons';
import { useProfessional } from '../../../professionals/hooks/useProfessional';
import { useClient } from '../../../../app/hooks/use_client';
import { UserRole } from '../../../../app/types';
import { useMediaQuery } from 'react-responsive';
import ServiceRequestCardDetails from '../components/service_request_card_details';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import { ReviewServiceModal } from '../../../../components/service_review_modal';
import ServiceInquiryCard from '../../../../components/service_inquiry_card';
import { useListCategorizedRequests } from './hooks/useListCategorizedRequests';
import EmptyState from '../../../../components/empty_state_component';
import Loader from 'react-spinners/ClipLoader';

const FIRST_PAGE: Pagination = {
  offset: 0,
  limit: 100,
};

enum ActiveTabId {
  RECIEVED_REQUESTS,
  SENT_REQUESTS,
}

interface Params {
  subId?: string;
}

export const ServiceRequestsList = () => {
  const { t } = useTranslation();
  const sentRequests = useSentServieRequestsList();
  const categorizedList = useListCategorizedRequests();
  const recievedRequests = useRecievedServieRequestsList();
  const history = useHistory();
  const params = useParams<Params>();
  const [selectedRequestId, setSelectedRequestId] = useState<string>();
  const table = useServiceRequestTable();
  const [filterStatus, setFilterStatus] = useState(ALL);
  const [findRequestNumberInput, setFindRequestNumberInput] = useState('');
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const professional = useProfessional();
  const isProfessional = useMemo(() => professional.isProfessional(client), [client, professional]);
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });
  const [activeTab, setActiveTab] = useState(
    isProfessional ? ActiveTabId.RECIEVED_REQUESTS : ActiveTabId.SENT_REQUESTS
  );
  const [showClosedSection, setShowClosedSection] = useState(false);
  const [isFilterClicked, setIsFilterClicked] = useState(false);

  const HandleToggleClosedSection = () => {
    setShowClosedSection(!showClosedSection);
  };

  useEffect(() => {
    setActiveTab(isProfessional ? ActiveTabId.RECIEVED_REQUESTS : ActiveTabId.SENT_REQUESTS);
  }, [isProfessional, client]);
  useEffect(() => {
    categorizedList.loadCategorizedList();
  }, []);

  const reload = () => {
    return categorizedList.loadCategorizedList();
  };

  useEffect(() => {
    switch (activeTab) {
      case ActiveTabId.RECIEVED_REQUESTS:
        table.setData(recievedRequests.recievedRequests);
        break;
      case ActiveTabId.SENT_REQUESTS:
        table.setData(sentRequests.sentRequests);
        break;
    }
  }, [sentRequests.sentRequests, recievedRequests.recievedRequests]);

  const onChangeTab = (event: RadioChangeEvent) => {
    setActiveTab(event.target.value);
  };

  const isLoading = useMemo(() => {
    switch (activeTab) {
      case ActiveTabId.RECIEVED_REQUESTS:
        return recievedRequests.isLoading;
      case ActiveTabId.SENT_REQUESTS:
        return sentRequests.isLoading;
    }
  }, [recievedRequests.isLoading, sentRequests.isLoading, activeTab]);

  const showItemDetails = (item: ServiceInquiry) => {
    if (item?.gig_service_id) {
      history.push(
        `${PROFESSIONAL_SERVICE_REQUESTS_LIST_ROUTE}/${item.id}?isGigService=true&isReceivedRequest=${
          activeTab === ActiveTabId.RECIEVED_REQUESTS
        }}`
      );
    } else {
      history.push(
        `${PROFESSIONAL_SERVICE_REQUESTS_LIST_ROUTE}/${item.id}?isReceivedRequest=${
          activeTab === ActiveTabId.RECIEVED_REQUESTS
        }`
      );
    }
    setSelectedRequestId(item?.id!);
  };

  useEffect(() => {
    setSelectedRequestId(params.subId);
  }, [params.subId]);

  const options = useMemo(() => {
    return [
      ALL,
      ServiceInquiryStatus.ACCEPTED,
      ServiceInquiryStatus.REJECTED,
      ServiceInquiryStatus.WAITING_RESPONSE,
      ServiceInquiryStatus.CONTRACTED,
      ServiceInquiryStatus.COMPLETED,
      ServiceInquiryStatus.DELETED,
      ServiceInquiryStatus.OPENED,
      ServiceInquiryStatus.CANCELLED,
      ServiceInquiryStatus.DRAFT,
      ServiceInquiryStatus.CLOSED,
    ];
  }, []);

  const onSelectStatus = (status: string) => {
    setFilterStatus(status);
    setIsFilterClicked(true);
    if (status === ALL) {
      table.clearFilters();
      setIsFilterClicked(false);
    } else {
      sentRequests.loadSentRequestsList(FIRST_PAGE, {
        inquiry_status: status as ServiceInquiryStatus,
      });
    }
  };

  const onFindRequestChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setFindRequestNumberInput(value);
    if (value === '') {
      table.clearFilters();
      setIsFilterClicked(false);
    }
  };

  const onFindRequestByNumber = () => {
    if (!findRequestNumberInput) {
      return;
    }
    setIsFilterClicked(true);
    sentRequests.loadSentRequestsList(FIRST_PAGE, {
      inquiry_number: findRequestNumberInput as string,
    });
  };

  return !selectedRequestId ? (
    <section className="service-request-list">
      <Row align="middle" justify="space-between">
        <Col>
          <Row align="middle" className="service-request-list-header">
            <Typography.Title level={4}>{t(SERVICE_REQUESTS)}</Typography.Title>
            <Separator horizontal={5} />
            {isProfessional ? (
              <Radio.Group onChange={onChangeTab} value={activeTab} style={{ marginTop: '-5px' }}>
                <Radio.Button value={ActiveTabId.RECIEVED_REQUESTS}>{t(RECIEVED_REQUESTS)}</Radio.Button>
                <Radio.Button value={ActiveTabId.SENT_REQUESTS}>{t(SENT_REQUESTS)}</Radio.Button>
              </Radio.Group>
            ) : null}
          </Row>
        </Col>
        <Col>
          <Row wrap={false} className="actions-header">
            <Select
              placeholder={t(REQUEST_STATUS)}
              showSearch={false}
              className="request-status-select ant-select-customize-input"
              onChange={onSelectStatus}
              value={filterStatus}
            >
              {options.map((option) => {
                return (
                  <Select.Option key={option} value={option}>
                    {option === ALL ? t(option) : t(`${option}_REQUEST`)}
                  </Select.Option>
                );
              })}
            </Select>
            <Separator horizontal={5} />
            <Input
              value={findRequestNumberInput}
              placeholder={t(FIND_REQUEST_BY_NUMBER)}
              onChange={onFindRequestChange}
              prefix={<img src={icons.search2.icon} />}
              className="search-input"
            />
            <Separator horizontal={5} />
            <Button type="primary" className="search-btn" onClick={onFindRequestByNumber}>
              {t(SEARCH)}
            </Button>
          </Row>
        </Col>
      </Row>
      <Separator vertical={10} />
      {isFilterClicked ? (
        <>
          {sentRequests.isLoading ? (
            <Loader
              color="#464674"
              size={50}
              css={`
                display: block;
                margin: 0 auto;
              `}
            />
          ) : sentRequests.isEmpty ? (
            <EmptyState
              title={t(THERE_ARE_NO_DATA)}
              image={icons.empty_state}
              actionElement={<div>{t(BACK)}</div>}
              actionFunction={() => {
                setFindRequestNumberInput('');
                setIsFilterClicked(false);
              }}
            />
          ) : (
            sentRequests.sentRequests.map((item) => (
              <ServiceInquiryCard reloadList={reload} key={item.id} serviceInquiry={item} />
            ))
          )}
        </>
      ) : (
        <>
          {categorizedList.isLoading ? (
            <Loader
              color="#464674"
              size={50}
              css={`
                display: block;
                margin: 0 auto;
              `}
            />
          ) : categorizedList.isEmpty ? (
            <p className="empty-list">{t(THERE_ARE_NO_DATA)}</p>
          ) : (
            <div className="categories-container">
              {categorizedList.newInquires.count > 0 && (
                <div className="new">
                  <p className="category-title"> {t(NEW_REQUESTS)}</p>
                  {categorizedList.newInquires.data.map((item) => (
                    <ServiceInquiryCard reloadList={reload} key={item.id} serviceInquiry={item} />
                  ))}

                  {categorizedList.isLoadMoreNewInquires && categorizedList.newInquires.count > 3 && (
                    <button
                      onClick={() => {
                        categorizedList.handleLoadMoreByCategory(ServiceInquirySection.NEW);
                      }}
                      className="collapse-btn"
                    >
                      {t(MORE)}
                    </button>
                  )}
                </div>
              )}
              {categorizedList.inProgressInquires.count > 0 && (
                <div className="inProgress">
                  <p className="category-title"> {t(INPROGRESS_REQUESTS)} </p>
                  {categorizedList.inProgressInquires.data.map((item) => (
                    <ServiceInquiryCard reloadList={reload} key={item.id} serviceInquiry={item} />
                  ))}

                  {categorizedList.isLoadMoreInProgressInquires && categorizedList.inProgressInquires.count > 3 && (
                    <button
                      onClick={() => {
                        categorizedList.handleLoadMoreByCategory(ServiceInquirySection.IN_PROGRESS);
                      }}
                      className="collapse-btn"
                    >
                      {t(MORE)}
                    </button>
                  )}
                </div>
              )}
              <button onClick={HandleToggleClosedSection} className="collapse-btn">
                <span>{showClosedSection ? t(DISAPPEAR) : t(SHOW_CLOSED_COMPLETED_REQUESTS)}</span>
                <img src={showClosedSection ? icons.arrowUp.icon : icons.arrowDown.icon} />
              </button>
              {categorizedList.completedInquires.count > 0 && showClosedSection && (
                <div className="completed">
                  <p className="category-title">{t(COMPLETED_CANCELED_REQUESTS)}</p>
                  {categorizedList.completedInquires.data.map((item) => (
                    <ServiceInquiryCard reloadList={reload} key={item.id} serviceInquiry={item} />
                  ))}
                  {categorizedList.isLoadMoreCompletedInquires && categorizedList.completedInquires.count > 3 && (
                    <button
                      onClick={() => {
                        categorizedList.handleLoadMoreByCategory(ServiceInquirySection.COMPLETED);
                      }}
                      className="collapse-btn"
                    >
                      {t(MORE)}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
      <ReviewServiceModal
        isModalVisible={table.isReviewModalVisible}
        setIsModalVisible={table.setIsReviewModalVisible}
        serviceInquiry={table.selectedInquiry}
      />
    </section>
  ) : (
    <ServiceRequestDetails serviceRequestId={selectedRequestId} isProfessional={isProfessional} reloadList={reload} />
  );
};
