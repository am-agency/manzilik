import React, { FunctionComponent, MouseEventHandler } from 'react';
import { Avatar, Button, List, Rate, Row, Typography } from 'antd';
import { FOLLOW, PROJECT } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import Separator from '../../../../components/separator';
import { Professional } from '../../../../API';
import { getClientProfileLink, getUserName, textSubstring } from '../../../../utils';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import ContactActions from './contact-actions';
import icons from '../../../../assets/icons';
import { ClientBadgesAndRewords } from '../../../clients_landing_page/components/client-padges-and-rewords';
import { useProfessional } from '../../../professionals/hooks/useProfessional';
import CustomTooltip from '../../../../components/custom_tooltip';
import { useMediaQuery } from 'react-responsive';
import { useMainContext } from '../../../../app/providers/main';

interface Props {
  item: Professional;
  isSmallScreen?: boolean;
}

export const RelatedProfessionalsItem: FunctionComponent<Props> = ({
  item: professional,
  isSmallScreen = false,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const professionalPath = getClientProfileLink(professional?.client!);
  const handleConnectProfessional: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    history.push(professionalPath);
  };
  const { getProfessionalUserName } = useProfessional();
  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });

  const stringLength = isSmallScreen ? 20 : 38;
  const { generalSettings } = useMainContext();
  const showReview = generalSettings?.showProfessionalReviews;

  return (
    <>
      <div className="related-professional-item">
        <List.Item>
          <List.Item.Meta
            avatar={
              <Link to={professionalPath}>
                <Avatar size={33} src={professional?.client?.profile_image} />
              </Link>
            }
            title={
              <CustomTooltip text={getProfessionalUserName(professional)}>
                <Link to={professionalPath}>
                  <p
                    style={{
                      fontSize: isMobileView ? '14px' : 'normal',
                    }}
                  >
                    {textSubstring(getProfessionalUserName(professional), stringLength)}
                  </p>
                </Link>
              </CustomTooltip>
            }
            description={
              <>
                <Row className="related-professional-item-title">
                  <Typography.Text>{professional?.client?.project_role}</Typography.Text>
                  <div className="related-professional-item-rate">
                    <Typography.Text>
                      <span className="projects-number">{professional?.projects_count} </span>&nbsp;
                      {t(PROJECT)}
                    </Typography.Text>

                    {showReview && (
                      <div className="rating">
                        <span className="rating-number">{professional?.reviews_count}</span>
                        &nbsp;&nbsp;&nbsp;
                        <Rate value={Number(professional?.reviews_total)} disabled allowHalf />
                      </div>
                    )}
                  </div>
                </Row>

                <ClientBadgesAndRewords client={professional?.client} withOutLabel />
              </>
            }
          />
          <div className={`actions-wrapper ${isMobileView ? 'bottom' : ''}`}>
            <ContactActions item={professional} />
          </div>
          <Button className="follow-btn" onClick={handleConnectProfessional}>
            <img src={icons.prof_add} alt="add" />
            {t(FOLLOW)}
          </Button>
        </List.Item>
      </div>
      <Separator vertical={9} />
    </>
  );
};
