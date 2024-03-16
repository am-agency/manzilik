import React from 'react';
import { Button, Row, Switch } from 'antd';

interface Props {
  onChange: Function;
  type: string;
  defaultValue: string;
  firstLabel: string;
  secondLabel: string;
  disabled?: boolean;
}

export const CustomSwitch = ({ onChange, type, firstLabel, secondLabel, defaultValue, disabled }: Props) => {
  const renderSwitchChildren = () => (
    <Row justify="space-between">
      <Button type="text">{firstLabel}</Button>
      <Button type="text">{secondLabel}</Button>
    </Row>
  );

  return (
    <div className="custom-switch">
      <Switch
        checked={type == defaultValue}
        size="default"
        onChange={(value) => {
          onChange(value);
        }}
        className={type}
        unCheckedChildren={renderSwitchChildren()}
        checkedChildren={renderSwitchChildren()}
        disabled={disabled || false}
      />
    </div>
  );
};
