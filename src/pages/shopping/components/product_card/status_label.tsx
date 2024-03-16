import { Tag } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '../../../../API';
import { getLayoutDirection } from '../../../../app/layouts';

interface Props {
  labels: (Label | null)[];
}
export const StatusLabel: FunctionComponent<Props> = ({ labels }: Props) => {
  const { i18n } = useTranslation();

  return (
    <>
      {labels?.map((label) => {
        <Tag
          className={`status-label ${getLayoutDirection(i18n.language)}`}
          style={{ background: label?.color! }}
          color={label?.color!}
        >
          {label?.title}
        </Tag>;
      })}
    </>
  );
};
