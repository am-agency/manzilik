import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { TOP_COMMENTERS, TODAY, WEEK, MONTH } from '../../../../locales/strings';
import { getTopCommenters } from '../../api';
import { DateTypeFilters } from '../../constants';
import { CommentersList } from '../commenters_list';
import CommentersListNav from '../commenter_list_nav_bar';
export const listMaxLength = 5;

const TabPane = Tabs.TabPane;

export interface ClientWithIndex extends Client {
  index: number;
}

export const SideBoxBottom = () => {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const [commentersList, setCommenterList] = useState<(Client | null)[]>([]);
  const [currentPageList, setCurrentPageList] = useState<(ClientWithIndex | null)[]>([]);
  const [commentersCount, setCommentersCount] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState<string>();

  const getCommentersList = (refresh: boolean = true, date_type: string = DateTypeFilters.DAY) => {
    let currentOffset = listMaxLength * page;
    let pagination = { offset: currentOffset, limit: listMaxLength, date_type };
    let currentCommenters = commentersList;

    if (refresh) {
      currentOffset = 0;
      currentCommenters = [];
      pagination = { offset: currentOffset, limit: listMaxLength, date_type };
    }

    requestApi(
      getTopCommenters,
      { input: { offset: currentOffset, limit: listMaxLength, date_type } },
      (response: { commenters: Client[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        const { commenters, count } = response;
        setCommentersCount(count);
        currentCommenters = [...currentCommenters!, ...commenters!];
        setCommenterList(currentCommenters);
        setCurrentPageList(
          currentCommenters.slice(currentOffset, currentOffset + listMaxLength).map((client: Client | null, index) => {
            return {
              __typename: 'Client',
              id: client?.id!,
              ...(client || {}),
              index: currentOffset + index + 1,
            };
          })
        );
      }
    );
  };

  useEffect(() => {
    getCommentersList();
  }, []);

  useEffect(() => {
    if (page === 0) {
      getCommentersList(true, tab);
    } else {
      getCommentersList(false, tab);
    }
  }, [page, tab]);

  return (
    <div className="side-box-bottom">
      <p className="section-title">{t(TOP_COMMENTERS)}</p>
      <Tabs
        onTabClick={(tab) => {
          setTab(tab);
          setPage(0);
        }}
      >
        <TabPane tab={<span>{t(TODAY)}</span>} key={DateTypeFilters.DAY}>
          <CommentersList commentersList={currentPageList} />
        </TabPane>
        <TabPane tab={<span>{t(WEEK)}</span>} key={DateTypeFilters.WEEK}>
          <CommentersList commentersList={currentPageList} />
        </TabPane>
        <TabPane tab={<span>{t(MONTH)}</span>} key={DateTypeFilters.MONTH}>
          <CommentersList commentersList={currentPageList} />
        </TabPane>
      </Tabs>
      {commentersCount / listMaxLength > 1 && (
        <CommentersListNav
          currentPage={page}
          numberOfPages={Math.ceil(commentersCount / listMaxLength)}
          setCurrentPage={(page: number) => {
            setPage(page);
          }}
        />
      )}
    </div>
  );
};
