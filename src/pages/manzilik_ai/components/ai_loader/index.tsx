import React from 'react';
import AILoader from '../../../../assets/gifs/Loading.gif';

interface Props {
  title: string;
}

const AiLoader: React.FC<Props> = ({ title }) => {
  return (
    <div className="ai-loader-container">
      <div className="ai_loader">
        <img src={AILoader} />
        <p>{title}</p>
      </div>
    </div>
  );
};

export default AiLoader;
