import React, { FunctionComponent } from 'react';
import { Image } from 'antd';
import { Idea } from '../../../API';
import { getOriginalPhoto } from '../utils';

interface Props {
  ideas: Idea[];
  visible: boolean;
  setVisible: Function;
  defaultIdea: Idea;
}

export const ZoomInIdea: FunctionComponent<Props> = ({ ideas, visible, setVisible, defaultIdea }: Props) => {
  return (
    <>
      <div className="images-group-wrapper">
        <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
          <Image
            className="img-fit-content rounded-border"
            src={getOriginalPhoto(defaultIdea?.photo!)}
            alt={defaultIdea?.title}
          />
          {ideas.map((idea) => {
            return (
              <div className="img-container" key={idea.id}>
                <Image
                  className="img-fit-content rounded-border"
                  src={getOriginalPhoto(idea.photo!)}
                  alt={idea?.title}
                />
              </div>
            );
          })}
        </Image.PreviewGroup>
      </div>
    </>
  );
};
