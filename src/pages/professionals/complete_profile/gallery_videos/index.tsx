import React, { FunctionComponent, ReactElement } from 'react';
// hooks
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../app/providers/modal';
import { withPagination, WithPaginationProps } from '../../../../app/hooks/with_pagination';
//types
import { Video } from '../../../../API';
//strings
import { REMOVE, SEE_MORE_VIDEOS } from '../../../../locales/strings';
//api
import { listGalleryVideos } from '../../api';
//components
import Link from 'antd/lib/typography/Link';
import { Button, Col, Row } from 'antd';
import { profileIcons } from '../../../../assets/icons/profile';
import ReactPlayer from 'react-player';
import { ModalTitle } from '../../../../components/modal_title';
import { DeleteConfirmationPopup } from '../gallery_photos/delete_confirmation';
import icons from '../../../../assets/icons';
import { PROFESSIONAL, VIDEO } from '../../../../app/settings';
import Separator from '../../../../components/separator';
import { LOADING_UPLOADING_IDEA_IMAGE } from '../../../../app/providers/main/loading_constants';
import { CardsSkeleton } from '../../../../components/skeletons/cards_grid_skeleton';
import { useMainContext } from '../../../../app/providers/main';

const GalleryVideos: FunctionComponent<WithPaginationProps<Video>> = (props: WithPaginationProps<Video>) => {
  const { list, onLoadMore, hasMore, refresh, type, showIcon = true } = props;
  const { t } = useTranslation();
  const { showModal } = useModal();
  const colSpan = type == PROFESSIONAL ? 8 : 12;
  const { loadingMap } = useMainContext();

  const deleteVideo = (id: string) => {
    showModal(
      <ModalTitle title={t(REMOVE)} icon={icons.remove.icon} />,
      <DeleteConfirmationPopup id={id} refresh={refresh} type={VIDEO} />,
      '',
      REMOVE
    );
  };

  return (
    <>
      <Row className="videos-wrapper" gutter={[16, 16]}>
        {list?.map((elm) => {
          return (
            <Col xl={colSpan} lg={colSpan} md={colSpan} sm={24} xs={24} className="video" key={elm.id}>
              <div className="overlay-wrapper">
                <ReactPlayer url={elm.video!} width={'100%'} height={'100%'} controls={true} />
                <div className="thumbnail-overlay img-fit-content rounded-border" />
              </div>
              {elm.id && showIcon && (
                <img className="delete-icon" src={profileIcons.trashCan} onClick={() => deleteVideo(elm.id)} />
              )}
            </Col>
          );
        })}
      </Row>
      <Separator vertical={15} />
      <div>
        {loadingMap[LOADING_UPLOADING_IDEA_IMAGE] && (
          <CardsSkeleton cardsCount={6} colSpan={{ xl: 8, lg: 8, md: 8, sm: 24, xs: 24 }} />
        )}
      </div>
      {hasMore && list?.length! > 0 && (
        <Row justify="center">
          <Link onClick={onLoadMore} className="link">
            <Button type="primary">{t(SEE_MORE_VIDEOS)}</Button>
          </Link>
        </Row>
      )}
    </>
  );
};

const ProfileVideos = withPagination<Video>(
  listGalleryVideos, // api function
  GalleryVideos, // component
  true, // manual fetch
  LOADING_UPLOADING_IDEA_IMAGE
);

export default ProfileVideos;
