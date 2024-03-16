import React from 'react';
import { aiIcons } from '../../../../assets/icons/ai';
import LogosBox from './logos_box';
import { useSimilarProductsService } from '../useSimilarProductsService';

interface PremiumBoxProps {
  onPremiumBoxClick: () => void;
}

const PremiumBox = (props: PremiumBoxProps) => {
  const { onPremiumBoxClick } = props;
  return (
    <div className="premium-box-container" onClick={onPremiumBoxClick}>
      <div className="lock-icon-container">
        <img src={aiIcons.lock} alt="lock" />
      </div>
      <LogosBox />
      <div className="text-container">إضغط لعرض منتجات أكثر مبيعاً </div>
    </div>
  );
};

export default PremiumBox;
