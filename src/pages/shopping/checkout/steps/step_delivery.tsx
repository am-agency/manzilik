import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { CheckoutStateType, CurrentOrder } from '..';
import { Client, ClientAddress, ClientAddressList } from '../../../../API';
import { AddressesTab } from '../../../profile/edit_profile/addresses';

interface Props {
  updateOrder: (values: CurrentOrder) => void;
  currentOrder?: CurrentOrder;
  client?: Client;
  getClientData?: Function;
  dispatchNextState: (next: CheckoutStateType) => void;
  loadClientAddresses: () => void;
}

export const StepDelivery: FunctionComponent<Props> = ({
  updateOrder,
  currentOrder,
  client,
  getClientData,
  dispatchNextState,
  loadClientAddresses,
}: Props) => {
  useEffect(() => {
    dispatchNextState(CheckoutStateType.ENTER_DELIVERY);
    if (!client?.addresses) {
      loadClientAddresses();
    }
  }, []);

  const onSelectAddress = (values: ClientAddress) => {
    updateOrder({ address: values });
    dispatchNextState(CheckoutStateType.SELECT_DELIVERY_ADDRESS);
  };

  return (
    <div>
      <AddressesTab
        client={client!}
        getClientData={getClientData}
        isShipppingAddress
        onSelectAddress={onSelectAddress}
        value={currentOrder?.address}
      />
    </div>
  );
};
