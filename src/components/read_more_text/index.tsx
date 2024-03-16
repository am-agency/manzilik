import { Col, Row, Typography } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import icons from '../../assets/icons';
import { SHOW_LESS } from '../../locales/strings';

interface Props {
  text: string;
  actionText: string;
  link?: string;
  maxLength?: number;
  gradientColor?: string;
}

// TODO: Refactor this component  https://www.geeksforgeeks.org/how-to-create-a-read-more-component-in-reactjs/
const ReadMoreText: FunctionComponent<Props> = ({ text, actionText, link, maxLength, gradientColor }: Props) => {
  const [expand, toggleExpand] = useState(false);
  const maxLengthToKeep = maxLength || 160;
  const isTextOverFlow = text?.length >= maxLengthToKeep;
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    toggleExpand(text?.length <= maxLengthToKeep);
  }, [text]);

  const handleToggle = () => {
    if (!link) {
      toggleExpand(!expand);
    } else {
      history.push(link);
    }
  };

  const backgroundColor = gradientColor || 'white';
  const gradientStyle = {
    backgroundColor: 'transparent',
    backgroundImage: `linear-gradient(transparent, transparent, ${backgroundColor})`,
  };

  return (
    <Row className="read-more-text">
      <Col xl={24} lg={24} md={24} xs={23} sm={23}>
        <Typography.Text>{expand ? text : text?.substr(0, maxLengthToKeep)}</Typography.Text>
        {!expand && isTextOverFlow && <div className="overlay" style={gradientStyle} />}
      </Col>
      {text?.length > maxLengthToKeep && isTextOverFlow && (
        <Row className="read-more-btn">
          <div className={'clickable'} onClick={handleToggle}>
            {!expand ? actionText : t(SHOW_LESS)}
          </div>
          <img src={expand ? icons.arrowUp.icon : icons.arrowDown.icon} className="arrow-icon" />
        </Row>
      )}
    </Row>
  );
};

export default ReadMoreText;
