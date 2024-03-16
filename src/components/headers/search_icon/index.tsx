import React, { useEffect } from 'react';
import { Modal, Row } from 'antd';
import { searchIcons } from '../../../assets/icons/search';
import { useHistory } from 'react-router-dom';
import { SearchAutoComplete } from '../../../pages/ideas/auto_complete';
import { getLayoutDirection } from '../../../app/layouts';
import i18n from '../../../app/i18n';

const SearchIcon = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const history = useHistory();

  const onShowSearchModal = () => {
    setIsVisible(true);
  };
  useEffect(() => {
    setIsVisible(false);
  }, [history?.location]);
  return (
    <>
      <Row justify="center" align="middle" className="search-wrapper clickable" onClick={onShowSearchModal}>
        <img src={searchIcons.whiteSearch} alt="search icon" />
      </Row>
      <Modal
        onCancel={() => setIsVisible(false)}
        destroyOnClose
        closable={false}
        forceRender={true}
        visible={isVisible}
        className={`modal-wrapper search-modal ${getLayoutDirection(i18n.language)}`}
      >
        <SearchAutoComplete searchSpan={24} btnSpan={0} />
      </Modal>
    </>
  );
};

export default SearchIcon;
