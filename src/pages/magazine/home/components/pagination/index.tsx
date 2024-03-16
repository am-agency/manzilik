import { Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import icons from '../../../../../assets/icons';
import { AR } from '../../../../../locales/constants';
import { PREV_PAGE, NEXT_PAGE } from '../../../../../locales/strings';

interface Props {
  currentPage: number;
  setCurrentPage: Function;
  hasMore: boolean;
  totalPages: number;
}

const Pagination = (props: Props) => {
  const { t, i18n } = useTranslation();
  const { currentPage, setCurrentPage, hasMore, totalPages } = props;
  const pageForView = currentPage + 1;
  const history = useHistory();

  if (totalPages <= 1) {
    return null;
  }

  const onNext = () => {
    if (pageForView < totalPages) {
      history.push(`${history.location.pathname}?page=${pageForView + 1}`);
      setCurrentPage(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 0) {
      history.push(`${history.location.pathname}?page=${pageForView - 1}`);
      setCurrentPage(currentPage - 1);
    }
  };

  const onPage = (page: number) => {
    history.push(`${history.location.pathname}?page=${page + 1}`);
    setCurrentPage(page);
  };

  return (
    <Row justify="center" align="middle" className="pagination">
      {pageForView > 1 && (
        <span className="clickable" onClick={onPrevious}>
          <img className="left-icon" src={i18n?.language === AR ? icons.rightArrow.icon : icons.leftArrow.icon} />
          {t(PREV_PAGE)}
        </span>
      )}
      <div className="pagination-wrapper">
        {Array.from({ length: totalPages }).map((el, i) => (
          <div
            key={i}
            onClick={() => onPage(i)}
            className={`pagination-num ${pageForView === i + 1 ? 'selected' : ''}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      {currentPage > 5 && <div>. . .</div>}
      {currentPage > 5 && <div className={`pagination-num selected`}>{currentPage + 1}</div>}
      {pageForView < totalPages && (
        <span className="clickable" onClick={onNext}>
          {t(NEXT_PAGE)}
          <img className="left-icon" src={i18n.language === AR ? icons.leftArrow.icon : icons.rightArrow.icon} />
        </span>
      )}
    </Row>
  );
};

export default Pagination;
