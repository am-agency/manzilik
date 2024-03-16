import React, { FunctionComponent } from 'react';
// Components
import { List } from 'antd';

import { THERE_ARE_NO_DATA } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { Professional } from '../../../../API';
import { RelatedProfessionalsSmallCard } from '../related_professionals_small_card';
import { useMediaQuery } from 'react-responsive';

interface Props {
  relatedProfessionals?: Professional[];
}

const RelatedProfessionalsList: FunctionComponent<Props> = ({ relatedProfessionals }: Props) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: '(max-width: 420px)' });
  return (
    <List
      className="related-professionals-list"
      dataSource={relatedProfessionals}
      renderItem={(professional) => (
        <RelatedProfessionalsSmallCard item={professional!} isSmallScreen={isMobile ? true : false} />
      )}
      locale={{ emptyText: t(THERE_ARE_NO_DATA) }}
    />
  );
};

export default RelatedProfessionalsList;
