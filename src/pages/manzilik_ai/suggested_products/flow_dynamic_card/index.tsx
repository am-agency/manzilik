import React from 'react';
import UserPoints from '../../components/user_points';
import icons from '../../../../assets/icons';
import LogosBox from '../premium_box/logos_box';
import { aiIcons } from '../../../../assets/icons/ai';
import { Button } from 'antd';
import { useSimilarProductsService } from '../useSimilarProductsService';
import { AISimilarProductFeature } from '../../../../API';
import { useLocation } from 'react-router-dom';
import { PREVIEW_YOUR, VIEW_SELLERS_PRODUCTS } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';

interface Props {
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
  onHandleCreditDeduction: () => void;
}

const FlowDynamicCard: React.FC<Props> = ({ setIsDrawerOpen, onHandleCreditDeduction }) => {
  const { t } = useTranslation();
  const { isCreditDeductionLoading } = useSimilarProductsService();

  return (
    <>
      <div className="header">
        <img src={icons.rightArrowSlim} alt="label" onClick={() => setIsDrawerOpen(false)} />
        <p className="title">{t(VIEW_SELLERS_PRODUCTS)}</p>
        <UserPoints />
      </div>
      <LogosBox />
      <div className="list-container">
        <div className="list-item">
          <img src={aiIcons.checked} alt="" />
          <p> عرض جميع البائعين ضمن النتائج </p>
        </div>
        <div className="list-item">
          <img src={aiIcons.checked} alt="" />
          <p> عرض جميع البائعين ضمن النتائج </p>
        </div>
      </div>
      <div className="horizontal-line"></div>
      <div className="action-card">
        <div className="action-card-left">
          <p className="action-card-title">سيتم خصم</p>
          <p className="action-card-sub-title">3 نقاط من رصيدك</p>
        </div>
        <div className="action-card-right">
          <Button loading={isCreditDeductionLoading} onClick={onHandleCreditDeduction} className="action-card-button">
            {t(PREVIEW_YOUR)}
          </Button>
        </div>
      </div>
    </>
  );
};

export default FlowDynamicCard;
