import { Button, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterKeyToFilterValues, FiltersViewSource } from '../../app/hooks/filters/types';
import { TFiltersForm } from '../../app/hooks/filters/useFiltersForm';
import { getLayoutDirection } from '../../app/layouts';
import icons from '../../assets/icons';
import { ALL_FILTERS, SHOP_SEARCH } from '../../locales/strings';
import { FiltersForm } from '../../pages/ideas/ideas_filter/filters_form';
import { CustomCarousal } from '../carousal';
import Separator from '../separator';
import { FilterSelect } from './fitler_select';
import { useHistory } from 'react-router-dom';

interface Props {
  filtersSource: FiltersViewSource;
  filtersForm: TFiltersForm;
  keyword?: string;
  onSubmitKeyword?: (keyword: string) => void;
}

export const Filters = ({ filtersForm, keyword, onSubmitKeyword, filtersSource }: Props) => {
  const { i18n, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const filtersCarousalAction = '';
  const [inputKeyword, setInputKeyword] = useState('');
  const [filteredFiltersSource, setFilteredFiltersSource] = useState<FiltersViewSource>(filtersSource);
  const history = useHistory();
  const { pathname } = history.location;
  const isIdeaPage = pathname.includes('ideas');

  useEffect(() => {
    if (isIdeaPage && filtersSource.length > 0) {
      const ideasFilters = filtersSource.filter((filter) => filter.key !== 'price' && filter.key !== 'rate');
      setFilteredFiltersSource(ideasFilters);
    } else {
      setFilteredFiltersSource(filtersSource);
    }
  }, [filtersSource]);

  useEffect(() => {
    setInputKeyword(keyword || '');
  }, [keyword]);

  const onCloseModal = () => {
    setModalVisible(false);
  };

  const showFilters = () => {
    setModalVisible(true);
  };

  const onCancel = () => {
    filtersForm.restoreSnapshot();
    filtersForm.submitNextUpdate();
    onCloseModal();
  };

  return (
    <div className="custom-carousal-wrapper selected-filters filters-container select-wrapper" id="selected-filters">
      {onSubmitKeyword && !isIdeaPage ? (
        <section className="search-input-container">
          <Input
            className="search-input"
            placeholder={t(SHOP_SEARCH)}
            prefix={<img src={icons.search.icon} />}
            onPressEnter={() => onSubmitKeyword?.(inputKeyword)}
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
          />
          <Separator horizontal={6} />
        </section>
      ) : null}

      <div className="selected-filters">
        <div className="all-filters-btn-wrapper">
          <Button onClick={showFilters} className="all-filters-btn" icon={<img src={icons.filter.icon} />}>{`${t(
            ALL_FILTERS
          )} (${filtersForm.getValuesCount(filtersForm.filterKeyToFilterValue).total})`}</Button>
        </div>
        {filteredFiltersSource.map((filterSource) => {
          return <FilterSelect key={filterSource.key} filterSource={filterSource} filtersForm={filtersForm} />;
        })}
      </div>
      <Separator vertical={1} />
      <Modal
        visible={modalVisible}
        onCancel={onCancel}
        footer={false}
        className={`modal-wrapper filters-modal modal-with-custom-footer ${getLayoutDirection(i18n.language)}`}
      >
        <FiltersForm filtersSource={filtersSource} filtersForm={filtersForm} onCloseModal={onCloseModal} />
      </Modal>
    </div>
  );
};
