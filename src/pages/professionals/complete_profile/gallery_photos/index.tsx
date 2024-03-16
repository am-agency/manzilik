import React, { FunctionComponent, ReactElement } from 'react';
// hooks
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../app/providers/modal';
import { withPagination, WithPaginationProps } from '../../../../app/hooks/with_pagination';
//types
import { GalleryPhoto } from '../../../../API';
//strings
import { REMOVE, SEE_MORE_PHOTOS } from '../../../../locales/strings';
//utils
import { customRequest } from '../../../../utils';
//api
import { listGalleryPhotos } from '../../api';
//components
import Link from 'antd/lib/typography/Link';
import { Button, Row, Upload } from 'antd';
import { DeleteConfirmationPopup } from './delete_confirmation';
import { ModalTitle } from '../../../../components/modal_title';
//icons
import icons from '../../../../assets/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { profileIcons } from '../../../../assets/icons/profile';
import { PHOTO } from '../../../../app/settings';
import Separator from '../../../../components/separator';
import { CardsSkeleton } from '../../../../components/skeletons/cards_grid_skeleton';
import { LOADING_UPLOADING_IDEA_IMAGE } from '../../../../app/providers/main/loading_constants';
import { useMainContext } from '../../../../app/providers/main';

const GalleryPhotos: FunctionComponent<WithPaginationProps<GalleryPhoto>> = (
  props: WithPaginationProps<GalleryPhoto>
) => {
  const { list, onLoadMore, hasMore, refresh } = props;
  const { t } = useTranslation();
  const { showModal } = useModal();
  const { loadingMap } = useMainContext();

  const deletePhoto = (id: string) => {
    showModal(
      <ModalTitle title={t(REMOVE)} icon={icons.remove.icon} />,
      <DeleteConfirmationPopup id={id} refresh={refresh} type={PHOTO} />,
      '',
      REMOVE
    );
  };

  return (
    <>
      <Upload
        listType="picture-card"
        accept="image/png, image/jpeg, image/gif"
        fileList={list?.map((galleryPhoto) => ({
          url: galleryPhoto?.photo!,
          uid: galleryPhoto.id!,
          name: galleryPhoto.id!,
        }))}
        multiple
        customRequest={customRequest}
        className="professional-photos-uploader show-photos"
        itemRender={(originNode: ReactElement, file: UploadFile) => {
          return (
            <div className="image-wrapper">
              <div className="overlay-wrapper">
                <img src={file.url} className="img-fit-content" />
                <div className="thumbnail-overlay img-fit-content rounded-border" />
              </div>
              <img src={profileIcons.trashCan} className="delete-icon" onClick={() => deletePhoto(file.uid)} />
            </div>
          );
        }}
      />
      <Separator vertical={10} />
      <div>
        {loadingMap[LOADING_UPLOADING_IDEA_IMAGE] && (
          <CardsSkeleton cardsCount={6} colSpan={{ xl: 8, lg: 8, md: 8, sm: 24, xs: 24 }} />
        )}
      </div>
      {hasMore && list?.length! > 0 && (
        <Row justify="center">
          <Link onClick={onLoadMore} className="link">
            <Button type="primary">{t(SEE_MORE_PHOTOS)}</Button>
          </Link>
        </Row>
      )}
    </>
  );
};

const ProfilePhotos = withPagination<GalleryPhoto>(
  listGalleryPhotos, // api function
  GalleryPhotos, // component
  true, // manual fetch
  LOADING_UPLOADING_IDEA_IMAGE
);

export default ProfilePhotos;
