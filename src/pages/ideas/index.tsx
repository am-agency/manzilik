/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Select, Typography } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Idea, Project } from '../../API';
import * as analytics from '../../analytics';
import { useFiltersForm } from '../../app/hooks/filters/useFiltersForm';
import { SortMethod } from '../../app/hooks/search/useSearchOptions';
import i18n from '../../app/i18n';
import { getLayoutDirection } from '../../app/layouts';
import { CustomCarousal } from '../../components/carousal';
import { Container } from '../../components/container';
import { Filters } from '../../components/filters';
import { MetaTags } from '../../components/meta_tags';
import { PaginationList } from '../../components/pagination_list/pagination_list';
import { SearchTags } from '../../components/search_tags';
import { useSearchTags } from '../../components/search_tags/hooks/useSearchTags';
import { FIND_IDEAS, HOME_PAGE_SEO_DESCRIPTION, LATEST, MANZILIK, OF, SORT_BY } from '../../locales/strings';
import { getPaginationOffset } from '../../utils';
import { ProjectContainer } from '../idea/components/idea_card/project_container';
import { Categories } from './categories';
import { useSearchIdeas } from './hooks/useSearchIdeas';
import { sortData } from './utils';
import IdeaCardSkeleton from '../../components/skeletons/idea_card_skeleton';

const Ideas = () => {
  const { t } = useTranslation();
  const currentLangRef = useRef(i18n.language);
  const { pathname } = useLocation();
  const history = useHistory();

  const search = useSearchIdeas();
  const filtersForm = useFiltersForm({
    onSubmit(filtersValues) {
      search.setFilters(filtersValues);
    },
  });
  const searchKeyworkdTag = useMemo(() => {
    if (search.keywords.trim().length > 0) {
      return {
        title: search.keywords,
        onClear: () => {
          search.setKeywords('');
        },
      };
    }
  }, [search.keywords, window.location.search]);

  const { tags } = useSearchTags(filtersForm, search.filtersCache, searchKeyworkdTag);

  useEffect(() => {
    if (search.initialFilters && search.filtersSource.length) {
      filtersForm.initForm(search.initialFilters);
    }
  }, [search.initialFilters, search.filtersSource]);

  const onSortchange = (value: string) => {
    search.setSortMethod(value as SortMethod);
  };

  const getSingleCategory = (title: string) => {
    search.clear();
    filtersForm.reset();
    search.setCategories([title]);
  };

  const onDeleteSearchValue = () => {
    search.clear();
  };

  useEffect(() => {
    if (currentLangRef.current !== i18n.language) {
      onDeleteSearchValue();
      currentLangRef.current = i18n.language;
    }
  }, [i18n.language]);

  const onPagination = (page: number) => {
    const offset = getPaginationOffset(page, search.searchOptions.recordsLimit);
    search.setOffset(offset);
  };

  const showCategories = useMemo(() => {
    return search.keywords === '' && search.categories.length === 0;
  }, [search.keywords, search.categories]);

  const summary = useMemo(
    () =>
      search.totoalProjects === 0
        ? ''
        : [
            search.searchOptions.offset,
            '-',
            search.searchOptions.offset + search.searchOptions.recordsLimit,
            t(OF),
            search.totoalProjects,
          ].join(' '),
    [search.totoalProjects]
  );

  useEffect(() => {
    history.replace(pathname + search.queryString);
  }, [search.queryString]);

  const onSearch = (keywords: string) => {
    analytics.PublishEvent(new analytics.AnalyticsSearchEvent(keywords));
    search.setKeywords(keywords);
  };

  useEffect(() => {
    if (search.initialFilters === undefined) {
      return;
    } else {
      search.updateProjects();
    }
  }, [i18n.language, search.queryString, search.initialFilters]);

  const clear = () => {
    search.clear();
    filtersForm.reset();
  };

  return (
    <Container>
      <MetaTags title={`${t(MANZILIK)} | ${t(FIND_IDEAS)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <div className="photos">
        <Categories onCategoryClick={getSingleCategory} />
        <Filters
          keyword={search.keywords}
          onSubmitKeyword={onSearch}
          filtersSource={search?.filtersSource! as any}
          filtersForm={filtersForm}
        />

        <SearchTags tags={tags} onClearAllTags={clear} />

        <Row className="sort sort-wrapper" justify="space-between">
          <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24} className="col-wrapper">
            <Typography.Text className="select-label">{t(SORT_BY)}:</Typography.Text>
            <div className="location">
              <Select
                bordered={false}
                dropdownClassName={`${getLayoutDirection(i18n.language)} sort-dropdown`}
                onChange={onSortchange}
                defaultValue={t(LATEST)}
              >
                {sortData.map((sortMethod) => {
                  return (
                    <Select.Option key={sortMethod.value} value={sortMethod.value}>
                      {t(sortMethod.label)}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
          </Col>
          <Col xxl={6} xl={6} lg={12} md={12} sm={24} xs={24} className="col-wrapper sort-wrapper">
            <Typography.Text className="select-label ideas-number">{summary}</Typography.Text>
          </Col>
        </Row>
        {search.isIdeaLoading ? (
          <>
            <IdeaCardSkeleton />
            <IdeaCardSkeleton />
            <IdeaCardSkeleton />
          </>
        ) : (
          <PaginationList
            grid={{ gutter: 30, column: 3, xl: 3, lg: 3, md: 2, sm: 2, xs: 1, xxl: 3 }}
            currentPage={search.getCurrentPage()}
            pageSize={search.searchOptions.recordsLimit}
            total={search.totoalProjects}
            dataSource={search.projects}
            renderItem={(item: unknown) => <ProjectContainer key={(item as Project).id} project={item as Project} />}
            onPageChange={onPagination}
          />
        )}
      </div>
    </Container>
  );
};

export default Ideas;
