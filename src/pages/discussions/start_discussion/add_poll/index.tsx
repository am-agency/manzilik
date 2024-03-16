import { Button, Col, Input, Row, Typography, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import icons from '../../../../assets/icons';
import discussionsIcons from '../../../../assets/icons/discussions';
import {
  ADD_OPTION,
  ENTER_TEXT_OR_PASTE_MANZILIK_LINK,
  OPTION,
  POLL_OPTIONS,
  YOU_CAN_ENTER_TEXT_LINK_PRODUCT_OR_UPLOAD_AN_IMAGE,
} from '../../../../locales/strings';
import { customRequest, getBase64 } from '../../../../utils';
import { toArrayOrEmpty } from '../../../idea/utils';
import { Discussion, Poll } from '../../types';

interface Props {
  updateDiscussion?: Function;
  discussion?: Discussion;
}

export const isOptionEmpty = (option: Poll) => {
  return Object.keys(option || {})?.length === 0 || option == undefined;
};

const AddPoll: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { updateDiscussion, discussion } = props;
  const [options, addOption] = useState<Poll[] | undefined>(discussion?.polls);
  const [optionsCount, setOptionsCount] = useState(options?.length || 2);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const _options = options || Array.from({ length: optionsCount });
    _options[index] = {
      ..._options[index],
      title: e.target.value,
    };
    addOption([..._options]);
    updateDiscussion?.('polls', _options);
  };

  const onUploadPicture = async (params: UploadChangeParam, index: number) => {
    const _options = options || Array.from({ length: optionsCount });
    _options[index] = {
      ..._options[index],
      photo_url: await getBase64(params.file.originFileObj),
      file: params.file,
    };
    addOption([..._options]);
    updateDiscussion?.('polls', _options);
  };

  return (
    <Row>
      <Col span={24}>
        <div className="add-poll">
          <Typography.Text className="poll-options-text">{t(POLL_OPTIONS)}</Typography.Text>
          <Typography.Text className="you-can-enter-text">
            {t(YOU_CAN_ENTER_TEXT_LINK_PRODUCT_OR_UPLOAD_AN_IMAGE)}
          </Typography.Text>
          {Array.from({ length: optionsCount }).map((elem, index) => (
            <Row className="add-option" wrap={false} key={index}>
              <Upload
                showUploadList={false}
                name="logo"
                listType="picture"
                accept="image/png, image/jpeg, image/gif"
                onChange={(params) => onUploadPicture(params, index)}
                customRequest={customRequest}
              >
                {toArrayOrEmpty(options)[index]?.photo_url ? (
                  <img className="img-fit-content option-img" src={toArrayOrEmpty(options)[index]?.photo_url} />
                ) : (
                  <span className="add-img-btn">
                    <img src={discussionsIcons.image.icon} alt="" />
                  </span>
                )}
              </Upload>
              <Input
                placeholder={`${t(OPTION)}${index + 1}: ${t(ENTER_TEXT_OR_PASTE_MANZILIK_LINK)}`}
                value={toArrayOrEmpty(options)[index]?.title}
                onChange={(e) => onTitleChange(e, index)}
              ></Input>
            </Row>
          ))}

          <Row
            onClick={() => {
              setOptionsCount(optionsCount + 1);
            }}
          >
            <Button type="text" icon={<img src={icons.add_project.icon} />} className="add-option-btn" />
            <Typography.Text className="add-option-btn-text clickable">{t(ADD_OPTION)}</Typography.Text>
          </Row>
        </div>
      </Col>
    </Row>
  );
};
export default AddPoll;
