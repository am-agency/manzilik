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
  TYPE,
  REQUEST_SERVICE,
  THE_TYPE,
  QUOTATION_REQUEST,
  YOUR_REVIEW,
  REVIEW_SERVICE,
  NO_REVIEWS,
} from '../../../../../locales/strings';
import { ServiceInquiryStatus } from '../../../../professionals/request_professional_service/types';
import { DateFormat } from '../../../../../components/date_format';
import MessageIcon from '../../../../../icons/message_icon';
import StartChatButton from '../../../../../components/custom_button';
import { useFeatures } from 'flagged';
import { REQUEST_FOR_QUOTATION, SERVICE_CHAT } from '../../../../../app/settings';
import { useLocation, useParams } from 'react-router-dom';
import { ServiceInquiry } from '../../../../../API';
import icons from '../../../../../assets/icons';
import { Rate } from 'antd';

export const useServiceRequestTable = () => {
  const original = useRef<ServiceInquiry[]>();
  const [data, setData] = useState<ServiceInquiry[]>([]);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ServiceInquiry>({} as ServiceInquiry);
  const { t } = useTranslation();
  const createColumn = useCallback(
    (title_key: string, render: (item: ServiceInquiry) => ReactNode) => {
      return { title: t(title_key), render: (_: unknown, item: ServiceInquiry) => render(item) };
    },
    [t]
  );
  const location = useLocation();
  const { search } = location;
  const isGigService = search.includes('isGigService');
  const features = useFeatures();
  const chatButtonDisabledStatus = [
    ServiceInquiryStatus.COMPLETED,
    ServiceInquiryStatus.CANCELLED,
    ServiceInquiryStatus.REJECTED,
    ServiceInquiryStatus.OPENED,
  ];

  const renderReview = (item: ServiceInquiry) => {
    const isAlreadyReviewed = item?.reviews_count! > 0 && item?.status === ServiceInquiryStatus.COMPLETED;
    return isAlreadyReviewed ? (
      <div
        className="review-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img src={icons.edit1} alt="edit" />
        <div className="rate">
          <Rate disabled defaultValue={item?.reviews_total!} />
        </div>
      </div>
    ) : item?.status !== ServiceInquiryStatus.COMPLETED ? (
      <div className="review-container">
        <img src={icons.edit1} alt="edit" />
        <span className="review-text">{t(NO_REVIEWS)}</span>
      </div>
    ) : (
      <div
        className="review-container"
        onClick={(e) => {
          e.stopPropagation();
          setIsReviewModalVisible(true);
          setSelectedInquiry(item);
        }}
      >
        <img src={icons.edit1} alt="edit" />
        <span className="review-text">{t(REVIEW_SERVICE)}</span>
      </div>
    );
  };

  const columns: ColumnsType<ServiceInquiry> = useMemo(() => {
    return [
      createColumn(REQUEST_NUMBER, (item) => item.number),
      createColumn(THE_TYPE, (item) => (item.type === 'RFQ' ? t(QUOTATION_REQUEST) : t(REQUEST_SERVICE))),
      createColumn(REQUEST_STATUS, (item) => (
        <span className={item?.status!.toLocaleLowerCase()}>{t((item.status as unknown as string) + '_REQUEST')}</span>
      )),
      createColumn(HOMEOWNER, (item) => item.sender?.first_name),
      createColumn(SERVICE_TYPE, (item) => item?.services!.results.map((result) => result?.title).join(', ')),
      createColumn(YOUR_REVIEW, (item) => {
        return renderReview(item);
      }),
    ];
  }, [t]);

  const detailsColumns: ColumnsType<ServiceInquiry> = useMemo(() => {
    return [
      createColumn(REQUEST_NUMBER, (item) => item.number),
      createColumn(REQUEST_STATUS, (item) => (
        <span className={item.status!.toLocaleLowerCase()}>{t((item.status as unknown as string) + '_REQUEST')}</span>
      )),
      createColumn(HOMEOWNER, (item) => item.sender?.first_name),
      createColumn(SERVICE_TYPE, (item) => item.services!.results.map((result) => result?.title).join(', ')),
      createColumn(
        isGigService ? SERVICE_PRICE : BUDGET,
        (item) => `${isGigService ? item.gig_service_price : item?.budget_limits} ${t(SAR)}`
      ),
      createColumn(YOUR_REVIEW, (item) => {
        return renderReview(item);
      }),
    ];
  }, [t]);
  const [renderedColumns, setRenderedColumns] = useState<ColumnsType<ServiceInquiry>>(columns);
  const [renderedDetailsColumns, setRenderedDetailsColumns] = useState<ColumnsType<ServiceInquiry>>(columns);

  useEffect(() => {
    if (features[SERVICE_CHAT]) {
      setRenderedColumns([
        ...columns,
        createColumn(CONTACT_US, (item) => {
          const isDisabled = chatButtonDisabledStatus.includes(item.status! as ServiceInquiryStatus);
          return <StartChatButton isDisabled={isDisabled} icon={<MessageIcon color="#464774" />} item={item} />;
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
      setData(original.current.filter((item) => item.status === status));
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
    data,
    setData: (data: ServiceInquiry[]) => {
      original.current = data;
      setData(data);
    },
    filterByStatus,
    clearFilters,
    findRequestByNumber,
    isReviewModalVisible,
    setIsReviewModalVisible,
    selectedInquiry,
    setSelectedInquiry,
  };
};
