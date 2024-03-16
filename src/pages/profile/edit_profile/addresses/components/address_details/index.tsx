import { Col, Divider, Row, Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import { Client, ClientAddress } from '../../../../../../API';
import icons from '../../../../../../assets/icons';
import { getUserName } from '../../../../../../utils';

interface Props {
  address: ClientAddress;
  client?: Client;
  renderAddressAction?: Function;
}

export const AddressDetails: FunctionComponent<Props> = ({ address, client }: Props) => {
  return (
    <section className="container">
      <div className="address-title">{address?.name}</div>
      <div className="address-content">
        <Typography.Text className="address-details">{`${address?.country?.name}, ${address?.city?.name}, ${address?.neighborhood?.name} `}</Typography.Text>
        <section className="address-subtitle">
          <img src={icons.pin_location.icon} alt="secure" />
          <span className="tel"> {client?.mobile || address.phone_number} | </span>
          <span className="username"> {getUserName(client) || `${address.first_name} ${address.last_name}`} </span>
        </section>
      </div>
    </section>
  );
};
