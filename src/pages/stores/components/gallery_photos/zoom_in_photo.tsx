import React, { FunctionComponent } from 'react';
import { Image } from 'antd';
import { GalleryPhoto } from '../../../../API';
interface Props {
  images: GalleryPhoto[];
  visible: boolean;
  setVisible: Function;
  currentPhotoUrl: string;
}

// @TODO: [MZWEB-43] redundunt component need to abstract the logic into a singular component
export const ZoomInPhoto: FunctionComponent<Props> = ({ images, visible, setVisible, currentPhotoUrl }: Props) => {
  return (
    <div className="images-group-wrapper ">
      <div className="preview-group">
        <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
          <Image className="img-fit-content rounded-border" src={currentPhotoUrl} alt="professional-gallery" />
          {images.map((idea) => {
            return (
              <div className="img-container rounded-border" key={idea.id}>
                <Image className="img-fit-content rounded-border" src={idea.photo!} alt="professional-gallery" />
              </div>
            );
          })}
        </Image.PreviewGroup>
      </div>
    </div>
  );
};
