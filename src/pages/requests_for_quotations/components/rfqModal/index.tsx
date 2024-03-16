import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../../../app/layouts';
import CustomTag from '../../../../components/custom_tag';
import { profileIcons } from '../../../../assets/icons/profile';
import Loader from 'react-spinners/ClipLoader';

interface RfqModalProps {
  isModalVisible: boolean;
  setIsModalVisible: Function;
  width?: number;
  title?: string;
  subTitle?: string;
  btnOneText?: string;
  btnTwoText?: string;
  btnOneAction?: Function | undefined;
  btnTwoAction?: Function | undefined;
  btnOneLoading?: boolean;
  btnTwoLoading?: boolean;
  bodyContent?: React.ReactNode;
  badgeText?: string;
  cancelMode?: boolean;
}

function RfqModal(props: RfqModalProps) {
  const {
    isModalVisible,
    setIsModalVisible,
    width = 342,
    title,
    subTitle,
    btnOneText,
    btnTwoText,
    btnOneAction,
    btnTwoAction,
    bodyContent,
    badgeText,
    btnOneLoading = false,
    btnTwoLoading = false,
    cancelMode = false,
  } = props;
  const [isVisible, setIsVisible] = useState(isModalVisible);
  const { i18n } = useTranslation();

  useEffect(() => {
    setIsVisible(isModalVisible);
  }, [isModalVisible]);
  return (
    <Modal
      className={`rfq-modal-wrapper ${getLayoutDirection(i18n.language)}`}
      visible={isVisible}
      closable={false}
      width={width}
      footer={null}
    >
      <div className="rfq-modal-container">
        {badgeText && (
          <CustomTag>
            <img src={profileIcons.tag2} alt="rfq" />
            &nbsp; &nbsp;
            {badgeText}
          </CustomTag>
        )}
        <div className="rfq-modal-header">
          <p className="title">{title}</p>
          <p className="sub-title">{subTitle}</p>
        </div>
        <div className="rfq-modal-body">{bodyContent}</div>
        <div className="rfq-modal-footer">
          <button
            className={`btn-one ${cancelMode ? 'cancel-mode' : ''}`}
            onClick={() => btnOneAction!()}
            disabled={btnOneLoading}
          >
            {btnOneText}
            {btnOneLoading && <Loader color={'#fff'} size={15} />}
          </button>
          <button className="btn-two" onClick={() => btnTwoAction!()}>
            {btnTwoText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default RfqModal;
