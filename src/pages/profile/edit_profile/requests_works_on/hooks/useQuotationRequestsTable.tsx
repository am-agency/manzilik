/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SERVICE_TYPE,
  HOMEOWNER,
  PHONE_NUMBER,
  ISSUE_DATE,
  REQUEST_STATUS,
  REQUEST_NUMBER,
  CONTACT_US,
  SERVICE_PRICE,
  SAR,
  BUDGET,
  THE_TYPE,
  QUOTATION_REQUEST,
  REQUEST_SERVICE,
  SERVICE_PROVIDER,
} from '../../../../../locales/strings';
import { DateFormat } from '../../../../../components/date_format';
import MessageIcon from '../../../../../icons/message_icon';
import StartChatButton from '../../../../../components/custom_button';
import { useFeatures } from 'flagged';
import { REQUEST_FOR_QUOTATION, SERVICE_CHAT } from '../../../../../app/settings';
import { useLocation, useParams } from 'react-router-dom';
import { Quotation, ServiceInquiry, ServiceInquiryStatus } from '../../../../../API';
import { Tooltip } from 'antd';
import { textSubstring } from '../../../../../utils';

export const useQuotationRequestsTable = () => {
  const original = useRef<Quotation[]>();
  const [data, setData] = useState<Quotation[]>([]);
  const { t } = useTranslation();
  const createColumn = useCallback(
    (title_key: string, render: (item: any) => ReactNode) => {
      return { title: t(title_key), render: (_: unknown, item: Quotation) => render(item) };
    },
    [t]
  );
  const location = useLocation();
  const { search } = location;
  const isGigService = search.includes('isGigService');
  const chatButtonDisabledStatus = [
    ServiceInquiryStatus.COMPLETED,
    ServiceInquiryStatus.CANCELLED,
    ServiceInquiryStatus.REJECTED,
    ServiceInquiryStatus.OPENED,
  ];

  const features = useFeatures();

  const columns: ColumnsType<any> = useMemo(() => {
    return [
      createColumn(REQUEST_NUMBER, (item) => item?.number),
      createColumn(THE_TYPE, (item) => (item.type === 'RFQ' ? t(QUOTATION_REQUEST) : t(REQUEST_SERVICE))),
      createColumn(REQUEST_STATUS, (item) => (
        <span className={item?.status!.toLocaleLowerCase()}>{t((item.status as unknown as string) + '_REQUEST')}</span>
      )),
      createColumn(SERVICE_TYPE, (item) => (
        <Tooltip title={item?.services!.results.map((result: any) => result?.title).join(', ')}>
          {textSubstring(item?.services!.results.map((result: any) => result?.title).join(', '), 20)}
        </Tooltip>
      )),
      createColumn(SERVICE_PROVIDER, (item) => item?.sender?.first_name),
      createColumn(BUDGET, (item) => `${item?.budget_limits} ${t(SAR)}`),
    ];
  }, [t]);

  const detailsColumns: ColumnsType<any> = useMemo(() => {
    return [
      createColumn(REQUEST_NUMBER, (item) => item?.number),
      createColumn(THE_TYPE, (item) => (item.type === 'RFQ' ? t(QUOTATION_REQUEST) : t(REQUEST_SERVICE))),
      createColumn(REQUEST_STATUS, (item) => (
        <span className={item?.status!.toLocaleLowerCase()}>{t((item.status as unknown as string) + '_REQUEST')}</span>
      )),
      createColumn(SERVICE_TYPE, (item) => (
        <Tooltip title={item?.services!.results.map((result: any) => result?.title).join(', ')}>
          {textSubstring(item?.services!.results.map((result: any) => result?.title).join(', '), 20)}
        </Tooltip>
      )),
      createColumn(SERVICE_PROVIDER, (item) => item?.sender?.first_name),
      createColumn(BUDGET, (item) => `${item?.budget_limits} ${t(SAR)}`),
    ];
  }, [t]);
  const [renderedColumns, setRenderedColumns] = useState<ColumnsType<any>>(columns);
  const [renderedDetailsColumns, setRenderedDetailsColumns] = useState<ColumnsType<any>>(columns);

  useEffect(() => {
    if (features[SERVICE_CHAT]) {
      setRenderedColumns([
        ...columns,
        createColumn(CONTACT_US, (item) => {
          const isDisabled = chatButtonDisabledStatus.includes(item.status! as ServiceInquiryStatus);
          return (
            <StartChatButton isDisabled={isDisabled} isCircular icon={<MessageIcon color="#464774" />} item={item} />
          );
        }),
      ]);
      setRenderedDetailsColumns([
        ...detailsColumns,
        createColumn(CONTACT_US, (item) => {
          const isDisabled = chatButtonDisabledStatus.includes(item.status! as ServiceInquiryStatus);
          return <StartChatButton isDisabled={isDisabled} icon={<MessageIcon color="#464774" />} item={item} />;
        }),
      ]);
    }
  }, [features.SERVICE_CHAT]);

  const filterByStatus = (status: ServiceInquiryStatus) => {
    if (original.current) {
      setData(original.current.filter((item) => item?.service_inquiry?.status === status));
    }
  };

  const clearFilters = () => {
    if (original.current) {
      setData(original.current);
    }
  };

  const findRequestByNumber = (id: string) => {
    if (original.current) {
      setData(original.current.filter((item) => item.id === id));
    }
  };

  return {
    columns: renderedColumns,
    detailsColumns: renderedDetailsColumns,
    data: data.map((item) => item.service_inquiry),
    setData: (data: Quotation[]) => {
      original.current = data;
      setData(data);
    },
    filterByStatus,
    clearFilters,
    findRequestByNumber,
  };
};
