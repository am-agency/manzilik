import React, { useEffect, useState } from 'react';
import { Badge, Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Category, Professional } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { Project } from '../../../components/idea/types';
import Separator from '../../../components/separator';
import { RELATED_PROFESSIONALS, VIEW_ALL } from '../../../locales/strings';
import { relatedProfessionals } from '../api';
import RelatedProfessionalsList from '../components/related_professionals_list';

interface Props {
  project: Project;
}

export const RelatedProfessionalSection = ({ project }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { requestApi } = useMainContext();
  const [relatedProfessionalsList, setRelatedProfessionalsList] = useState<Professional[]>([]);
  const [relatedProfessionalsListLength, setRelatedProfessionalsListLength] = useState<number>(0);
  const [category, setCategory] = useState<Category>();

  const getRelatedProfessional = (id: string) => {
    const limit = 3;
    requestApi(
      relatedProfessionals,
      { offset: 0, limit, resourceId: id },
      (response: { results: Professional[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        const { results, count } = response;
        setRelatedProfessionalsList(results!);
        setRelatedProfessionalsListLength(count);
      }
    );
  };

  useEffect(() => {
    if (project && project.id && project?.room_type) {
      setCategory(project?.room_type?.category!);
      if (project?.room_type?.category?.id!) {
        getRelatedProfessional(project?.room_type?.category?.id!);
      }
    }
  }, [project]);

  const onViewAllProfessionals = () => {
    history.push(`/professionals/?q=&c=${category?.title}&f=&o=0&l=10`);
  };

  return (
    <Row>
      <Col span={24}>
        <div className="related-professionals-header">
          <div className="related-professionals-badg">
            <Typography.Text>{t(RELATED_PROFESSIONALS)}</Typography.Text>
            <Separator horizontal={3} />
            <Badge className="badg" count={relatedProfessionalsListLength} />
          </div>
          <Typography.Text onClick={onViewAllProfessionals}>{t(VIEW_ALL)}</Typography.Text>
        </div>
        <Separator vertical={11} />
      </Col>
      <Col span={24}>
        <RelatedProfessionalsList relatedProfessionals={relatedProfessionalsList} />
      </Col>
    </Row>
  );
};
