import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMainContext } from '../../../../app/providers/main';
import { getListMyAIDesigns, getListPublishedAIDesigns, getListPublishedAIDesignsAuth, getAIStyles } from '../../api';
import { AIDesignObject, AIDesignObjectList, AIDesignStyleList, listPublishedDesignsResponse } from '../../types';
import { useTranslation } from 'react-i18next';
import FilterCarousel from '../filter_carousel';
import { ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';
import BeforeAfter from '../before_after';
import Loader from 'react-spinners/ClipLoader';
import InfiniteScroll from 'react-infinite-scroller';
import { Skeleton } from 'antd';
import { toArrayOrEmpty } from '../../../idea/utils';
import AiEmptyState from '../ai_empty_state';
import AICard from '../../../../components/banner_card';
import { useMediaQuery } from 'react-responsive';
import BannerCard from '../../../../components/banner_card';

interface DesignsListProps {
  handleOpenUploadDialog: () => void;
}

const DesignsList = (props: DesignsListProps) => {
  const { handleOpenUploadDialog } = props;
  const listLimit = 10;
  const { requestApi, userState } = useMainContext();
  const { i18n } = useTranslation();
  const [designsList, setDesignsList] = useState<AIDesignObject[]>([]);
  const [isDesignsListLoading, setIsDesignsListLoading] = useState<boolean>(false);
  const { selectedStyleFilter, listStyles, setCurrentMobileView } = useContext(ManzilikAiContext) as ManzilikAiProps;
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState<number>(0);
  const ref = useRef();
  const isTabletView = useMediaQuery({ query: '(max-width: 768px)' });
  const { isAuthenticated } = userState;

  const getAIDesigns = (limit: number = 10, offset: number = 0, style: string = '', refresh: boolean = false) => {
    setIsDesignsListLoading(true);
    let prevTopicsList = designsList;
    let currentOffset = offset;
    if (refresh) {
      prevTopicsList = [];
      currentOffset = 0;
    }
    requestApi(
      isAuthenticated ? getListPublishedAIDesignsAuth : getListPublishedAIDesigns,
      {
        input: {
          offset,
          limit,
        },
        styleSlug: style,
      },
      (response: listPublishedDesignsResponse, error: string) => {
        if (error) {
          return;
        }
        const { results } = response.data.listPublishedAIDesigns;
        const newTopicsList = toArrayOrEmpty(prevTopicsList).concat(toArrayOrEmpty(results));
        setDesignsList(newTopicsList);
        setOffset(offset);
        setIsDesignsListLoading(false);

        if (results.length < listLimit) {
          setHasMore(false);
          return;
        }
      }
    );
  };

  useEffect(() => {
    getAIDesigns(listLimit, offset, selectedStyleFilter, true);
  }, [i18n.language, selectedStyleFilter]);

  const onNext = () => {
    !isDesignsListLoading && getAIDesigns(listLimit, offset + listLimit, selectedStyleFilter);
  };

  return (
    <>
      <div className="style-filter">
        <FilterCarousel
          tabs={[
            {
              id: 'all',
              name: i18n.language === 'en' ? 'All' : 'الكل',
              slug: '',
              image: '',
            },
            ...listStyles!,
          ]}
          onFilterClick={() => {
            setOffset(0);
          }}
        />
      </div>

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
            {designsList.map((design) => (
              <BeforeAfter key={design.id} item={design} />
            ))}
          </InfiniteScroll>
          {!isDesignsListLoading && designsList.length === 0 && (
            <AiEmptyState handleOpenUploadDialog={handleOpenUploadDialog} />
          )}
        </div>
      </div>
    </>
  );
};

export default DesignsList;
