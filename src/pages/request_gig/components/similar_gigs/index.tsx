import React, { useEffect, useMemo } from 'react';
import { Row, Typography } from 'antd';
import { FunctionComponent } from 'react';
import { listSimilarGigs } from '../../api';
import { CardsSkeleton } from '../../../../components/skeletons/cards_grid_skeleton';
import { GigService, ProfessionalGigsList } from '../../../../API';
import { Slider } from '../../../../components/slider';
import Separator from '../../../../components/separator';
import { useMainContext } from '../../../../app/providers/main';
import GigCard from '../gig_card';
import { useTranslation } from 'react-i18next';
import { IN, RELATED_GIGS } from '../../../../locales/strings';
import { useClient } from '../../../../app/hooks/use_client';
import { useFeatures } from 'flagged';
import { SIMILAR_GIGS } from '../../../../app/settings';

interface SimilarGigsProps {
  type?: string;
}

const SimilarGigs = (props: SimilarGigsProps) => {
  const { requestApi } = useMainContext();
  const [isListLoading, setIsListLoading] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<(GigService | null)[]>([]);
  const { type } = props;
  const { t, i18n } = useTranslation();
  const { client, initClient } = useClient();
  const [cityId, setCityId] = React.useState<string>(client?.city?.id || '');
  const [cityName, setCityName] = React.useState<string>(client?.city?.name || '');
  const [sectionTitle, setSectionTitle] = React.useState<string>(t(RELATED_GIGS));
  const features = useFeatures();

  useEffect(() => {
    if (client) {
      setCityId(client?.city?.id || '');
      setCityName(client?.city?.name || '');
    }
  }, [client?.city?.id, client?.city?.name, i18n.language]);

  const getSimilarGigs = () => {
    setIsListLoading(true);
    requestApi(
      listSimilarGigs,
      { type, limit: '10', city_id: cityId },
      (response: ProfessionalGigsList, error: string) => {
        if (error) {
          return;
        }

        setItems(response?.results!);
        setIsListLoading(false);
      }
    );
  };

  useEffect(() => {
    if (cityName) {
      setSectionTitle(`${t(RELATED_GIGS)} ${t(IN)} ${cityName}`);
    } else {
      setSectionTitle(t(RELATED_GIGS));
    }
  }, [cityName, i18n.language]);

  useEffect(() => {
    getSimilarGigs();
    initClient();
  }, [i18n.language, cityId]);
  return (
    <>
      {features[SIMILAR_GIGS] ? (
        <div className="similar-gig">
          <Typography.Paragraph className="title">{sectionTitle}</Typography.Paragraph>
          <Separator vertical={6} />
          {!isListLoading && items.length > 0 ? (
            <Slider
              slidesToScroll={{ xl: 4, lg: 3, md: 2, sm: 1 }}
              slidesToShow={{ xl: 4, lg: 3, md: 2, sm: 1 }}
              listLength={items.length!}
            >
              {items.map((elm, index) => {
                return (
                  <Row justify="center" align="middle" key={elm?.id}>
                    <GigCard item={elm} listOfGigServices={[]} width="90%" backgroundColor="#FFF" />
                  </Row>
                );
              })}
            </Slider>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default SimilarGigs;
