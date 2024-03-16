import React, { FunctionComponent, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Radio, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Client, ClientAddress } from '../../../../API';
import { useModal } from '../../../../app/providers/modal';
import icons from '../../../../assets/icons';
import { ModalTitle } from '../../../../components/modal_title';
import Separator from '../../../../components/separator';
import {
  ADDRESSES,
  ADD_ADDRESS,
  ARE_YOU_SURE_DELETE_IDEA,
  CANCEL,
  DELETE,
  NEW_ADDRESS,
  NO_ADDED_ADDRESSES,
  SAVE_UPDATES,
  SHIPPING_ADDRESSES,
  START_SAVING_YOUR_ADDRESS_TO_DELIVER_THE_PRODUCTS,
} from '../../../../locales/strings';
import { PrivateProfileHeader } from '../components/profile_header';
import { AddAddress } from './forms/add_address';
import { useMainContext } from '../../../../app/providers/main';
import { addAddress, deleteAddress, updateAddress } from '../../api';
import { UPDATE_ADDRESS } from '../../../../app/settings';
import DropdownPopover from '../../../../components/dropdown_popover';
import { DONE } from '../../../projects/constants';
import { profileIcons } from '../../../../assets/icons/profile';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../../app/providers/main/loading_constants';
import { shoppingIcons } from '../../../../assets/icons/shopping';
import { AddressDetails } from './components/address_details';

interface Props {
  client: Client;
  getClientData?: Function;
  isShipppingAddress?: boolean;
  onSelectAddress?: Function;
  value?: ClientAddress;
}

export const AddressesTab: FunctionComponent<Props> = ({
  client,
  getClientData,
  isShipppingAddress = false,
  onSelectAddress,
  value,
}: Props) => {
  const { t } = useTranslation();
  const { showModal, form } = useModal();
  const { requestApi } = useMainContext();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { addresses } = client || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    const { country, city, neighborhood, name, description, type, fullname, email, phone_number } = values;
    const username = fullname?.split(' ');
    let id;
    if (type) {
      id = values.id;
    } else {
      delete values.id;
    }

    const params = {
      id,
      city_id: city,
      country_id: country,
      neighborhood_id: neighborhood,
      name,
      description,
      first_name: username[0],
      last_name: username[1],
      email,
      phone_number,
      is_default: false,
    };

    const endpoint = type ? updateAddress : addAddress;
    requestApi(
      endpoint,
      params,
      (response: { id: number }, error: string) => {
        if (error) {
          return;
        }
        if (response.id >= 0) {
          getClientData?.();
        }
      },
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };

  const onDeleteAddress = (id: string) => {
    requestApi(
      deleteAddress,
      { id },
      (_: {}, error: string) => {
        if (error) {
          return;
        } else {
          getClientData?.();
        }
      },
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };

  const onVisibleChange = () => {
    setIsOpen(false);
    setTimeout(() => {
      // reset the state
      setIsOpen(true);
    }, 1000);
  };

  const onClick = (current?: ClientAddress, type?: string) => {
    const addressTitle = type ? current?.name! : t(NEW_ADDRESS);
    showModal(
      <ModalTitle title={type ? addressTitle : t(ADD_ADDRESS)} icon={profileIcons.addAddress} />,
      <AddAddress address={current!} type={type} onFinish={onFinish} form={form!} />,
      'modal-wrapper address-modal',
      type ? t(SAVE_UPDATES) : t(ADD_ADDRESS)
    );
  };

  const renderAddressAction = (elm: ClientAddress) => {
    return (
      <Row className="address-icons" wrap={false}>
        <div className="edit-wrapper icon" onClick={() => onClick(elm!, UPDATE_ADDRESS)}>
          <img src={icons.edit.icon} />
        </div>
        <Separator horizontal={6} />
        <DropdownPopover
          trigger={'click'}
          placement={isShipppingAddress ? 'bottom' : 'top'}
          className="delete-address-popover"
          showPopOver={isOpen}
          content={
            <div>
              <Typography.Text className="delete-msg">{t(ARE_YOU_SURE_DELETE_IDEA)} </Typography.Text>
              <br />
              <Row gutter={12} className="btns-container">
                <Col span={12}>
                  <Button className="popover-btn delete" onClick={() => onDeleteAddress(elm?.id!)}>
                    {t(DELETE)}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button className="popover-btn cancel" onClick={onVisibleChange}>
                    {t(CANCEL)}
                  </Button>
                </Col>
              </Row>
            </div>
          }
        >
          <div className="delete-wrapper icon">
            <img src={icons.whiteDelete} />
          </div>
        </DropdownPopover>
      </Row>
    );
  };

  return (
    <Row className="addresses-tab">
      <Col span={isShipppingAddress ? 24 : 22}>
        <PrivateProfileHeader
          title={isShipppingAddress ? t(SHIPPING_ADDRESSES) : t(ADDRESSES)}
          toolbar={
            <Button
              icon={<PlusOutlined className="edit-profile__action-button__icon" />}
              className="edit-profile__action-button"
              // this syntax because I pass an optional param to the same function
              onClick={() => onClick()}
            >
              {t(ADD_ADDRESS)}
            </Button>
          }
        />
        <Separator vertical={10} />
        {isShipppingAddress ? (
          <div className="radio-group-container-custom">
            <Radio.Group className="radio-group-container" value={value?.id}>
              <Row justify="space-between" gutter={10}>
                {addresses?.results?.map((elm) => {
                  return (
                    <Col xl={12} lg={12} md={12} sm={24} xs={24} key={elm?.id}>
                      <Radio value={elm?.id} className="radio-wrapper" onChange={() => onSelectAddress?.(elm)}>
                        <Row className="address-container" align="middle" justify="space-between">
                          <Col xl={16} lg={16} sm={16} xs={16}>
                            <div>
                              <div className="address-title"> {elm?.name} </div>
                              <div className="address-wrapper">
                                <Typography.Text className="address-details">{`${elm?.country?.name}, ${elm?.city?.name}, ${elm?.neighborhood?.name} `}</Typography.Text>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Separator vertical={10} />
                      </Radio>
                      <Col xl={6} sm={8} xs={8} className="actions-container">
                        {renderAddressAction(elm!)}
                      </Col>
                    </Col>
                  );
                })}
              </Row>
            </Radio.Group>

            {addresses?.results.length == 0 && (
              <div className="no-shipping-address">
                <img src={shoppingIcons.noAddress} />
                <h4 className="text"> {t(NO_ADDED_ADDRESSES)} </h4>
                <p className="description"> {t(START_SAVING_YOUR_ADDRESS_TO_DELIVER_THE_PRODUCTS)} </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {addresses?.results?.map((elm) => {
              return (
                <div key={elm?.id}>
                  <Row className="address-container" align="middle" justify="space-between">
                    <Col span={16}>
                      <AddressDetails client={client} address={elm!} />
                    </Col>
                    <Col>{renderAddressAction(elm!)}</Col>
                  </Row>
                  <Separator vertical={10} />
                </div>
              );
            })}
          </div>
        )}
      </Col>
    </Row>
  );
};
