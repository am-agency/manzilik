import React, { FunctionComponent } from 'react';
import { Radio } from 'antd';
import i18n from '../../../../../app/i18n';
import { RoomType } from '../../../../../API';
import { getRoomTitle } from '../../../utils';
import Form from 'antd/lib/form';
import { required } from '../..';
import { getLayoutDirection } from '../../../../../app/layouts';

interface Props {
  roomTypesList: RoomType[];
  updateRoomType?: Function;
}

export const RoomTypesList: FunctionComponent<Props> = (props: Props) => {
  const { roomTypesList } = props;

  return (
    <Form.Item
      validateTrigger="onBlur"
      name="room_type_id"
      className={`room-types-item ${getLayoutDirection(i18n.language)}`}
      rules={[required]}
    >
      <Radio.Group>
        {roomTypesList?.map((roomType) => (
          <Radio.Button
            key={roomType.id}
            value={roomType.id}
            onClick={() => {
              props.updateRoomType?.(roomType.id);
            }}
          >
            {getRoomTitle(roomType, i18n.language)}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};
