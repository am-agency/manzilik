import React, { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ADD, POINT } from '../../../../locales/strings';
import { aiIcons } from '../../../../assets/icons/ai';
import { useMainContext } from '../../../../app/providers/main';
import { useHistory } from 'react-router-dom';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import { useClient } from '../../../../app/hooks/use_client';
import { DrawerType, ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';

interface UserPointsProps {
  isPackagesPage?: boolean;
  handleOpenDrawer?: () => void;
}

const UserPoints = (props: UserPointsProps) => {
  const { isPackagesPage = false, handleOpenDrawer } = props;
  const { t } = useTranslation();
  const { userState } = useMainContext();
  const { client } = userState;
  const history = useHistory();
  const { client: clientData } = useClient();
  const { setIsAiDrawerOpen, setDrawerType } = useContext(ManzilikAiContext) as ManzilikAiProps;

  const clientPoints = useMemo(() => {
    if (clientData) {
      return clientData?.balance;
    }
  }, [clientData]);

  const HandleOpenDrawer = () => {
    setDrawerType!(DrawerType.PACKAGES);
    setIsAiDrawerOpen!(true);
  };

  return (
    <div className="user-points-info">
      <img src={client?.is_purchased ? aiIcons.aiPremium : aiIcons.notPurchased} />
      <div className="num-of-points">
        <span>{clientPoints}</span>
        <span>{t(POINT)}</span>
      </div>
      {!isPackagesPage && (
        <div className="add-points" onClick={() => history.push('/ai-checkout')}>
          {/* <img src={aiIcons.addPoints} alt="" /> */}
          <span>+</span>
          <span>{t(ADD)}</span>
        </div>
      )}
    </div>
  );
};

export default UserPoints;
