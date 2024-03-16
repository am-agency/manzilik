import { Row, Col, Divider, Spin } from 'antd';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { LoadingOutlined } from '@ant-design/icons';
import { LOADING, THERE_ARE_NO_DATA } from '../../../../locales/strings';
import { Discussion, DiscussionCard } from '../discussion_card';
import { listLimit as limit } from '../../../../app/settings';
import { useHistory } from 'react-router-dom';
import BannerContainer from '../../../../components/banner_container';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import Loader from 'react-spinners/ClipLoader';
import { BannerSlug } from '../../../../constants';
import BannerCard from '../../../../components/banner_card';

interface ListProps {
  offset: number;
  onNext: () => void;
  hasMore: boolean;
  loading: boolean;
  discussionsList: (Discussion | null)[];
}

const antIcon = <LoadingOutlined style={{ fontSize: 16, marginLeft: 10 }} spin />;

export const DiscussionList: FunctionComponent<ListProps> = (props: ListProps) => {
  const { offset, onNext, hasMore, discussionsList } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { banner, isBannerLoading, setBannerSlug } = useContext(SharedStateContext) as SharedStateInterface;

  useEffect(() => {
    setBannerSlug!(BannerSlug.MAGAZINE_BANNER);
  }, []);

  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={offset / limit}
      loadMore={onNext}
      hasMore={hasMore}
      useWindow={true}
      loader={
        <Row justify="center" align="middle" key={'loader'}>
          {props.loading && (
            <>
              {t(LOADING)}
              <Spin indicator={antIcon} />
            </>
          )}
        </Row>
      }
    >
      <Row justify="center" align="middle" className="discussions-list">
        {discussionsList?.map((discussion: Discussion | null, index) => (
          <Col span={24} key={discussion?.id}>
            <DiscussionCard discussion={discussion} />
            <Divider />
            {
              // add an ad div after index 2
              index === 2 && (
                <>
                  {isBannerLoading ? (
                    <div className="loader-banner">
                      <Loader />
                    </div>
                  ) : (
                    <BannerContainer>
                      <BannerCard banner={banner} isDynamicContent />
                    </BannerContainer>
                  )}
                </>
              )
            }
          </Col>
        ))}

        {!props.loading && discussionsList.length === 0 && <div>{t(THERE_ARE_NO_DATA)}</div>}
      </Row>
    </InfiniteScroll>
  );
};
