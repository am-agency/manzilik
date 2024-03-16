import React, { ComponentType, FunctionComponent, useEffect, useRef, useState } from 'react';
import { useMainContext } from '../providers/main';
import InfiniteScroll from 'react-infinite-scroller';
import { Row, Skeleton } from 'antd';
import { LOADING } from '../../locales/strings';
import { useTranslation } from 'react-i18next';
import { PaginationWithAuth } from '../../pages/home/types';

export interface WithPaginationProps<ElementType> {
  total?: number;
  list?: ElementType[];
  onLoadMore?: () => void;
  loading?: boolean;
  refresh?: () => void;
  hasMore?: boolean;
  paginationProps?: PaginationWithAuth;
  isForceRefresh?: boolean;
  hasLanguageChangedContent?: boolean;
  useWindow?: boolean;
  isForceModalFetch?: boolean;
  [key: string]: unknown;
  uniqueRef?: string;
  queryParams?: { [key: string]: string | undefined };
  inputQueryParams?: { [key: string]: string | undefined };
  injectInput?: boolean;
}
interface WithPaginationControlProps {
  executionCount?: number;
  dataListKey?: string;
  //@TODO : make a nother group of props for these
  type?: string;
  showIcon?: boolean;
}
export function withPagination<ElementType, WrappedComponentProps = {}>(
  fetchFunction: Function,
  WrappedComponent: FunctionComponent<Partial<WithPaginationProps<ElementType>> | Partial<WrappedComponentProps>>,
  manualLoad?: boolean,
  loadingIdentifier?: string,
  controlProps?: WithPaginationControlProps
): ComponentType<WithPaginationProps<ElementType> | WrappedComponentProps> {
  /**
   * @param WrappedComponent: the child which must be rendered
   * @param fetchFunction: the api function which will return the list of items
   * @param manualLoad: variable to check if loading depends on scrolling or on user click action
   **/

  const ScrollComponent: FunctionComponent<WithPaginationProps<ElementType>> = (
    props: WithPaginationProps<ElementType>
  ) => {
    const {
      paginationProps = {},
      isForceRefresh,
      hasLanguageChangedContent = false,
      useWindow = true,
      isForceModalFetch,
      queryParams,
      inputQueryParams,
      injectInput = true,
      uniqueRef = 'all',
      ...componentProps
    } = props;
    const { requestApi } = useMainContext();
    const [list, setList] = useState<ElementType[]>([]);
    const [count, setCount] = useState<number>(0);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [executionCountState, setExecutionCountState] = useState<number>(0);
    const { resourceId, date_type, tab } = paginationProps;
    const { t, i18n } = useTranslation();
    const ref = useRef();
    const previousUniqueRef = useRef('all');

    const limit = 10;

    const fetchListOfElement = (refresh: boolean = false) => {
      setLoading(true);
      if (fetchFunction) {
        let currentOffset = offset;
        let prevList = list;
        if (refresh) {
          currentOffset = 0;
          prevList = [];
        }
        const inputToBeInjected = injectInput
          ? {
              input: {
                offset: currentOffset,
                limit,
                ...(inputQueryParams ? inputQueryParams : {}),
                ...paginationProps,
              },
            }
          : {};

        const pagination = queryParams
          ? {
              ...queryParams,
              ...inputToBeInjected,
            }
          : { offset: currentOffset, limit, ...paginationProps };

        requestApi(
          fetchFunction,
          pagination,
          (list: { results: ElementType[] | ElementType; count: number }, error: string) => {
            if (error) {
              return;
            }

            setLoading(false);
            const { results, count } = list;
            //i had to disable it , i have two types of parameters that have no overlap
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformResults = (results: any, key?: string) => {
              if (key && Array.isArray(results[key])) {
                return results[key] as unknown as ElementType[];
              }
              if (Array.isArray(results)) {
                return results as unknown as ElementType[];
              }
              return [];
            };

            //if there is a dataListKey set in control props , then we take them from there
            const newList = [
              //incase we're gonna reset we dont want the prev list
              ...prevList!,
              //if we're gonna have an object we better find that dataListKey
              ...transformResults(results, controlProps?.dataListKey)!,
            ];
            if (newList?.length == count) {
              setHasMore(false);
            } else {
              setHasMore(true);
            }

            setList(newList);
            setOffset(currentOffset + limit);
            setCount(count!);
            setExecutionCountState(executionCountState + 1);
          },
          loadingIdentifier
        );
      }
    };

    const onLoadMore = () => {
      if ((!loading && hasMore) || previousUniqueRef.current !== uniqueRef) {
        if (!!controlProps?.executionCount && controlProps?.executionCount <= executionCountState) {
          return;
        } else {
          fetchListOfElement(previousUniqueRef.current !== uniqueRef);
        }
      }
    };

    const refresh = () => {
      fetchListOfElement(true);
    };

    // Todo: check if this is needed. since it recalls the endpoint (Abdoulrhman Salah 2023-07-30)
    // useEffect(() => {
    //   onLoadMore();
    // }, [resourceId, tab, date_type, i18n.language, isForceModalFetch, uniqueRef]);

    useEffect(() => {
      fetchListOfElement(true);
    }, [isForceRefresh]);

    useEffect(() => {
      previousUniqueRef.current = uniqueRef;
    }, [uniqueRef]);

    if (manualLoad) {
      return (
        <WrappedComponent
          total={count}
          list={list}
          onLoadMore={onLoadMore}
          refresh={refresh}
          hasMore={hasMore}
          {...componentProps}
        />
      );
    }

    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={offset / limit}
        loadMore={onLoadMore}
        hasMore={hasMore}
        useWindow={useWindow}
        getScrollParent={ref.current}
        className="with-pagination"
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      >
        <WrappedComponent
          total={count}
          list={list}
          refresh={refresh}
          hasMore={hasMore}
          loading={loading}
          {...componentProps}
        />
      </InfiniteScroll>
    );
  };

  return ScrollComponent;
}
