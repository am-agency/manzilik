import React, { useEffect, useState } from 'react';
import ImageMapper from 'react-img-mapper';
import { Idea } from '../../../../API';
import { ideaIcons } from '../../../../assets/icons/idea';
import { GoogleVisionResult } from '../../types';

interface Area {
  id?: string;
  name?: string;
  shape: string;
  coords: number[];
  href?: string | undefined;
  scaledCoords?: number[];
  center?: number[];
  strokeColor?: string;
  fillColor?: string;
  lineWidth?: number;
}

interface Props {
  idea: Idea;
}

export const GoogleVision = ({ idea }: Props) => {
  const [hoveredArea, setHoveredArea] = useState<Area>();
  const [selectedArea, setSelectedArea] = useState<Area>();
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const getSectionDimentions = () => {
    const canvas = document.getElementById('canvas');
    setWidth(canvas?.clientWidth);
    setHeight(canvas?.clientHeight);
  };

  const computeCenter = (coords: number[]) => {
    if (!coords) {
      return [0, 0];
    }
    const n = coords.length / 2;
    // this is to compute the mid point between all polgon points
    const { y: scaleY, x: scaleX } = coords.reduce(
      ({ y, x }, val, idx) => (!(idx % 2) ? { y, x: x + val / n } : { y: y + val / n, x }),
      { y: 0, x: 0 }
    );
    return [scaleX, scaleY];
  };

  const getCoordinates = () => {
    let obj = idea?.google_vision_result!;
    obj = idea?.google_vision_result!.replaceAll("'", '"')!;
    const googleVisonResult: GoogleVisionResult = idea?.google_vision_result ? JSON?.parse(obj) : {};
    if (googleVisonResult && googleVisonResult.responses[0]?.localizedObjectAnnotations && width && height! > 0) {
      const data = googleVisonResult.responses[0]?.localizedObjectAnnotations?.map((elm, index) => {
        let coords: number[] = [];
        elm.boundingPoly?.normalizedVertices?.forEach((item) => {
          const scaleX = item.x ? item.x * width! : 0;
          const scaleY = item.y ? item.y * height! : 0;
          coords.push(scaleX, scaleY);
        });

        const area = {
          id: index.toString(),
          name: elm.name,
          shape: 'poly',
          coords,
          strokeColor: 'white',
          fillColor: 'transparent',
          lineWidth: 1,
          center: computeCenter(coords),
        };
        coords = [];
        return area;
      });

      return { name: 'areas', areas: data || [] };
    }
  };

  const enterArea = (area: Area) => {
    setHoveredArea(area);
  };

  const onAreaClick = (area: Area) => {
    setSelectedArea(area);
  };

  const onLoad = () => {
    getSectionDimentions();
  };

  useEffect(() => {
    getSectionDimentions();
  }, []);

  const onImageClick = () => {
    setSelectedArea(undefined);
  };

  return (
    <div className="img-mapper-container">
      {idea.google_vision_result ? (
        <ImageMapper
          onLoad={onLoad}
          src={idea?.photo!}
          width={width}
          stayHighlighted={selectedArea !== undefined}
          map={getCoordinates()}
          onClick={(area) => onAreaClick(area)}
          onMouseEnter={(area) => enterArea(area)}
          onMouseMove={(area) => enterArea(area)}
          onImageClick={onImageClick}
        />
      ) : (
        <img src={idea?.photo!} className="img-fit-content default-image" />
      )}
      {idea?.google_vision_result &&
        getCoordinates()?.areas?.length !== 0 &&
        getCoordinates()?.areas.map((point, index) => {
          const x = point?.center![0];
          const y = point?.center![1];
          return (
            <>
              {!selectedArea || selectedArea?.center![1] !== y ? (
                <img
                  key={index}
                  src={ideaIcons.tag1}
                  className="selected-area"
                  style={{
                    top: y,
                    left: x,
                  }}
                />
              ) : (
                <span
                  className="img-mapper-tooltip"
                  style={{
                    top: y,
                    left: x,
                  }}
                >
                  {selectedArea?.name}
                </span>
              )}
            </>
          );
        })}
    </div>
  );
};
