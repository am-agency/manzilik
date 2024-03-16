import React, { useEffect, useMemo } from 'react';
import { StockRecord } from '../../../../API';
import icons from '../../../../assets/icons';
import { colorsHexCode } from '../../../ideas/utils';
import { useProductAttributes } from '../../product_details/hooks/useProductAttributes';
import { Tooltip, Typography } from 'antd';
import { textSubstring } from '../../../../utils';

interface Props {
  stockRecord: StockRecord;
}

export const ProductAttributes = ({ stockRecord }: Props) => {
  const { colorAttributes, dimensionsAttributes, attributes } = useProductAttributes({ stockRecord });

  const colorsSummary = useMemo(() => {
    return colorAttributes.length === 1 ? colorAttributes[0] : `+${colorAttributes.length}`;
  }, [colorAttributes]);

  const dimensionsSummary = useMemo(() => {
    return `+${dimensionsAttributes.length}`;
  }, [dimensionsAttributes]);

  return (
    <section className="attributes-info">
      <span className="attribute-info colors">
        {colorAttributes.length > 1 ? (
          <img className="multi-colors" src={icons.colors} alt="colors" />
        ) : (
          <span
            className="color-box large"
            style={{ background: colorsHexCode[colorAttributes[0]?.toLowerCase()] }}
          ></span>
        )}
        <span className="colors-summary">
          <Tooltip placement="right" title={colorsSummary}>
            <Typography.Text>{textSubstring(colorsSummary, 10)}</Typography.Text>
          </Tooltip>
        </span>
      </span>
      <span className="attribute-info dimensions">
        <span className="dimension-summary">{dimensionsAttributes[0]}</span>
        {dimensionsAttributes.length > 1 ? <span className="dimension-summary">{dimensionsSummary}</span> : null}
      </span>
    </section>
  );
};
