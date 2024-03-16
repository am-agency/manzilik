import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import React, { FunctionComponent } from 'react';

interface SeparatorProps {
  vertical?: number;
  horizontal?: number;
  responsive?: boolean;
}

const Separator: FunctionComponent<SeparatorProps> = (props: SeparatorProps) => {
  const { xl, lg, md, sm, xs } = useBreakpoint();
  const verticalSpacing = props.vertical || 0;
  let horizontalSpacing = props.horizontal || 0;

  const getSpacing = () => {
    if (!props.responsive) {
      return horizontalSpacing;
    } else if (xl) {
      horizontalSpacing = horizontalSpacing;
    } else if (lg) {
      horizontalSpacing = horizontalSpacing - 8;
    } else if (md) {
      horizontalSpacing = horizontalSpacing - 16;
    } else if (sm || xs) {
      horizontalSpacing = horizontalSpacing - 24;
    }
    return horizontalSpacing < 8 ? 8 : horizontalSpacing;
  };

  return (
    <div
      className="separator"
      style={{ padding: `${(props.vertical || 0) / (xs ? 2 : 1)}px ${(props.horizontal || 0) / (xs ? 2 : 1)}px` }}
    />
  );
};

export default Separator;
