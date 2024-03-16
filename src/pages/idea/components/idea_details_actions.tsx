import React, { FunctionComponent, useState } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../../app/layouts';
import { ideaIcons } from '../../../assets/icons/idea';
import { SAVE, SEND } from '../../../locales/strings';
import icons from '../../../assets/icons';
import { Idea } from '../../../API';
import { ZoomInIdea } from './zoom_in_idea';

interface Props {
  onShareIdea: () => void;
  onSaveIdea: () => void;
  isIdeaSelected: boolean;
  defaultIdea: Idea;
  ideas: Idea[];
}

export const IdeaDetailsActions: FunctionComponent<Props> = ({
  onShareIdea,
  onSaveIdea,
  isIdeaSelected,
  defaultIdea,
  ideas,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [isZoomingIn, setIsZoomingIn] = useState<boolean>(false);

  const onZoomIdea = () => {
    setIsZoomingIn(true);
  };

  return (
    <>
      <div className="share">
        <div className={`img-icon ${getLayoutDirection(i18n.language)}`} onClick={onShareIdea}>
          <img src={icons.email.icon} /> <Typography.Text>{t(SEND)}</Typography.Text>
        </div>
      </div>
      <div className="save">
        <div className={`img-icon ${getLayoutDirection(i18n.language)}`} onClick={onSaveIdea}>
          <img src={isIdeaSelected ? ideaIcons.saved.icon : ideaIcons.save.icon} />
          <Typography.Text>{t(SAVE)}</Typography.Text>
        </div>
      </div>
      <div className="zoom">
        <div className={`img-icon ${getLayoutDirection(i18n.language)}`} onClick={onZoomIdea}>
          <img src={icons.zoomIn.icon} />
        </div>
      </div>
      {isZoomingIn && (
        <ZoomInIdea ideas={ideas} setVisible={setIsZoomingIn} visible={isZoomingIn} defaultIdea={defaultIdea!} />
      )}
    </>
  );
};
