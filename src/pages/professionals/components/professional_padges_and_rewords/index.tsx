import { Row, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Professional } from '../../../../API';
import { BadgesModal } from '../../../../components/badges_modal';
import Separator from '../../../../components/separator';
import { AWARDS, BADGES, HOW_TO_GET, HOW_TO_GET_BAGDES, NO_BADGES } from '../../../../locales/strings';
import icons from '../../../../assets/icons';

interface Props {
  professional: Professional;
  id: string;
}

export const ProfessionalBadgesAndRewords = ({ professional, id }: Props) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  // handle the open badge modal with stop propagation
  const handleOpenBadgeModal = () => {
    setIsModalVisible(true);
  };
  return (
    <>
      {<BadgesModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />}
      {professional?.client?.client_awards?.length !== 0 && (
        <>
          <Separator vertical={12} />
          <div>
            <strong>{t(AWARDS)}</strong>
          </div>
          <Separator vertical={5} />
          <Row>
            {professional?.client?.client_awards?.map((award) => {
              return (
                <>
                  <span key={award?.id} className="badge-wrapper">
                    <Tooltip title={award?.title}>
                      <img src={award?.image!} className="img-fit-content" />
                    </Tooltip>
                  </span>
                  <Separator vertical={4} horizontal={4} />
                </>
              );
            })}
          </Row>
        </>
      )}

      {professional?.client?.client_badges?.length !== 0 && (
        <>
          <Row>
            {professional?.client?.client_badges?.map((badge) => {
              return (
                <>
                  <span key={badge?.id} className="badge-wrapper">
                    <Tooltip title={badge?.title}>
                      <img src={badge?.image!} className="img-fit-content" onClick={handleOpenBadgeModal} />
                    </Tooltip>
                  </span>
                  <Separator vertical={4} horizontal={4} />
                </>
              );
            })}
          </Row>
        </>
      )}
      {professional?.client?.client_awards?.length === 0 && professional?.client?.client_badges?.length === 0 && (
        <div className="no-data">
          <img className="no-data-img" src={icons.empty_state} alt="no data" />
          <p className="no-data-text">{t(NO_BADGES)}</p>
          <span>
            <span
              className="blue-text"
              onClick={() => {
                setIsModalVisible(true);
              }}
            >
              {t(HOW_TO_GET)}
            </span>
            {t(HOW_TO_GET_BAGDES)}
          </span>
        </div>
      )}
    </>
  );
};
