import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';

import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import Separator from '../../../../components/separator';

import { MORE_ON_MANZILIK } from '../../../../locales/strings';
import { useMainContext } from '../../../../app/providers/main';
import { listRecentMagazines } from '../../api';
import { Magazine } from '../../../../API';
import { replaceSpaceWithDash } from '../../../../utils';
import { GENERIC_MAGAZINE_ROUTE } from '../../../../utils/routes';

export const MoreOnManzilik = () => {
  const history = useHistory();
  const { requestApi } = useMainContext();
  const [magazines, setMagazinesList] = useState<Magazine[]>([]);
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const getLatestMagazines = () => {
    requestApi(listRecentMagazines, { id }, (magazines: Magazine[], error: string) => {
      if (error) {
        return;
      }
      setMagazinesList(magazines);
    });
  };

  const onStoryClick = (magazine: Magazine) => {
    history.push(GENERIC_MAGAZINE_ROUTE + '/' + replaceSpaceWithDash(magazine?.title!) + '/' + magazine.id);
  };

  useEffect(() => {
    getLatestMagazines();
  }, [id]);

  return (
    <div className="more-stories">
      <Separator vertical={30} />
      <Typography.Text className="more-on-manzilik-heading">{t(MORE_ON_MANZILIK)}</Typography.Text>
      <Separator vertical={20} />
      {magazines.map((magazine) => (
        <p key={magazine.id}>
          <Typography.Text className="more-articles-title clickable link" onClick={() => onStoryClick(magazine)}>
            {magazine.title}
          </Typography.Text>
        </p>
      ))}
    </div>
  );
};
