import React, { useContext, useEffect, useRef, useState } from 'react';
import AiEmptyState from '../ai_empty_state';
import { getListMyAIDesigns } from '../../api';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../../app/providers/main';
import { AIDesignObject, AIDesignObjectList, listMyDesignsResponse } from '../../types';
import BeforeAfter from '../before_after';
import Loader from 'react-spinners/ClipLoader';
import InfiniteScroll from 'react-infinite-scroller';
import { Skeleton } from 'antd';
import { toArrayOrEmpty } from '../../../idea/utils';
import AICard from '../../../../components/banner_card';
import { ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';
import { useMediaQuery } from 'react-responsive';
import BannerCard from '../../../../components/banner_card';

interface MyDesignsProps {
  handleOpenUploadDialog: () => void;
}

function MyDesigns(props: MyDesignsProps) {
  const listLimit = 10;
  const { handleOpenUploadDialog } = props;
  const { i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const [listMyDesigns, setListMyDesigns] = useState<AIDesignObject[]>([]);
  const [isMyDesignsLoading, setIsMyDesignsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState<number>(0);
  const ref = useRef();
  const { setCurrentMobileView, isListMyDesignsRefresh, setIsListMyDesignsRefresh } = useContext(
    ManzilikAiContext
  ) as ManzilikAiProps;
  const isTabletView = useMediaQuery({ query: '(max-width: 768px)' });

  const getMyAIDesigns = (limit: number = 10, offset: number = 0, refresh: boolean = false) => {
    setIsMyDesignsLoading(true);
    let prevTopicsList = listMyDesigns;
    let currentOffset = offset;
    if (refresh) {
      prevTopicsList = [];
      currentOffset = 0;
    }
    requestApi(
      getListMyAIDesigns,
      {
        offset,
        limit,
      },
      (response: listMyDesignsResponse, error: string) => {
        if (error) {
          return;
        }
        const { results } = response.data.listMyAIDesigns;
        const newTopicsList = toArrayOrEmpty(prevTopicsList).concat(toArrayOrEmpty(results));
        setListMyDesigns(newTopicsList);
        setOffset(offset);
        setIsMyDesignsLoading(false);

        if (results.length < listLimit) {
          setHasMore(false);
          return;
        }
      }
    );
  };

  const onNext = () => {
    !isMyDesignsLoading && getMyAIDesigns(listLimit, offset + listLimit);
  };
  useEffect(() => {
    getMyAIDesigns(listLimit, offset, true);
    if (isListMyDesignsRefresh) {
      setIsListMyDesignsRefresh!(false);
    }
  }, [i18n.language, isListMyDesignsRefresh]);
  return (
    <div>
      <div className="content">
        <div className="designs-list" ref={(ref) => ref}>
          {isTabletView && (
            <BannerCard
              onCardClick={() => {
                setCurrentMobileView!('form');
              }}
            />
          )}
          <InfiniteScroll
            initialLoad={false}
            pageStart={offset / listLimit}
            loadMore={onNext}
            hasMore={hasMore}
            getScrollParent={ref.current}
            useWindow={false}
            loader={
              <div className="option-item-loader">
                <Skeleton.Image />
                <Skeleton.Image />
              </div>
            }
          >
            {listMyDesigns.map((design) => (
              <BeforeAfter key={design.id} item={design} showDesignDetails />
            ))}
          </InfiniteScroll>
          {!isMyDesignsLoading && listMyDesigns.length === 0 && (
            <AiEmptyState handleOpenUploadDialog={handleOpenUploadDialog} />
          )}
        </div>
      </div>
    </div>
  );
}

export default MyDesigns;
