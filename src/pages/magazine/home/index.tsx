import React, { useEffect, useState } from 'react';
import { useMainContext } from '../../../app/providers/main';
import { useTranslation } from 'react-i18next';
import { MagazineHeader } from './components/magazine_header';
import Separator from '../../../components/separator';
import { listMagazines } from '../api';
import { Magazine as MagazineFromApi } from '../../../API';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { HOME_PAGE_SEO_DESCRIPTION, MAGAZINE, MANZILIK, THERE_ARE_NO_DATA } from '../../../locales/strings';
import { staticMagazineTabs } from '../constants';
import { MAGAZINE_TAB, SMOOTH } from '../../../app/settings';
import { Category } from '../types';
import { EN } from '../../../locales/constants';
import { MetaTags } from '../../../components/meta_tags';
import { Container } from '../../../components/container';
import { Articles } from './articles';
import { listCategories } from '../../ideas/api';
import { getTab } from '../utils';
import { Skeleton } from 'antd';
import { MAGAZINES_ROUTE } from '../../../utils/routes';

const MagazineHome = () => {
  const [magazines, setArticlesList] = useState<MagazineFromApi[]>([]);
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const tabFromUrl = id && getTab(id)!?.toLowerCase();
  const updatedTab = staticMagazineTabs && staticMagazineTabs[tabFromUrl];
  const [tab, selectTab] = useState<Category>(updatedTab || staticMagazineTabs.latest);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategoriesList] = useState<Category[]>([]);
  const [count, setCount] = useState<number>(0);
  const history = useHistory();
  const isEnglish = i18n?.language === EN;
  const tabTitle = isEnglish ? tab?.english_title : tab?.title! || tab?.title!;
  const [categoryId, setCategoryId] = useState<string>('');
  const limit = 9;
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const page = parseInt(query.get('page')!);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [offset, setOffset] = useState<number>((page - 1) * limit || 0);

  const {
    requestApi,
    userState: { isAuthenticated },
  } = useMainContext();

  const getArticlesList = () => {
    setIsLoading(true);
    window.scrollTo({ top: 0, left: 0, behavior: SMOOTH });
    const updatedTab = getTab(id);
    const pagination = {
      offset: !page ? 0 : offset,
      limit,
      resourceId: categoryId,
      tab: updatedTab,
    };

    requestApi(
      listMagazines,
      { input: pagination, isAuthenticated },
      (response: { magazines: MagazineFromApi[]; count: number }, error: string) => {
        const { count } = response;
        setCount(count);
        if (error) {
          return;
        }
        setArticlesList(response.magazines);
        setIsLoading(false);
      }
    );
  };

  const getListOfTab = () => {
    requestApi(
      listCategories,
      { offset: 0, limit: 50, tab: MAGAZINE_TAB },
      (categoriesList: { results: Category[]; count: string }, error: string) => {
        if (error) {
          return;
        }
        setCategoriesList(categoriesList.results);
      }
    );
  };

  const onSelectTab = (tab: Category) => {
    selectTab(tab);
    setCategoryId('');
    history.push(`${MAGAZINES_ROUTE}/${tab}`);
  };

  const selectCategory = (id: string) => {
    setCategoryId(id);
  };

  const postPageChange = (offset: number, currentPage: number) => {
    setOffset(offset);
    setCurrentPage(currentPage);
    history.push(`${history.location.pathname}?page=${currentPage}`);
  };

  useEffect(() => {
    getArticlesList();
  }, [id, categoryId, offset, i18n.language]);

  useEffect(() => {
    getListOfTab();
  }, [i18n.language]);

  return (
    <div className="magazine-page-wrapper">
      <MetaTags title={`${t(MANZILIK)} | ${t(MAGAZINE)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <Container>
        <Separator vertical={24} />
        <MagazineHeader
          id={id}
          tab={tab}
          selectTab={onSelectTab}
          setCategoryId={selectCategory}
          categories={categories}
        />
        <Articles magazines={magazines} currentPage={currentPage} postPageChange={postPageChange} total={count} />
        {magazines.length === 0 && !isLoading && <div className="no-data">{t(THERE_ARE_NO_DATA)}</div>}
        {isLoading && <Skeleton />}
      </Container>
    </div>
  );
};

export default MagazineHome;
