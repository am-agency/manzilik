import React, { useMemo } from 'react';
import { AutoComplete, Button, Col, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useTranslation } from 'react-i18next';
import { ARE_YOY_LOOKING_FOR_IDEAS, IN, SEARCH, START_SEARCH } from '../../../locales/strings';

import {
  getAutoCompleteKeyBasedOnLanguage,
  getAutoValueSuffixBasedOnLanguage,
  getValueWithoutTags,
  replaceSpace,
} from '../utils';

import { getLayoutDirection } from '../../../app/layouts';
import { useMainContext } from '../../../app/providers/main';
import { useSearchQuery } from '../../../app/hooks/search/useSearchQuery';
import { searchIcons } from '../../../assets/icons/search';
import { EntityTags } from '../../../components/idea/types';
import { checkEmptySimpleString } from '../../../utils';
import { BRANDS_ROUTE, IDEAS_ROUTE, PRODUCTS_SEARCH_ROUTE, PROFESSIONALS_ROUTE } from '../../../utils/routes';
import { getAutoComplete } from '../api';
import { AutoCompleteKeyObject } from '../types';
import { uuid4 } from '@sentry/utils';
import { AutoCompleteResult } from '../../../API';
import { DEFAULT_SEARCH_OPTIONS } from '../../../app/hooks/search/useSearchOptions';
import * as analytics from '../../../analytics';
import { useFeature } from 'flagged';
import { ECOMMERCE_FEATURE } from '../../../app/settings';

interface AutoCompleteList {
  [key: string]: AutoCompleteKeyObject[];
}
interface IconsKey {
  [key: string]: string;
}

interface Props {
  searchSpan: number;
  btnSpan: number;
}

const nonSearchableFeatures = new Set([EntityTags.MAGAZINES, EntityTags.TVS, EntityTags.DISCUSSIONS]);

const createDefaultOption = (keyword: string, entity: EntityTags): AutoCompleteKeyObject => {
  return {
    id: uuid4(),
    title: `<b>${keyword}</b>`,
    key_id: uuid4(),
    key: entity,
  };
};

export const SearchAutoComplete = ({ searchSpan, btnSpan }: Props) => {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [options, setOptions] = useState<AutoCompleteList>({});
  const [transformedResults, setTransformedResults] = useState<AutoCompleteList>({});
  const location = useLocation();
  const query = useSearchQuery({});
  const isEcommerce = useFeature(ECOMMERCE_FEATURE);

  const iconsKey: IconsKey = {
    projects: searchIcons.ideas,
    professionals: searchIcons.professional,
    magazines: searchIcons.magazine,
    tvs: searchIcons.tv,
    discussions: searchIcons.discussion,
    stockrecords: searchIcons.shopping,
  };

  const getAutoCompleteOptions = (value: string) => {
    if (checkEmptySimpleString(value)) {
      requestApi(
        getAutoComplete,
        { text: value, l: 100, o: 0 },
        ({ results }: { results: AutoCompleteResult; count: number }, error: string) => {
          if (error) {
            return;
          }

          for (const key in results) {
            const arrayOfResults = results[key as keyof AutoCompleteResult]! as string[];
            const result = arrayOfResults.map((res) => ({
              id: uuid4(),
              key_id: uuid4(),
              key: key,
              title: res,
            }));
            if (result) {
              setTransformedResults((prev) => ({ ...prev, [key]: result }));
            }
          }
          if (transformedResults.ideas?.length === 0) {
            transformedResults.ideas?.push(createDefaultOption(value, EntityTags.IDEAS));
          }
          if (transformedResults.professionals?.length === 0) {
            transformedResults.professionals?.push(createDefaultOption(value, EntityTags.PROFESSIONALS));
          }
          if (transformedResults.stockrecords?.length === 0) {
            isEcommerce ? transformedResults.stockrecords?.push(createDefaultOption(value, EntityTags.PRODUCTS)) : null;
          }
          if (transformedResults.projects?.length === 0) {
            transformedResults.projects?.push(createDefaultOption(value, EntityTags.PROJECTS));
          }
          if (transformedResults.brands?.length === 0) {
            transformedResults.brands?.push(createDefaultOption(value, EntityTags.BRANDS));
          }
          setOptions({
            stockrecords: transformedResults.stockrecords,
            ...transformedResults,
          });
        }
      );
    }
  };

  const onChange = (value: string) => {
    if (checkEmptySimpleString(value)) {
      setSelectedValue(value);
    } else {
      setOptions({});
      setSelectedValue('');
    }
  };

  const onBlur = () => {
    document.getElementById('search-auto-complete')?.blur();
  };

  const onSelectOption = async (value: string, entity: string) => {
    const term = replaceSpace(getValueWithoutTags(value));
    const searchUrl = query.getQueryString({
      keywords: term,
      searchOptions: DEFAULT_SEARCH_OPTIONS,
    });
    setSelectedValue('');
    analytics.PublishEvent(new analytics.AnalyticsSearchEvent(term));
    switch (entity) {
      case EntityTags.IDEAS:
        history.push(`${IDEAS_ROUTE}${searchUrl}`);
        break;

      case EntityTags.PROJECTS:
        history.push(`${IDEAS_ROUTE}${searchUrl}`);
        break;

      case EntityTags.PROFESSIONALS:
        history.push(`${PROFESSIONALS_ROUTE}${searchUrl}`);
        break;

      case EntityTags.PRODUCTS:
        history.push(`${PRODUCTS_SEARCH_ROUTE}${searchUrl}`);
        break;

      case EntityTags.BRANDS:
        history.push(`${BRANDS_ROUTE}${searchUrl}`);
        break;

      case EntityTags.MAGAZINES:
        // Filters not included in magazines
        break;
      case EntityTags.TVS:
        // Filters not included in TVS
        break;
      case EntityTags.DISCUSSIONS:
        // Filters not included in discussions
        break;
      default:
        break;
    }
  };

  const getOptionLabel = (item: string) => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: item,
        }}
      />
    );
  };

  const SearchOption = ({ option, entity }: { option: AutoCompleteKeyObject; entity: string }) => {
    return (
      <section
        className="option-wrapper"
        onClick={(e) => {
          e.preventDefault();
          onSelectOption(option.title, entity);
        }}
      >
        <span>
          {getOptionLabel(option.title)}
          <Typography.Text className="option-suffix"> {getAutoValueSuffixBasedOnLanguage(entity, t)} </Typography.Text>
        </span>
      </section>
    );
  };

  const OptionGroupHeader = ({ entity, input }: { entity: string; input: string }) => {
    const icon = iconsKey[entity];
    return (
      <div className="header-wrapper clickable" onClick={() => onSelectOption(input, entity)}>
        <img src={icon} className={getLayoutDirection(i18n.language)} />
        <span className="title-wrapper">
          <Typography.Text className="recent-text"> {selectedValue} </Typography.Text> {t(IN)}
          <Typography.Text> {getAutoCompleteKeyBasedOnLanguage(entity, t)} </Typography.Text>
        </span>
      </div>
    );
  };

  useEffect(() => {
    if (selectedValue) {
      const delaySlot = setTimeout(() => {
        getAutoCompleteOptions(selectedValue!);
      }, 500);
      return () => clearTimeout(delaySlot);
    }
  }, [selectedValue]);

  useEffect(() => {
    onBlur();
  }, [location]);

  const autocompleteOptions = useMemo(() => {
    const _options = Object.entries(transformedResults);
    const result = _options
      .map(([entity, options]) => {
        const [firstOption] = options;
        if (options.length === 0 || nonSearchableFeatures.has(entity as EntityTags)) {
          return { empty: true, label: <></>, options: [] };
        }
        return {
          label: <OptionGroupHeader entity={entity} input={firstOption.title} />,
          options: options.map((option) => {
            const keyword = replaceSpace(getValueWithoutTags(option.title));
            const value = `${keyword},${entity}`;
            return {
              value,
              label: <SearchOption key={option.id} option={option} entity={entity} />,
            };
          }),
        };
      })
      .filter((o) => !o.empty);
    return result;
  }, [options, selectedValue, transformedResults]);

  return (
    <Row className="autocomplete" align="middle" gutter={8}>
      <Col span={searchSpan}>
        <AutoComplete
          id="search-auto-complete"
          allowClear
          dropdownClassName={`auto-complete-select ${getLayoutDirection(i18n.language)}`}
          showArrow
          onChange={onChange}
          onBlur={onBlur}
          value={selectedValue}
          clearIcon={<img src={''} />}
          suffixIcon={<img src={searchIcons.blackSearch} />}
          placeholder={t(START_SEARCH)}
          options={autocompleteOptions}
        />
      </Col>

      <Col span={btnSpan}>
        <Button
          className="search-btn"
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            onSelectOption(selectedValue, EntityTags.IDEAS);
          }}
        >
          {t(SEARCH)}
        </Button>
      </Col>
    </Row>
  );
};
