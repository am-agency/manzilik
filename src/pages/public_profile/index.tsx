import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Container } from '../../components/container';
import { ProfileHeader } from './components/profile_header';
import { AboutMe } from './components/about_me';
import Separator from '../../components/separator';
import { UserIdeasList } from '../../components/user_ideas_list';
import { Client } from '../../API';
import { useMainContext } from '../../app/providers/main';
import { getClient } from './api';
import { useParams } from 'react-router';
import { isArrayEmpty } from '../../utils';
import i18n from '../../app/i18n';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';

export const PublicProfile: FunctionComponent = () => {
  const { clientData, refreshGetClientData } = useContext(SharedStateContext) as SharedStateInterface;
  const { requestApi, userState } = useMainContext();
  const { id }: { id: string } = useParams();

  const isThereClientData =
    !isArrayEmpty(clientData?.client_awards) ||
    !isArrayEmpty(clientData?.client_badges) ||
    !isArrayEmpty(clientData?.about_me);

  return (
    <Container>
      <Separator vertical={13} />
      {clientData && <ProfileHeader clientData={clientData!} refetchClient={refreshGetClientData!} />}
      {isThereClientData && (
        <>
          <AboutMe clientData={clientData!} />
          <Separator vertical={15} />
        </>
      )}
      <UserIdeasList id={id} />
    </Container>
  );
};

export default PublicProfile;
