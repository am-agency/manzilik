import React from 'react';
import UserPoints from '../user_points';
import { ADD_ACCOUNT_POINTS } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';

interface UserHeaderAIProps {
  title: string;
}

function UserHeaderAI(props: UserHeaderAIProps) {
  const { title } = props;
  const { t } = useTranslation();
  return (
    <div className="user-header">
      <p className="user-header-title"> {title} </p>
      <UserPoints isPackagesPage />
    </div>
  );
}

export default UserHeaderAI;
