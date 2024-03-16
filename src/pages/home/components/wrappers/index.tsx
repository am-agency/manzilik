import { Col, Typography } from 'antd';
import React, { ReactElement, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../../app/providers/main';
import Separator from '../../../../components/separator';
import { MAIN, MOST_RECENT } from '../../../../locales/strings';

interface IdeaCardWrapper {
  children: ReactElement;
}
const IdeaCardWrapper: FunctionComponent<IdeaCardWrapper> = (props: IdeaCardWrapper) => {
  return (
    <Col className="logged-in" xl={12} lg={12} md={12} sm={24} xs={24}>
      {props.children}
    </Col>
  );
};

interface ProjectListWrapper {
  children: ReactElement;
  key?: string;
}
const ProjectListWrapper: FunctionComponent<ProjectListWrapper> = (props: ProjectListWrapper) => {
  const { t } = useTranslation();
  return (
    <Col lg={16} xl={16} md={12} xs={24} sm={24}>
      <Typography.Text className="head">{t(MAIN)} </Typography.Text>
      <br />
      <Typography.Text className="sub-head">{t(MOST_RECENT)}</Typography.Text>
      <Separator vertical={20} />
      {props.children}
    </Col>
  );
};

export { ProjectListWrapper, IdeaCardWrapper };
