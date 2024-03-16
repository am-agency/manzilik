import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { LoadingOutlined } from '@ant-design/icons';
import { LOADING, THERE_ARE_NO_DATA } from '../../../../locales/strings';
import { listLimit as limit } from '../../../../app/settings';
import ProfRfqCard from '../prof_rfq_card';
import { ServiceInquiry } from '../../../../API';
import { RfqContext, RfqProps } from '../../requests_for_quotations_context';
import { useMainContext } from '../../../../app/providers/main';
import { useFetchRfqList } from './useFetchRfqList';

const antIcon = <LoadingOutlined style={{ fontSize: 16, marginLeft: 10 }} spin />;

export const RfqList = () => {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const { profSelectedCitiesFilter, profSelectedServicesFilter } = useContext(RfqContext) as RfqProps;
  const [listOfRfq, setListOfRfq] = useState<ServiceInquiry[]>([]);
  const [isListRfqLoading, setIsListRfqLoading] = useState(false);
  const [isRfqListHasMore, setIsRfqListHasMore] = useState(true);
  const [listOfRfqOffset, setListOfRfqOffset] = useState(0);

  // Custom hook for fetching RFQ list
  const { fetchRfqList } = useFetchRfqList(requestApi);

  const getListRFQServices = async (refresh = false) => {
    setIsListRfqLoading(true);

    const newOffset = refresh ? 0 : listOfRfqOffset;
    const response = await fetchRfqList({
      offset: newOffset,
      selectedServicesFilter: profSelectedServicesFilter,
      selectedCitiesFilter: profSelectedCitiesFilter,
    });

    setIsListRfqLoading(false);
    if (!response) {
      return;
    }

    if (refresh) {
      setListOfRfq(response);
    } else {
      setListOfRfq([...listOfRfq, ...response]);
    }

    setListOfRfqOffset(newOffset + limit);
    setIsRfqListHasMore(response.length === limit);
  };

  useEffect(() => {
    getListRFQServices(true);
  }, [profSelectedServicesFilter, profSelectedCitiesFilter]);

  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={listOfRfqOffset / limit}
      loadMore={() => getListRFQServices(false)}
      hasMore={isRfqListHasMore && !isListRfqLoading}
      useWindow={true}
      loader={
        <Row justify="center" align="middle" key="loader">
          <Spin indicator={antIcon} />
        </Row>
      }
    >
      <Row justify="center" align="middle" className="rfq-list">
        {listOfRfq.map((service) => (
          <Col span={24} key={service.id}>
            <ProfRfqCard item={service} />
          </Col>
        ))}
        {!isListRfqLoading && listOfRfq.length === 0 && <div>{t(THERE_ARE_NO_DATA)}</div>}
      </Row>
    </InfiniteScroll>
  );
};
