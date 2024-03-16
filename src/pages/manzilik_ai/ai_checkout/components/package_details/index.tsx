import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { aiIcons } from '../../../../../assets/icons/ai';
import {
  ADD_ACCOUNT_POINTS,
  ALL_OPTIONS_AVAILABLE,
  ALL_PRICES,
  A_LOT_OF_DESIGNS,
  CREATE_DESIGNS,
  DOWNLOAD_IMAGES,
} from '../../../../../locales/strings';
import { Package, PackageList } from '../../../types';
import { useMainContext } from '../../../../../app/providers/main';
import { getListPackages } from '../../../api';
import PackageCard from '../package_card';
import Loader from 'react-spinners/ClipLoader';
import { useHistory } from 'react-router-dom';
interface PackageDetailsProps {
  withHeader?: boolean;
}

function PackageDetails(props: PackageDetailsProps) {
  const { withHeader = false } = props;
  const { t, i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const [listOfPackages, setListOfPackages] = React.useState<Package[] | null>([]);
  const [isListPackagesLoading, setIsListPackagesLoading] = React.useState<boolean>(false);
  const [selectedPackageId, setSelectedPackageId] = React.useState<string | null>(null);

  const getListOfPackages = () => {
    setIsListPackagesLoading(true);
    requestApi(
      getListPackages,
      { limit: 10, offset: 0 },
      (
        response: {
          data: {
            listPackages: PackageList;
          };
        },
        error: string
      ) => {
        if (error) {
          return;
        }

        setIsListPackagesLoading(false);
        setListOfPackages(response.data.listPackages.results);
      }
    );
  };
  const history = useHistory();
  const {
    location: { pathname },
  } = history;

  const isCheckoutPage = pathname.includes('ai-checkout');

  useEffect(() => {
    getListOfPackages();
  }, [i18n.language]);
  return (
    <div className="ai-checkout-body">
      <div>
        {withHeader ? (
          <div className="header">
            <p>{t(ADD_ACCOUNT_POINTS)}</p>
            <p>{t(ALL_PRICES)}</p>
          </div>
        ) : null}

        <div className="title-with-icon">
          <img src={aiIcons.checked} alt="ai Checked" />
          <p className="title">{t(ALL_OPTIONS_AVAILABLE)}</p>
        </div>
        <ul>
          <li>{t(DOWNLOAD_IMAGES)}</li>
          <li>{t(CREATE_DESIGNS)}</li>
        </ul>
        <div className="title-with-icon">
          <img src={aiIcons.checked} alt="ai Checked" />
          <p className="title">{t(A_LOT_OF_DESIGNS)}</p>
        </div>
      </div>
      <div>
        {!isListPackagesLoading ? (
          listOfPackages?.length! > 0 &&
          listOfPackages!.map((item) => (
            <PackageCard
              key={item.id}
              item={item}
              cardType="normal"
              selectedPackageId={selectedPackageId}
              setPackageId={setSelectedPackageId}
              isMostRequested={item.id === '2'}
            />
          ))
        ) : (
          <div className="loader-wrapper">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

export default PackageDetails;
