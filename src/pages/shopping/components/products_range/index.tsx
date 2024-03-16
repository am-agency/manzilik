import React from 'react';
import { useTranslation } from 'react-i18next';
import { OF } from '../../../../locales/strings';

interface Props {
  total: number;
  range: number[];
}
export const ProductsRange = ({ range, total }: Props) => {
  const { t } = useTranslation();
  return (
    <p>
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      {range.join(' - ')}
      &nbsp;
      {t(OF)} &nbsp;
      {total}
    </p>
  );
};
