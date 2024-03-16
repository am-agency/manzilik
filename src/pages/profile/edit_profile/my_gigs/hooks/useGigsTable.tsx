import React, { useRef } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IMAGE,
  MAIN_SERVICE,
  SERVICE_PRICE,
  SERVICE_LOCATION,
  SERVICE_STATUS,
  SERVICE_TITLE,
  SAR,
  ACTIVATED,
  NOT_AVAILABLE,
} from '../../../../../locales/strings';

import { GigsListItem } from '../types';

export const useGigsTable = () => {
  const original = useRef<GigsListItem[]>();

  const { t } = useTranslation();

  const createColumn = useCallback(
    (title_key: string, render: (item: GigsListItem) => ReactNode) => {
      return { title: t(title_key), render: (_: unknown, item: GigsListItem) => render(item) };
    },
    [t]
  );
  const columns: ColumnsType<GigsListItem> = useMemo(() => {
    return [
      createColumn(IMAGE, (item) => (
        <img
          src={item.photos[0]}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '20%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      )),
      createColumn(MAIN_SERVICE, (item) => item.services[0].title),
      createColumn(SERVICE_TITLE, (item) => item.description),
      createColumn(SERVICE_PRICE, (item) => `${item.price} ${t(SAR)}`),
      createColumn(SERVICE_LOCATION, (item) => {
        const allCities = item.cities.map((city) => city.name);
        return allCities.join(', ');
      }),
      createColumn(SERVICE_STATUS, (item) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <span
              style={{
                backgroundColor: item.is_enabled == true ? '#56D49B' : '#FF3B30',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                display: 'inline-block',
                marginInlineStart: '5px',
              }}
            />
            {item.is_enabled == true ? t(ACTIVATED) : t(NOT_AVAILABLE)}
          </div>
        );
      }),
    ];
  }, [t]);

  return {
    columns,
  };
};
