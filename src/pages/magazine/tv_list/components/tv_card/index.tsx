import { PlayCircleFilled } from '@ant-design/icons';
import { Col, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TV } from '../../../../../components/idea/types';
import { replaceSpaceWithDash } from '../../../../../utils';
import { TV_ROUTE } from '../../../../../utils/routes';

interface Props {
  tv?: TV;
}

export const TVCard = (props: Props) => {
  const history = useHistory();
  const { tv } = props;
  const tvPath = `${TV_ROUTE}/${replaceSpaceWithDash(tv?.title!)}/${tv?.id}`;

  return (
    <div className="tv-card">
      <div
        className="tv-card-img"
        role="button"
        onClick={() => {
          history.push(tvPath);
        }}
      >
        <img src={tv?.photo!} alt={tv?.title!} className="img-fit-content rounded-top-border" />
        <div className="watch-now-btn clickable">
          <PlayCircleFilled />
        </div>
      </div>
      <div
        className="description clickable"
        onClick={() => {
          history.push(tvPath);
        }}
      >
        <Typography.Paragraph
          ellipsis={{
            rows: 2,
          }}
          className="tv-title"
        >
          {tv?.title}
        </Typography.Paragraph>
      </div>
    </div>
  );
};
