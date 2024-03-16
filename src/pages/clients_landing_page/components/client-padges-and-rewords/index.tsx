import { Row, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Client, Professional } from '../../../../API';
import { BadgesModal } from '../../../../components/badges_modal';
import Separator from '../../../../components/separator';
import { AWARDS, BADGES, HOW_TO_GET, HOW_TO_GET_BAGDES, NO_BADGES } from '../../../../locales/strings';
import icons from '../../../../assets/icons';

interface Props {
  client: Client | null | undefined;
  isSmallBadge?: boolean;
  withOutLabel?: boolean;
}

export const ClientBadgesAndRewords = ({ client, isSmallBadge = false, withOutLabel = false }: Props) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  // handle the open badge modal with stop propagation
  const handleOpenBadgeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setIsModalVisible(true);
  };
  return (
    <>
      {<BadgesModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />}
      {client?.client_awards?.length ? (
        <>
          {!withOutLabel && (
            <>
              <Separator vertical={12} />
              <div>
                <strong>{t(AWARDS)}</strong>
              </div>
            </>
          )}

          <Separator vertical={5} />
          <Row>
            {client?.client_awards?.map((award) => {
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
      ) : null}

      {client?.client_badges?.length ? (
        <>
          {!withOutLabel && (
            <>
              <Separator vertical={12} />
              <div>
                <strong>{t(BADGES)}</strong>
              </div>
            </>
          )}

          <Separator vertical={5} />
          <Row>
            {client?.client_badges?.map((badge) => {
              return (
                <>
                  <span
                    key={badge?.id}
                    className="badge-wrapper"
                    style={{
                      width: !isSmallBadge ? '53px' : '23px',
                      height: !isSmallBadge ? '55px' : '25px',
                      cursor: 'pointer',
                    }}
                  >
                    <Tooltip title={badge?.title}>
                      {badge?.image && (
                        <img src={badge?.image!} className="img-fit-content" onClick={handleOpenBadgeModal} />
                      )}
                    </Tooltip>
                  </span>
                  <Separator vertical={4} horizontal={4} />
                </>
              );
            })}
          </Row>
        </>
      ) : null}
      {client?.client_awards?.length === 0 && client?.client_badges?.length === 0 && (
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
