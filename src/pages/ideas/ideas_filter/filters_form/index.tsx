import { Button, Col, Form, Menu, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../../../../components/container';
import { FilterKeyToFilterValues, FilterViewItem, FiltersViewSource } from '../../../../app/hooks/filters/types';
import { Loading } from '../../../../components/loading';
import { CLEAR_ALL, DONE } from '../../../../locales/strings';
import { FilterOptions } from './filters_options';
import { TFiltersForm } from '../../../../app/hooks/filters/useFiltersForm';
import { FilterKey } from '../../../../app/hooks/search/useSearchFilters';
interface Props {
  filtersSource: FiltersViewSource;
  filtersForm: TFiltersForm;
  showPriceFilter?: boolean;
  showReviewFilter?: boolean;
  onCloseModal: () => void;
}

export const FiltersForm = ({ filtersSource, filtersForm, onCloseModal }: Props) => {
  const { t } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState<FilterKey[]>([]);

  useEffect(() => {
    const [first] = filtersSource;
    if (first) {
      setSelectedKeys([first.key]);
    }
  }, [filtersSource]);

  const selectedFilters: FilterViewItem[] = useMemo(() => {
    if (filtersSource.length) {
      return selectedKeys
        .map((key) => {
          const filter = filtersSource.find((source) => source.key === key);
          return filter ? filter : null;
        })
        .filter((filter) => filter !== null) as FilterViewItem[];
    } else {
      return [];
    }
  }, [selectedKeys, filtersSource]);

  const onClearFilters = () => {
    filtersForm.reset();
    filtersForm.submit();
    onCloseModal();
  };

  const onDone = () => {
    filtersForm.submit();
    onCloseModal();
  };

  const count = useMemo(() => {
    return filtersForm.getValuesCount(filtersForm.filterKeyToFilterValue);
  }, [filtersForm.filterKeyToFilterValue]);

  useEffect(() => {
    filtersForm.saveSnapshot();
  }, []);

  return filtersSource.length ? (
    <Form>
      <Row className="filters-modal">
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Menu mode="vertical" selectedKeys={selectedKeys}>
            {filtersSource.map((filter) => {
              return (
                <Menu.Item key={filter.key} onClick={() => setSelectedKeys([filter.key])}>
                  {filter.title} {count.items[filter.key] ? `(${count.items[filter.key]})` : ''}
                </Menu.Item>
              );
            })}
          </Menu>
        </Col>
        <Col xl={18} lg={18} md={20} sm={24} xs={24} className="container-wrapper">
          <Container>
            {selectedFilters.map((selectedFilter, i) => {
              return <FilterOptions key={i} selectedFilter={selectedFilter} filtersForm={filtersForm} />;
            })}
          </Container>
        </Col>
      </Row>
      <Row gutter={20} align="middle" justify="end">
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Form.Item>
            <Button onClick={onClearFilters} className="modal-btn cancel-btn">
              {t(CLEAR_ALL)}
            </Button>
          </Form.Item>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="modal-btn" onClick={onDone}>
              {t(DONE)}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  ) : (
    <Loading />
  );
};
