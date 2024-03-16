import React from 'react';
import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { MANZILIK_AI_TAB, NEW, TRENDING } from '../../../../locales/strings';

interface ItemComponentProps {
  item: {
    label: string;
    icon?: string;
    title?: string;
  };
  withIcon?: boolean;
  onItemClicked?: () => void;
  isHeader?: boolean;
}

const ItemComponent = (props: ItemComponentProps) => {
  const { t } = useTranslation();

  const { item, withIcon = false, onItemClicked, isHeader = false } = props;

  return (
    <div className="item-wrapper" onClick={onItemClicked}>
      <div className="first-lvl-item">
        <div className="item-main">
          {withIcon && <img src={item.icon!} alt={item.label || item.title} />}
          <p
            className="title"
            style={{
              fontWeight: isHeader ? 'bold' : 'normal',
            }}
          >
            {t(item.label) || item.title}
          </p>
        </div>
        {item?.label === MANZILIK_AI_TAB && <p className="new-label">{t(TRENDING)}</p>}
      </div>
      <Divider type="horizontal" style={{ marginTop: '0px ', marginBottom: '0px' }} />
    </div>
  );
};

export default ItemComponent;
