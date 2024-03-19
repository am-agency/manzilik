export interface Coordinates {
  x: number;
  y: number;
}

export interface AIDesignLabel {
  id: string;
  name: string;
  description: string;
  coordinates: Coordinates[];
  is_purchased?: boolean;
}

export interface ImageLabelProps {
  imageSrc: string;
  labels: AIDesignLabel[];
  onLabelClicked?: (e: React.MouseEvent, label: AIDesignLabel) => void;
  onViewSimilarClicked?: () => void;
}
