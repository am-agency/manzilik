import React from 'react';

interface Props {
  title?: string;
  icon?: string;
}

export const ModalTitle: React.FunctionComponent<Props> = ({ title, icon }: Props) => {
  return (
    <div>
      <img src={icon} /> {title}
    </div>
  );
};
