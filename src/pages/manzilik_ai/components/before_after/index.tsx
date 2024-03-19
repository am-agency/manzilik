/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from 'react';
import { AIDesignObject } from '../../types';
import { useTranslation } from 'react-i18next';
import { CANCEL, CONFIRM, CONFIRM_DELETE, DELETE_DESIGN, ORIGINAL, SURE_DELETE } from '../../../../locales/strings';
import i18n from '../../../../app/i18n';
import { ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';
import { useHistory } from 'react-router-dom';
import { Button, Dropdown, Menu, Modal, Space } from 'antd';
import type { MenuProps } from 'antd';
import icons from '../../../../assets/icons';
import { getLayoutDirection } from '../../../../app/layouts';
import { useMainContext } from '../../../../app/providers/main';
import { deleteAiDesign } from '../../api';
import { useClient } from '../../../../app/hooks/use_client';
import { useFeature } from 'flagged';
import { AI_OBJECT_RECOGNITION, MANZILIK_AI_DELETE_DESIGN } from '../../../../app/settings';
import { MANZILIK_AI_DESIGN_DETAILS } from '../../../../utils/routes';
import ImageLabel from '../../suggested_products/image_label';
import * as analytics from '../../../../analytics';

interface BeforeAfterProps {
  item: AIDesignObject;
  showDesignDetails?: boolean;
}

const BeforeAfter = (props: BeforeAfterProps) => {
  const { item: design, showDesignDetails = false } = props;
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const { setSelectedDesignObject, setAfterImageURL, setOriginalImageURL, setIsListMyDesignsRefresh } = useContext(
    ManzilikAiContext
  ) as ManzilikAiProps;
  const history = useHistory();
  const { client } = useClient();
  const isDeleteDesignFeatureEnabled = useFeature(MANZILIK_AI_DELETE_DESIGN);

  const HandleCardClick = () => {
    setSelectedDesignObject!(design);
    localStorage.setItem('selectedDesign', JSON.stringify(design));
    if (showDesignDetails) {
      setAfterImageURL!(design?.processedImagesPath ? design?.processedImagesPath[design?.selectedImageIndex] : '');
      setOriginalImageURL!(design?.sourceImageUrl);
      setSelectedDesignObject!(design);
      localStorage.setItem('selectedDesign', JSON.stringify(design));
      history.push(`${MANZILIK_AI_DESIGN_DETAILS}/${design.id}`);
    }
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const menu = (
    <Menu>
      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation();
          setIsModalVisible(true);
        }}
      >
        {t(DELETE_DESIGN)}
      </Menu.Item>
    </Menu>
  );

  const onConfirmDelete = () => {
    requestApi(
      deleteAiDesign,
      { imageId: design.id },
      (
        res: {
          data: { message: string };
        },
        err: string
      ) => {
        if (res) {
          setIsModalVisible(false);
          setIsListMyDesignsRefresh!(true);
        } else {
          return;
        }
      }
    );
  };
  return (
    <div className="list-item" key={design.id}>
      <div
        className="original"
        onClick={HandleCardClick}
        style={{
          cursor: showDesignDetails ? 'pointer' : 'default',
        }}
      >
        <img src={design.sourceImageUrl} alt={design.sourceImageUrl} className="list-img" />
        <p className="description">{t(ORIGINAL)}</p>
        {isDeleteDesignFeatureEnabled && showDesignDetails && client?.is_purchased && (
          <Dropdown overlay={menu} className="ai-dropdown" trigger={['hover']} overlayClassName="ant-custom-menu">
            <a>
              <img
                src={icons.delete_dots}
                alt="delete"
                className="delete-dots"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </a>
          </Dropdown>
        )}
      </div>
      <div
        className="styled"
        onClick={HandleCardClick}
        style={{
          cursor: showDesignDetails ? 'pointer' : 'default',
        }}
      >
        <ImageLabel
          imageSrc={design?.processedImagesPath ? design?.processedImagesPath[design?.selectedImageIndex] : ''}
          labels={design?.objects! as any}
          onLabelClicked={(e) => {
            e.stopPropagation();
            localStorage.setItem('selectedDesignObject', JSON.stringify(design!));
            analytics.PublishEvent(
              new analytics.AnalyticClickLabelEvent(showDesignDetails ? 'My Designs' : 'Recent Designs')
            );
          }}
          onViewSimilarClicked={() => {
            analytics.PublishEvent(
              new analytics.AnalyticViewSimilarEvent(showDesignDetails ? 'My Designs' : 'Recent Designs')
            );
          }}
        />
        {/* <img
          src={design?.processedImagesPath ? design?.processedImagesPath[design?.selectedImageIndex] : ''}
          className="list-img"
        /> */}
        <p className="description">{`${design.style.name}/${design.roomType.name}`}</p>
      </div>
      <Modal
        className={`delete-design-modal-wrapper ${getLayoutDirection(i18n.language)}`}
        visible={isModalVisible}
        closable={false}
        width={342}
        footer={null}
      >
        <p>{t(SURE_DELETE)}</p>
        <p>{t(CONFIRM_DELETE)}</p>
        <div className="delete-design-actions">
          <button onClick={onConfirmDelete}>{t(CONFIRM)}</button>
          <button onClick={() => setIsModalVisible(false)}>{t(CANCEL)}</button>
        </div>
      </Modal>
    </div>
  );
};

export default BeforeAfter;
