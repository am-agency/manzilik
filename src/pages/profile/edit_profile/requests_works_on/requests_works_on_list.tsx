/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Input, Radio, RadioChangeEvent, Row, Select, Space, Table, Typography } from 'antd';
import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination, ServiceInquiry, ServiceInquiryStatus } from '../../../../API';
import {
  ADD_PROJECTS_AND_SERVICES_TO_IMPROVE_YOUR_CHANCE,
  ALL,
  FIND_REQUEST_BY_NUMBER,
  RECIEVED_REQUESTS,
  REQUEST_STATUS,
  SEARCH,
  QUOTATIONS_REQUESTS,
  SERVICE_REQUESTS,
  THERE_ARE_NO_DATA,
} from '../../../../locales/strings';
import EmptyIcon from '../../../../assets/images/Empty.svg';
import Separator from '../../../../components/separator';
import { useRecievedServieRequestsList } from './hooks/useRecievedServieRequestsList';
import { useHistory, useParams } from 'react-router-dom';
import { PROFESSIONAL_REQUESTS_WORKS_ON, PROFESSIONAL_SERVICE_REQUESTS_LIST_ROUTE } from '../../../../utils/routes';
import { RequestDetails } from './request_details';
import { useServiceRequestTable } from './hooks/useServiceRequestTable';
import icons from '../../../../assets/icons';
import { useProfessional } from '../../../professionals/hooks/useProfessional';

import { useMediaQuery } from 'react-responsive';
import ServiceRequestCardDetails from '../components/service_request_card_details';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import { useQuotationRequestsTable } from './hooks/useQuotationRequestsTable';
import { useQuotationRequestsList } from './hooks/useQuotationRequestsList';

const FIRST_PAGE: Pagination = {
  offset: 0,
  limit: 12,
};

enum ActiveTabId {
  QUOTATIONS_REQUESTS,
  RECIEVED_REQUESTS,
}

interface Params {
  subId?: string;
}

export const RequestsWorksOnList = () => {
  const { t } = useTranslation();
  const quotationRequests = useQuotationRequestsList();
  const recievedRequests = useRecievedServieRequestsList();
  const history = useHistory();
  const params = useParams<Params>();
  const [selectedRequestId, setSelectedRequestId] = useState<string>();
  const table = useServiceRequestTable();
  const quotationsTable = useQuotationRequestsTable();
  const [filterStatus, setFilterStatus] = useState(ALL);
  const [findRequestNumberInput, setFindRequestNumberInput] = useState('');
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const professional = useProfessional();
  const isProfessional = useMemo(() => professional.isProfessional(client), [client, professional]);
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });

  const [activeTab, setActiveTab] = useState(
    isProfessional ? ActiveTabId.QUOTATIONS_REQUESTS : ActiveTabId.RECIEVED_REQUESTS
  );

  const isQuotationRequest = activeTab === ActiveTabId.QUOTATIONS_REQUESTS;
  const tableList = isQuotationRequest ? quotationsTable : table;
  const [quotationsPagination, setQuotationsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: quotationRequests.quotationsListCount,
  });
  const [receivedRequestsPagination, setReceivedRequestsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: recievedRequests.receivedRequestsCount,
  });

  useEffect(() => {
    setActiveTab(isProfessional ? ActiveTabId.QUOTATIONS_REQUESTS : ActiveTabId.RECIEVED_REQUESTS);
  }, [isProfessional, client]);

  const handleQuotationTableChange = (newPagination: any) => {
    quotationRequests.loadQuotationRequestsList({
      offset: (newPagination.current - 1) * newPagination.pageSize,
      limit: newPagination.pageSize,
    });
    if (isQuotationRequest) {
      setQuotationsPagination({
        ...quotationsPagination,
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      });
    } else {
      setReceivedRequestsPagination({
        ...receivedRequestsPagination,
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      });
    }
  };

  const reload = useCallback(() => {
    switch (activeTab) {
      case ActiveTabId.RECIEVED_REQUESTS:
        recievedRequests.loadRecievedRequestsList({
          offset: (receivedRequestsPagination.current - 1) * receivedRequestsPagination.pageSize,
          limit: receivedRequestsPagination.pageSize,
        });
        break;
      case ActiveTabId.QUOTATIONS_REQUESTS:
        quotationRequests.loadQuotationRequestsList({
          offset: (quotationsPagination.current - 1) * quotationsPagination.pageSize,
          limit: quotationsPagination.pageSize,
        });
        break;
    }
  }, [activeTab]);

  useEffect(() => {
    if (isQuotationRequest) {
      setQuotationsPagination({
        current: quotationsPagination.current,
        pageSize: 10,
        total: quotationRequests.quotationsListCount,
      });
    } else {
      setReceivedRequestsPagination({
        current: receivedRequestsPagination.current,
        pageSize: 10,
        total: recievedRequests.receivedRequestsCount,
      });
    }
  }, [quotationRequests.quotationsListCount, recievedRequests.receivedRequestsCount]);

  useEffect(() => {
    reload();
  }, [activeTab]);

  useEffect(() => {
    switch (activeTab) {
      case ActiveTabId.RECIEVED_REQUESTS:
        table.setData(recievedRequests.recievedRequests);
        break;
      case ActiveTabId.QUOTATIONS_REQUESTS:
        quotationsTable.setData(quotationRequests.quotationsList);
        break;
    }
  }, [quotationRequests.quotationsList, recievedRequests.recievedRequests]);

  const onChangeTab = (event: RadioChangeEvent) => {
    setActiveTab(event.target.value);
  };

  const isLoading = useMemo(() => {
    switch (activeTab) {
      case ActiveTabId.RECIEVED_REQUESTS:
        return recievedRequests.isLoading;
      case ActiveTabId.QUOTATIONS_REQUESTS:
        return quotationRequests.isLoading;
    }
  }, [recievedRequests.isLoading, quotationRequests.isLoading, activeTab]);

  const showItemDetails = (item: ServiceInquiry) => {
    history.push(`${PROFESSIONAL_REQUESTS_WORKS_ON}/${item.id}`);
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
      ServiceInquiryStatus.DELETED,
      ServiceInquiryStatus.COMPLETED,
      ServiceInquiryStatus.CONTRACTED,
      ServiceInquiryStatus.CANCELLED,
      ServiceInquiryStatus.OPENED,
      ServiceInquiryStatus.DRAFT,
      ServiceInquiryStatus.CLOSED,
    ];
  }, []);

  const onSelectStatus = (status: string) => {
    setFilterStatus(status);
    if (status === ALL) {
      isQuotationRequest ? quotationsTable.clearFilters() : table.clearFilters();
    } else {
      isQuotationRequest
        ? quotationsTable.filterByStatus(status as ServiceInquiryStatus)
        : table.filterByStatus(status as ServiceInquiryStatus);
    }
  };

  const onFindRequestChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setFindRequestNumberInput(value);
    if (value === '') {
      isQuotationRequest ? quotationsTable.clearFilters() : table.clearFilters();
    }
  };

  const onFindRequestByNumber = () => {
    isQuotationRequest
      ? quotationsTable.findRequestByNumber(findRequestNumberInput)
      : table.findRequestByNumber(findRequestNumberInput);
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
                <Radio.Button value={ActiveTabId.QUOTATIONS_REQUESTS}>{t(QUOTATIONS_REQUESTS)}</Radio.Button>
                <Radio.Button value={ActiveTabId.RECIEVED_REQUESTS}>{t(RECIEVED_REQUESTS)}</Radio.Button>
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
              prefix={<img src={icons.search.icon} />}
            />
            <Separator horizontal={5} />
            <Button type="primary" className="search-btn-works-on" onClick={onFindRequestByNumber}>
              {t(SEARCH)}
            </Button>
          </Row>
        </Col>
      </Row>
      <Separator vertical={10} />
      {isMobileView ? (
        tableList.data.length > 0 ? (
          tableList.data.map((item) => <ServiceRequestCardDetails isRequestsWorksOn key={item?.id!} item={item!} />)
        ) : (
          <p className="empty-list">{t(THERE_ARE_NO_DATA)}</p>
        )
      ) : (
        <Table
          className="data-table select-row"
          onRow={(row) => ({
            onClick: () => showItemDetails(row),
          })}
          columns={tableList?.columns! as any}
          dataSource={tableList?.data! as any}
          loading={isLoading}
          pagination={isQuotationRequest ? quotationsPagination : receivedRequestsPagination}
          onChange={handleQuotationTableChange}
          locale={{
            emptyText: (
              <Space direction="vertical">
                <Separator vertical={30} />
                <img src={EmptyIcon} />
                <Separator vertical={10} />
                <Typography.Text strong>{t(THERE_ARE_NO_DATA)}</Typography.Text>
                <Typography.Paragraph>{t(ADD_PROJECTS_AND_SERVICES_TO_IMPROVE_YOUR_CHANCE)}</Typography.Paragraph>
                <Separator vertical={30} />
              </Space>
            ),
          }}
        />
      )}
    </section>
  ) : (
    <RequestDetails
      serviceRequestId={selectedRequestId}
      isProfessional={isProfessional}
      reloadList={reload}
      activeTab={activeTab}
      isQuotationRequest={isQuotationRequest}
    />
  );
};
