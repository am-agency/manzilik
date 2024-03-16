import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { CANCEL, SAVE, THERE_ARE_NO_DATA } from '../../../../locales/strings';
import { useModal } from '../../../../app/providers/modal';
import { ideaIcons } from '../../../../assets/icons/idea';
import { getLayoutDirection } from '../../../../app/layouts';
import icons from '../../../../assets/icons';

interface Props {
  photos: string[];
  onSavePhoto: (photo_url: string) => void;
}

export const PhotosModal = ({ photos, onSavePhoto }: Props) => {
  const { t, i18n } = useTranslation();
  const { setModalVisible } = useModal();
  const [savedPhoto, setSavedPhoto] = useState<string>('');

  const onCancel = () => {
    setModalVisible?.(false);
  };

  const onClick = (elm: string) => {
    setSavedPhoto(elm);
    onSavePhoto(elm);
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (event: any) => {
    event.target.classList.toggle('broken-image');
    event.target.closest('.photo-id').style.display = 'none';
  };

  return (
    <Form>
      <Row gutter={[24, 16]}>
        {photos
          .filter((item) => item !== null && item.startsWith('https'))
          .map((elm, id) => {
            return (
              <Col xl={4} lg={4} md={8} sm={12} xs={12} key={`photo-${id}`} className="photo-id">
                <img src={elm} className="img-fit-content rounded-border" onError={onError} />

                <div className={`save-btn clickable ${getLayoutDirection(i18n.language)}`} onClick={() => onClick(elm)}>
                  {t(SAVE)} &nbsp;
                  <img src={elm !== savedPhoto ? ideaIcons.like.whiteIcon : icons.love.icon} />
                </div>
              </Col>
            );
          })}
      </Row>
      {photos.length == 0 && <Row justify="center"> {t(THERE_ARE_NO_DATA)} </Row>}
      <Row justify="end">
        <Col xl={3} lg={3} md={12} sm={24} xs={24}>
          <Form.Item>
            <Button className="cancel-btn" onClick={onCancel}>
              {t(CANCEL)}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
