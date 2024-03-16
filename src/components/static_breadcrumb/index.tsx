import { Breadcrumb } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MAIN } from '../../locales/strings';

interface Props {
  title: string;
}
export const StaticPagesBreadcrumb: FunctionComponent<Props> = ({ title }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <Link to="/">{t(MAIN)}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{title}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};
