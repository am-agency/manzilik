import React, { FunctionComponent, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { GalleryPhoto } from '../../../../API';
import { withPagination, WithPaginationProps } from '../../../../app/hooks/with_pagination';
import { SHOW, LOAD_NEXT_PHOTOS, PHOTOS } from '../../../../locales/strings';
import { ZoomInPhoto } from './zoom_in_photo';
import { LOADING_UPLOADING_IDEA_IMAGE } from '../../../../app/providers/main/loading_constants';
import { CardsSkeleton } from '../../../../components/skeletons/cards_grid_skeleton';
import { useMainContext } from '../../../../app/providers/main';
import { getBrandGalleryPhotosFromApi } from '../../api';
import { BrandImage } from '../../types';

const GalleryPhotosList: FunctionComponent<WithPaginationProps<BrandImage>> = (
  props: WithPaginationProps<BrandImage>
) => {
  const { list, onLoadMore, total = 0 } = props;
  const { t } = useTranslation();
  const [isZoomingIn, setIsZoomingIn] = useState<boolean>(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>('');
  const { loadingMap } = useMainContext();

  const onZoomIdea = (photo_url: string) => {
    setIsZoomingIn(true);
    setCurrentPhotoUrl(photo_url);
  };

  if (list?.length == 0) {
    return <div />;
  }

  return (
    <div id="photos">
      <Typography.Title level={4}>{`${t(PHOTOS)} (${total})`}</Typography.Title>
      <Row gutter={32} wrap className="photos-section">
        {list?.map((element, index) => {
          return (
            <Col
              key={index}
              xl={8}
              lg={8}
              md={12}
              sm={24}
              xs={24}
              className="photo"
              onClick={() => onZoomIdea(element.photo!)}
            >
              <div className="photo-container">
                <img className="rounded-border img-fit-content" src={element?.photo!} alt="professional-gallery" />
              </div>
            </Col>
          );
        })}
        {/**TODO: this should go to common zoom in component, I just fixed the zoom-in bug right now */}
        {list && isZoomingIn && (
          <ZoomInPhoto
            images={list.map((item, index) => ({ id: index + 1, ...item })) as unknown as GalleryPhoto[]}
            setVisible={setIsZoomingIn}
            visible={isZoomingIn}
            currentPhotoUrl={currentPhotoUrl}
          />
        )}
      </Row>
      <div>
        {loadingMap[LOADING_UPLOADING_IDEA_IMAGE] && (
          <CardsSkeleton cardsCount={6} colSpan={{ xl: 8, lg: 8, md: 8, sm: 24, xs: 24 }} />
        )}
      </div>
      {total > list?.length! && (
        <div className="load-more" onClick={onLoadMore}>
          {t(SHOW)} {total - list?.length!} {t(LOAD_NEXT_PHOTOS)}
        </div>
      )}
    </div>
  );
};

const GalleryPhotos = withPagination<BrandImage>(
  getBrandGalleryPhotosFromApi, // api function
  GalleryPhotosList, // component
  true, //manual fetch
  LOADING_UPLOADING_IDEA_IMAGE
);

export default GalleryPhotos;
