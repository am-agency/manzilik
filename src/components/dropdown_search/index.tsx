import React, { useContext, useEffect, useState } from 'react';
import { getLayoutDirection } from '../../app/layouts';
import { useTranslation } from 'react-i18next';
import icons from '../../assets/icons';
import { BEST_SELLERS_IN_KINGDOM, LOADING, NOT_EXIST, VIEW_PRODUCTS, VIEW_SELLERS } from '../../locales/strings';
import { aiIcons } from '../../assets/icons/ai';
import {
  ObjectRecognitionContext,
  ObjectRecognitionProps,
} from '../../pages/manzilik_ai/suggested_products/object_recognation_context';
import { Vendors } from '../../API';
import * as analytics from '../../analytics';

export interface DropdownSearchOption {
  id: string;
  name: string;
}

interface DropdownProps {
  options: Vendors[];
  onSelect: (selectedOptions: Vendors[]) => void;
  dropdownTitle: string;
  inputPlaceholder?: string;
  onSeeMoreClick?: () => void;
  isObjectPurchased?: boolean;
}

const DropdownWithSearch: React.FC<DropdownProps> = (props) => {
  const { options, onSelect, dropdownTitle, inputPlaceholder = '', onSeeMoreClick, isObjectPurchased } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Vendors[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('isObjectPurchased', isObjectPurchased);
  }, [isObjectPurchased]);
  const { listPremiumVendors, isFlowOne, isVendorsLoading } = useContext(
    ObjectRecognitionContext
  ) as ObjectRecognitionProps;

  const handleSelectOption = (option: Vendors) => {
    const isSelected = selectedOptions.some((selected) => selected.id === option.id);
    if (!isSelected) {
      const newSelectedOptions = [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      onSelect(newSelectedOptions);
    }
  };
  const handleRemoveOption = (option: Vendors) => {
    const newSelectedOptions = selectedOptions.filter((selected) => selected.id !== option.id);
    setSelectedOptions(newSelectedOptions);
    onSelect(newSelectedOptions);
  };
  const onOptionClick = (option: Vendors) => {
    const isSelected = selectedOptions.some((selected) => selected.id === option.id);
    if (isSelected) {
      handleRemoveOption(option);
    } else {
      handleSelectOption(option);
    }
    analytics.PublishEvent(new analytics.AnalyticFilterManufacturerEvent(option.name!));
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const filteredOptions = options.filter((option) => option.name!.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div
      className="dropdown-with-search-wrapper"
      style={{
        direction: getLayoutDirection(i18n.language),
      }}
    >
      <div className="title" onClick={handleToggleDropdown}>
        <span>{selectedOptions.length > 0 ? `${dropdownTitle}: ${selectedOptions.length}` : dropdownTitle}</span>
        <img src={isDropdownOpen ? icons.arrowUp.icon : icons.arrowDown.icon} className="arrow-icon" />
      </div>
      {isDropdownOpen && (
        <div className="dropdown-with-search">
          <input
            className="search-input"
            type="text"
            placeholder={inputPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="options-list">
            {filteredOptions.map((option) => (
              <li key={option.id} onClick={() => onOptionClick(option)}>
                {selectedOptions.some((selected) => selected.id === option.id) ? (
                  <img src={icons.checked} />
                ) : (
                  <img src={icons.unChecked} />
                )}
                {option.name}
              </li>
            ))}
            {filteredOptions.length === 0 && <li className="no-results">{t(NOT_EXIST)}</li>}
          </ul>
          {!isObjectPurchased && (
            <div className="premium-list">
              <p>{t(BEST_SELLERS_IN_KINGDOM)}</p>
              <div className="locked-sellers">
                <img src={aiIcons.lock2} alt="Seller Image" />
                <p className="test" onClick={onSeeMoreClick}>
                  {isFlowOne ? t(VIEW_SELLERS) : t(VIEW_PRODUCTS)}
                </p>
              </div>
              {isFlowOne && (
                <ul>
                  {isVendorsLoading
                    ? t(LOADING)
                    : listPremiumVendors?.map((vendor) => (
                        <li key={vendor.id}>
                          <img src={icons.disabledCheck!} alt="vendor logo" />
                          {vendor.name}
                        </li>
                      ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownWithSearch;
