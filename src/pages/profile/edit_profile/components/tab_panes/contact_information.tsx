import React from 'react';
import { SuccessMessage } from './../../components/success_message';
import { Client } from '../../../../../API';
import { ContactInfo } from './../../contact_info';

interface Props {
  client: Client;
  onUpdateClientInformation: Function;
  successMessage: boolean;
}

export const ContactInformation = ({ successMessage, client, onUpdateClientInformation }: Props) => {
  return (
    <>
      {!successMessage ? (
        <ContactInfo onUpdateClientInformation={onUpdateClientInformation} client={client!} />
      ) : (
        <SuccessMessage />
      )}
    </>
  );
};
